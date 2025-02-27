import redis.asyncio as redis
from dotenv import load_dotenv
from .session_manager_firebase import SessionManager
from contextlib import asynccontextmanager
from .bg_worker import background_flush_task
from .bg_pdf_worker import process_pdf_worker
import os
import logging
import asyncio
import json
import base64

# Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, firestore, storage

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
FIREBASE_CREDENTIALS_BASE64 = os.getenv("FIREBASE_CREDENTIALS_BASE64")

async def init_redis():
    """Initialize Redis connection asynchronously."""
    try:
        redis_conn = await redis.from_url(
            url=REDIS_URL,
            password=REDIS_PASSWORD,
            decode_responses=True,
        )
        logging.info("✅ Connected to Redis")
        return redis_conn
    except Exception as e:
        logging.error(f"❌ Failed to connect to Redis: {e}")
        return None

try:
    encoded_credentials = FIREBASE_CREDENTIALS_BASE64
    if not encoded_credentials:
        raise ValueError("Firebase credentials not found in environment variables.")

    # Decode Base64 and load JSON
    decoded_json = json.loads(base64.b64decode(encoded_credentials).decode())

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(decoded_json)
    firebase_admin.initialize_app(cred, {"storageBucket": decoded_json["storageBucket"]})

    # Global Firestore and Storage Clients
    firestore_db = firestore.client()
    firebase_storage = storage.bucket()

    logging.info("✅ Firestore and Firebase Storage initialized.")

except Exception as e:
    logging.error(f"❌ Failed to initialize Firebase: {e}")
    firestore_db = None
    firebase_storage = None

@asynccontextmanager
async def lifespan(app):
    """Manage application startup and shutdown lifecycle."""
    # Initialize Redis and store in app state
    app.state.redis_instance = await init_redis()
    
    # Initialize SessionManager with Redis
    app.state.session_manager = SessionManager(firestore_db, app.state.redis_instance)
    if firestore_db:
        app.state.session_manager_firebase = SessionManager(firestore_db, app.state.redis_instance)
    else:
        app.state.session_manager_firebase = None

    # Start background tasks
    asyncio.create_task(background_flush_task(app.state.redis_instance, firestore_db))
    
    # Start PDF processing worker
    asyncio.create_task(process_pdf_worker(app.state.redis_instance))

    yield  # Keeps the app running

    # Cleanup on shutdown
    if app.state.redis_instance:
        await app.state.redis_instance.close()
        logging.info("❌ Redis connection closed")

    if firebase_admin._apps:
        firebase_admin.delete_app(firebase_admin.get_app())
        logging.info("❌ Firebase connection closed")
