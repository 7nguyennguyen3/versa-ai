import json
import fitz
import logging
from dotenv import load_dotenv
from langchain.text_splitter import TokenTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_voyageai import VoyageAIEmbeddings

load_dotenv()

embeddings = VoyageAIEmbeddings(model="voyage-3")


def get_chunk_params(text_length):
    """Dynamically determines chunk size based on estimated tokens (~1.33 chars per token)."""
    chunk_size = 768
    chunk_overlap = 150

    logging.info(
        f"📏 Using chunk_size={chunk_size}, chunk_overlap={chunk_overlap} for text length {text_length} words"
    )
    return chunk_size, chunk_overlap


async def process_pdf_worker(redis_instance):
    """Continuously listens for PDF ingestion tasks in Redis."""
    logging.info("🚀 PDF ingestion worker started... Listening for tasks.")

    while True:
        try:
            _, task_data = await redis_instance.brpop(
                "pdf_ingestion_queue"
            )  # Blocking pop
            task = json.loads(task_data)
            await process_pdf_ingestion(task["pdfId"], task["userId"])
            logging.info(
                f"✅ PDF ingestion task completed for PDF ID: {task['pdfId']} and User ID: {task['userId']}"
            )

        except Exception as e:
            logging.error(f"❌ Error in PDF ingestion worker: {e}")


async def process_pdf_ingestion(pdf_id: str, user_id: str):
    """Processes a single PDF ingestion task: downloads, extracts text, and upserts to Pinecone."""
    try:
        from .db import firebase_storage

        # Construct Firebase Storage path (last 6 characters of IDs)
        pdf_path = f"pdfs/{user_id[-6:]}/{pdf_id[-6:]}.pdf"
        blob = firebase_storage.blob(pdf_path)

        # Download PDF as bytes
        pdf_bytes = blob.download_as_bytes()
        if not pdf_bytes:
            logging.error(f"❌ Failed to fetch PDF {pdf_id} from Firebase Storage")
            return

        # Extract text using PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "\n".join([page.get_text("text") for page in doc])

        if not text.strip():
            logging.warning(f"⚠ No text found in PDF {pdf_id}")
            return

        # Determine chunk size dynamically
        text_length = len(text.split())
        chunk_size, chunk_overlap = get_chunk_params(text_length)
        text_splitter = TokenTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )

        text_chunks = text_splitter.split_text(text)
        logging.info(f"📄 PDF {pdf_id} split into {len(text_chunks)} chunks")

        avg_tokens_per_chunk = sum(len(chunk.split()) for chunk in text_chunks) / len(
            text_chunks
        )
        logging.info(f"📊 Average tokens per chunk: {avg_tokens_per_chunk}")

        documents = text_splitter.create_documents(
            [text], metadatas=[{"userId": user_id, "pdfId": pdf_id}] * len(text_chunks)
        )

        # Store in Pinecone
        PineconeVectorStore.from_documents(
            documents, embeddings, index_name="versa-ai-voyage"
        )

        logging.info(
            f"✅ PDF {pdf_id} processed and stored in Pinecone index: versa-ai-voyage"
        )

    except Exception as e:
        logging.error(f"❌ Error processing PDF {pdf_id}: {e}")
