import logging
import asyncio
import time
import json
from google.cloud import firestore

async def background_flush_task(redis_instance, firestore_db):
    logging.info("Starting background flush task...")
    while True:
        try:
            if redis_instance is None or not await redis_instance.ping():
                logging.error("❌ Redis instance is unavailable, skipping session flush.")
                await asyncio.sleep(10)
                continue

            active_sessions = await redis_instance.smembers("active_sessions")
            current_time = int(time.time())

            if not active_sessions:
                await asyncio.sleep(20)
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

                session_data = json.loads(session_data) if session_data else {}
                msg_count = len(session_data.get("chat_history", []))  # Calculate message count from session data
                last_msg_timestamp = int(last_msg_timestamp or 0)
                last_flush_time = int(last_flush_time or 0)

                session_ref = firestore_db.collection("sessions").document(chat_session_id)
                session_doc = session_ref.get()

                is_new_session = not session_doc.exists  # True if session doesn't exist in Firestore
                logging.info(f"This session is new: {is_new_session}")

                should_flush = (
                    is_new_session or  # NEW sessions should flush immediately
                    (msg_count >= 6) or  # Flush when there are 6 or more messages
                    ((current_time - last_msg_timestamp) >= 300 and msg_count > 0)  # Flush after 5 minutes of inactivity
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
                            logging.info(f"✅ Created new session {chat_session_id} in Firestore.")
                        else:
                            logging.info(f"✅ Updating existing session {chat_session_id} in Firestore.")
                            batch.update(session_ref, {
                                "chat_history": firestore.ArrayUnion(new_messages),
                                "last_activity": firestore.SERVER_TIMESTAMP
                            })

                        # ✅ Update latest_pdfId in Firestore only if it changed
                        if latest_pdf_id and latest_pdf_id != stored_pdf_id:
                            batch.update(session_ref, {"latest_pdfId": latest_pdf_id})

                        # Use Redis pipeline for batch operations
                        async with redis_instance.pipeline() as pipe:
                            pipe.delete(count_key, timestamp_key, session_key)
                            pipe.srem("active_sessions", chat_session_id)
                            pipe.set(last_flush_key, current_time)
                            await pipe.execute()

                        batch.commit()
                        logging.info(f"✅ Flushed session {chat_session_id} to Firestore with latest_pdfId {latest_pdf_id}.")

                    except json.JSONDecodeError:
                        logging.error(f"❌ Failed to decode session {chat_session_id}, skipping.")

            logging.info(f"✅ Completed session flush check. Current active sessions: {len(active_sessions)}")

        except Exception as e:
            logging.error(f"❌ Error in background_flush_task: {e}")

        await asyncio.sleep(20)

async def cleanup_stale_flush_keys(redis_instance):
    while True:
        try:
            if redis_instance is None or not await redis_instance.ping():
                logging.error("❌ Redis instance is unavailable, skipping cleanup.")
                await asyncio.sleep(60)
                continue

            current_time = int(time.time())
            stale_threshold = current_time - 86400  # 24 hours ago

            # Scan for all session_last_flush keys
            cursor = "0"
            while cursor != 0:
                cursor, keys = await redis_instance.scan(
                    cursor, match="session_last_flush:*", count=100
                )
                for key in keys:
                    last_flush_time = int(await redis_instance.get(key) or 0)
                    if last_flush_time < stale_threshold:
                        await redis_instance.delete(key)
                        logging.info(f"✅ Deleted stale key: {key}")

            await asyncio.sleep(21600)  # Run cleanup every 6 hours

        except Exception as e:
            logging.error(f"❌ Error in cleanup_stale_flush_keys: {e}")
            await asyncio.sleep(60)