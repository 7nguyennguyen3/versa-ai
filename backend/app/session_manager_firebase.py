import redis.asyncio as redis
import os
import json
import asyncio
import logging
import time
from google.cloud import firestore

class SessionManager:
    def __init__(self, db=None, redis_instance=None):
        self.lock = asyncio.Lock()
        self.redis = redis_instance
        self.db = db or firestore.Client()  

    async def init_redis(self):
        """Initialize Redis or crash if it fails."""
        if self.redis is None:
            try:
                self.redis = await redis.from_url(
                    url=os.getenv("REDIS_URL"),
                    password=os.getenv("REDIS_PASSWORD"),
                    decode_responses=True
                )
                logging.info("✅ Redis initialized in SessionManager")
            except Exception as e:
                logging.critical(f"❌ CRITICAL: Failed to initialize Redis: {e}")
                raise RuntimeError("🚨 Cannot connect to Redis. Shutting down.")

    async def add_message(self, chat_session_id: str, user_id: str, pdf_id: str, role: str, message: str):
        """Add a structured message to session history and update Redis keys."""
        async with self.lock:
            session_key = f"session:{chat_session_id}"
            count_key = f"session_count:{chat_session_id}"
            timestamp_key = f"session_last_activity:{chat_session_id}"

            session_data = await self.redis.get(session_key) or json.dumps({"userId": user_id, "pdfId": pdf_id, "chat_history": []})
            session_data = json.loads(session_data)

            # Ensure pdfId is always stored
            session_data["pdfId"] = pdf_id  

            logging.info(f"Storing session: {chat_session_id}, user: {user_id}, pdf: {pdf_id}")

            new_message = {
                "role": role,
                "content": message,
                "timestamp": int(time.time()),
                "pdfId": pdf_id 
            }
            session_data["chat_history"].append(new_message)


            # Save back to Redis
            async with self.redis.pipeline() as pipe:
                pipe.set(session_key, json.dumps(session_data))
                pipe.incr(count_key)
                pipe.set(timestamp_key, int(time.time()))
                pipe.sadd("active_sessions", chat_session_id)
                await pipe.execute()


    async def get_history(self, chat_session_id: str):
        """Retrieve chat history by comparing Firestore and Redis versions, merging only newer messages."""
        async with self.lock:
            session_key = f"session:{chat_session_id}"

            # Fetch from Firestore
            session_ref = self.db.collection("sessions").document(chat_session_id)
            session_doc = session_ref.get()

            firestore_history = session_doc.to_dict().get("chat_history", []) if session_doc.exists else []
            last_firestore_timestamp = firestore_history[-1]["timestamp"] if firestore_history else 0

            # Fetch from Redis
            redis_data = await self.redis.get(session_key)
            if redis_data:
                redis_data = json.loads(redis_data)
                redis_history = redis_data.get("chat_history", [])

                # Merge only newer messages
                new_messages = [msg for msg in redis_history if msg["timestamp"] > last_firestore_timestamp]

                if new_messages:
                    logging.info(f"Merging new messages for session: {chat_session_id}")
                    return firestore_history + new_messages

            logging.info(f"Returning Firestore history for session: {chat_session_id}")
            return firestore_history

    async def clear_session(self, chat_session_id: str):
        """Clear session history in Redis and Firestore."""
        async with self.lock:
            session_key = f"session:{chat_session_id}"
            await self.redis.delete(session_key)

            self.db.collection("sessions").document(chat_session_id).delete()
            logging.info(f"Cleared session: {chat_session_id}")

    async def create_session(self, chat_session_id: str, user_id: str, pdf_id: str, initial_title: str):
        """Create a new session with initial title"""
        session_ref = self.db.collection("sessions").document(chat_session_id)
        session_ref.set({
            "userId": user_id,
            "latest_pdfId": pdf_id,
            "title": initial_title,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
            "chat_history": []
        })

    async def update_session_title(self, chat_session_id: str, new_title: str):
        """Update session title in Firestore with guaranteed valid title"""
        try:
            session_ref = self.db.collection("sessions").document(chat_session_id)
            session_ref.update({
                "title": new_title,
                "updated_at": firestore.SERVER_TIMESTAMP  
            })
            logging.info(f"Updated title for session {chat_session_id} to: {new_title}")
        except Exception as e:
            logging.error(f"Failed to update title for session {chat_session_id}: {e}")
            raise 


    # async def update_session_title(self, chat_session_id: str, message):
    #     MAX_RETRIES = 3
    #     fallback_title = "Untitled Session"
    #     """Update session title in Firestore"""
    #     for attempt in range(MAX_RETRIES):
    #         try:
    #             new_title = await generate_chat_title(message)
    #             session_ref = self.db.collection("sessions").document(chat_session_id)
    #             session_ref.update({
    #                 "title": new_title,
    #                 "updated_at": firestore.SERVER_TIMESTAMP
    #             })
    #             logging.info(f"Successfully updated title for session {chat_session_id} to {new_title}")
    #             return
    #         except Exception as e:
    #             logging.error(f"Attempt {attempt+1}/{MAX_RETRIES} failed: {e}")
    #             if attempt < MAX_RETRIES - 1:
    #                 await asyncio.sleep(3 ** attempt)  # Exponential backoff
    #             else:
    #                 logging.warning(f"All retries failed. Using fallback title: {fallback_title}")
    #                 await session_ref.update({
    #                     "title": fallback_title,
    #                     "updated_at": firestore.SERVER_TIMESTAMP
    #                 })
    #                 return
        