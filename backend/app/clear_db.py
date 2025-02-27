import argparse
import asyncio
import redis.asyncio as redis
import os
from dotenv import load_dotenv
from tinydb import TinyDB
from pinecone import Pinecone
from google.cloud import firestore
from db import firestore_db, firebase_storage

# Load environment variables
load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "development"

db = TinyDB("db.json")

async def clear_redis():
    """Clears the Redis database."""
    redis_instance = await redis.from_url(
        url=REDIS_URL, password=REDIS_PASSWORD, decode_responses=True
    )
    await redis_instance.flushdb()
    await redis_instance.close()
    print("✅ Redis database cleared")

def clear_tinydb():
    """Clears the TinyDB database."""
    db.truncate()
    print("✅ TinyDB database cleared")

def clear_pinecone():
    """Clears the Pinecone index."""
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX_NAME)
    index.delete(delete_all=True)
    print(f"✅ Pinecone index '{PINECONE_INDEX_NAME}' cleared")

def clear_firestore_collection(collection_name):
    """Clears all documents from a Firestore collection."""
    try:
        collection_ref = firestore_db.collection(collection_name)
        docs = collection_ref.stream()

        batch = firestore_db.batch()
        count = 0

        for doc in docs:
            batch.delete(doc.reference)
            count += 1
            # Commit in batches of 500 to avoid Firestore limits
            if count % 500 == 0:
                batch.commit()
                batch = firestore_db.batch()

        batch.commit()  # Commit any remaining deletions

        print(f"✅ Firestore collection '{collection_name}' cleared.")
    except Exception as e:
        print(f"❌ Error clearing Firestore collection '{collection_name}': {e}")

async def main(args):
    """Handles command-line arguments and clears databases accordingly."""
    if args.redis:
        await clear_redis()
    if args.tinydb:
        clear_tinydb()
    if args.pinecone:
        clear_pinecone()
    if args.firestore:
        clear_firestore_collection(args.firestore)
    
    if not any([args.redis, args.tinydb, args.pinecone, args.firestore]):
        print("⚠️ No database specified. Use --redis, --tinydb, --pinecone, or --firestore <collection_name>.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clear different databases.")
    parser.add_argument("--redis", action="store_true", help="Clear Redis database")
    parser.add_argument("--tinydb", action="store_true", help="Clear TinyDB database")
    parser.add_argument("--pinecone", action="store_true", help="Clear Pinecone index")
    parser.add_argument("--firestore", type=str, help="Clear Firestore collection (e.g., 'sessions', 'pdfs', 'users')")

    args = parser.parse_args()

    asyncio.run(main(args))
