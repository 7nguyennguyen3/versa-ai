import logging
import asyncio
import time
import json
from google.cloud import firestore

async def background_flush_task(redis_instance, firestore_db):
    while True:
        try:
            if redis_instance is None:
                logging.error("❌ Redis instance is unavailable, skipping session flush.")
                await asyncio.sleep(10)
                continue  # Skip this cycle

            active_sessions = await redis_instance.smembers("active_sessions")
            current_time = int(time.time())

            if not active_sessions:
                await asyncio.sleep(10)
                continue  # Skip if no active sessions

            batch = firestore_db.batch()  # Use batch writes for efficiency

            for chat_session_id in active_sessions:
                keys = [
                    f"session_count:{chat_session_id}",
                    f"session_last_activity:{chat_session_id}",
                    f"session_last_flush:{chat_session_id}",
                    f"session:{chat_session_id}"
                ]
                count_key, timestamp_key, last_flush_key, session_key = keys

                # Fetch all values in one call
                count_value, last_msg_timestamp, last_flush_time, session_data = await redis_instance.mget(*keys)

                new_msg_count = int(count_value or 0)
                last_msg_timestamp = int(last_msg_timestamp or 0)
                last_flush_time = int(last_flush_time or 0)

                session_data = json.loads(session_data) if session_data else {}

                session_ref = firestore_db.collection("sessions").document(chat_session_id)
                session_doc = session_ref.get()

                is_new_session = not session_doc.exists  # True if session doesn't exist in Firestore

                should_flush = (
                    is_new_session or  # NEW sessions should flush immediately
                    (new_msg_count >= 2 and new_msg_count % 2 == 0) or
                    ((current_time - last_msg_timestamp) >= 300 and new_msg_count > 0)
                )

                if not should_flush:
                    continue  # Skip flushing if conditions are not met

                if session_data:
                    try:
                        existing_chat_history = session_doc.to_dict().get("chat_history", []) if session_doc.exists else []
                        last_saved_timestamp = existing_chat_history[-1]["timestamp"] if existing_chat_history else 0

                        new_messages = [
                            msg for msg in session_data.get("chat_history", [])
                            if msg["timestamp"] > last_saved_timestamp
                        ]

                        # ✅ Store latest_pdfId instead of pdfId
                        latest_pdf_id = session_data.get("pdfId", "")  
                        stored_pdf_id = session_doc.to_dict().get("latest_pdfId", "") if session_doc.exists else None

                        if is_new_session:
                            batch.set(session_ref, {
                                "userId": session_data.get("userId", ""),
                                "latest_pdfId": latest_pdf_id,  # ✅ Store latest PDF used
                                "chat_session_id": chat_session_id,
                                "chat_history": session_data.get("chat_history", []),
                                "last_activity": firestore.SERVER_TIMESTAMP
                            })
                        elif new_messages:
                            batch.update(session_ref, {
                                "chat_history": firestore.ArrayUnion(new_messages),
                                "last_activity": firestore.SERVER_TIMESTAMP
                            })

                        # ✅ Update latest_pdfId in Firestore only if it changed
                        if latest_pdf_id and latest_pdf_id != stored_pdf_id:
                            batch.update(session_ref, {"latest_pdfId": latest_pdf_id})

                        # Use Redis pipeline for batch operations
                        async with redis_instance.pipeline() as pipe:
                            pipe.delete(count_key, timestamp_key, session_key)  # Remove session data
                            pipe.srem("active_sessions", chat_session_id)
                            pipe.set(last_flush_key, current_time)
                            await pipe.execute()

                        logging.debug(f"✅ Flushed session {chat_session_id} to Firestore with latest_pdfId {latest_pdf_id}.")

                    except json.JSONDecodeError:
                        logging.error(f"❌ Failed to decode session {chat_session_id}, skipping.")

            # Commit batch write to Firestore
            batch.commit()

            logging.debug(f"✅ Completed session flush check. Current active sessions: {len(active_sessions)}")

        except Exception as e:
            logging.error(f"❌ Error in background_flush_task: {e}")

        await asyncio.sleep(10)
