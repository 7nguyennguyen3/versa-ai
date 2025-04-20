import json
import fitz  # PyMuPDF
import logging
from dotenv import load_dotenv
from langchain.text_splitter import TokenTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_voyageai import VoyageAIEmbeddings
from langchain.schema import Document  # Import Document
import os  # Import os for environment variable check

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

load_dotenv()

# Check if Voyage AI API key is set
if not os.getenv("VOYAGE_API_KEY"):
    logging.error("VOYAGE_API_KEY environment variable not set.")
    # Depending on your application, you might want to exit or raise an error here.
    # For this example, we'll assume it's set for the embeddings to work.

embeddings = VoyageAIEmbeddings(model="voyage-3")


# Keep this function - defines chunk_size and overlap.
def get_chunk_params(text_length_estimate=0):
    """Defines chunk size and overlap."""
    # These values are based on experimentation and token limits of the embedding model.
    # Adjust based on your specific PDF content and desired chunk characteristics.
    chunk_size = 768
    chunk_overlap = 150

    logging.info(
        f"📏 Using chunk_size={chunk_size}, chunk_overlap={chunk_overlap} for page processing"
    )
    return chunk_size, chunk_overlap


# Keep the worker function as is
async def process_pdf_worker(redis_instance):
    """Continuously listens for PDF ingestion tasks in Redis."""
    logging.info("🚀 PDF ingestion worker started... Listening for tasks.")

    while True:
        try:
            # Use a timeout (e.g., 60 seconds) so brpop doesn't block indefinitely if shutting down
            result = await redis_instance.brpop("pdf_ingestion_queue", timeout=60)
            if result is None:
                # Timeout occurred, check for shutdown signal or continue loop
                continue  # Or add shutdown logic here

            _, task_data = result  # Unpack the result
            task = json.loads(task_data)
            logging.info(
                f"📦 Received task for PDF ID: {task['pdfId']}, User ID: {task['userId']}"
            )
            await process_pdf_ingestion(task["pdfId"], task["userId"])
            logging.info(
                f"✅ PDF ingestion task completed for PDF ID: {task['pdfId']} and User ID: {task['userId']}"
            )

        except Exception as e:
            logging.error(f"❌ Error in PDF ingestion worker: {e}", exc_info=True)


# Modified process_pdf_ingestion function with post-splitting merging
async def process_pdf_ingestion(pdf_id: str, user_id: str):
    """Processes a single PDF ingestion task: downloads, extracts text page-by-page,
    chunks with page and segment metadata, applies merging logic, and upserts to Pinecone.
    """
    try:
        # Assuming .db import works correctly in your environment
        # If db is in the same directory, you might just need 'import db'
        from .db import (
            firebase_storage,
        )  # Adjust import based on your project structure

        # Construct Firebase Storage path (using full IDs or last 6 chars based on your setup)
        user_folder = user_id[-6:]  # Use last 6 chars for path
        pdf_file_name = pdf_id[-6:] + ".pdf"  # Use last 6 chars for file name

        pdf_path = f"pdfs/{user_folder}/{pdf_file_name}"
        logging.info(f"Attempting to download PDF from path: {pdf_path}")

        blob = firebase_storage.blob(pdf_path)

        # Download PDF as bytes
        try:
            pdf_bytes = blob.download_as_bytes()
        except Exception as download_e:
            logging.error(
                f"❌ Failed to download PDF {pdf_id} from Firebase Storage path {pdf_path}: {download_e}"
            )
            return  # Exit the function if download fails

        if not pdf_bytes:
            logging.error(f"❌ Downloaded PDF {pdf_id} from {pdf_path} was empty.")
            return

        # Open PDF using PyMuPDF
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as fitz_e:
            logging.error(f"❌ Failed to open PDF {pdf_id} with PyMuPDF: {fitz_e}")
            return  # Exit the function if opening fails

        # Determine chunk size and overlap
        chunk_size, chunk_overlap = get_chunk_params()

        # Initialize the text splitter
        text_splitter = TokenTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )

        all_documents = []  # List to hold documents from all pages

        # Define the threshold for a 'small' chunk (in characters)
        # This is a heuristic; adjust based on testing with your documents
        SMALL_CHUNK_THRESHOLD = 300
        logging.info(f"Using small chunk threshold (chars): {SMALL_CHUNK_THRESHOLD}")

        # Process each page
        logging.info(f"Processing {doc.page_count} pages for PDF {pdf_id}...")
        for page_index in range(doc.page_count):
            page = doc.load_page(page_index)
            page_text = page.get_text("text")
            page_num = page_index + 1  # Page numbers are 1-based for users

            if not page_text.strip():
                logging.warning(
                    f"⚠ Page {page_num} in PDF {pdf_id} is empty or whitespace only, skipping."
                )
                continue  # Skip to the next page

            # Split the text of the current page
            page_chunks = text_splitter.split_text(page_text)

            # --- Apply Post-Splitting Merging Logic ---
            # Check if there's more than one chunk and the last one is small
            if len(page_chunks) > 1 and len(page_chunks[-1]) < SMALL_CHUNK_THRESHOLD:
                logging.info(
                    f"Merging last small chunk ({len(page_chunks[-1])} chars) on Page {page_num}."
                )
                # Merge the last chunk with the second-to-last chunk
                # Use a newline separator between the merged parts
                merged_content = page_chunks[-2] + "\n\n" + page_chunks[-1]
                # Replace the last two chunks with the single merged chunk
                page_chunks = page_chunks[:-2] + [merged_content]
                logging.info(
                    f"Page {page_num} now has {len(page_chunks)} chunks after merging."
                )
            # --- End of Merging Logic ---

            num_segments = len(
                page_chunks
            )  # Total segments for this page *after* potential merging

            if num_segments == 0:
                logging.warning(
                    f"⚠ Page {page_num} in PDF {pdf_id} resulted in 0 chunks after splitting/merging, skipping."
                )
                continue

            # Create Document objects for each chunk from this page
            # Assign page number and the segment label (e.g., '1/3', '2/3') based on *final* num_segments
            page_documents = []
            for i, chunk in enumerate(page_chunks):
                segment_label = f"{i+1}/{num_segments}"  # X/Y format

                doc_metadata = {
                    "userId": user_id,
                    "pdfId": pdf_id,
                    "page": page_num,
                    "segment": segment_label,
                    # Optional: store total segments for this page as well
                    # "total_page_segments": num_segments
                }

                page_documents.append(
                    Document(
                        page_content=chunk,
                        metadata=doc_metadata,
                    )
                )

            all_documents.extend(
                page_documents
            )  # Add documents from this page to the main list

            logging.info(
                f"📄 Page {page_num} processed into {num_segments} final chunks (segments {1}/{num_segments} to {num_segments}/{num_segments})"
            )

        # End of page processing loop

        if not all_documents:
            logging.warning(f"⚠ No valid text chunks found in the entire PDF {pdf_id}")
            return  # Exit if no documents were created

        logging.info(
            f"📄 Total PDF {pdf_id} processed into {len(all_documents)} chunks across {doc.page_count} pages."
        )

        # Calculate average tokens per chunk across all documents
        avg_tokens_per_chunk = (
            sum(len(doc.page_content.split()) for doc in all_documents)
            / len(all_documents)
            if all_documents
            else 0
        )
        logging.info(f"📊 Average tokens per chunk: {avg_tokens_per_chunk:.2f}")

        # Store all collected documents in Pinecone
        logging.info(
            f"Storing {len(all_documents)} documents for PDF {pdf_id} in Pinecone index: versa-ai-voyage"
        )
        # PineconeVectorStore.from_documents handles batching internally.
        try:
            PineconeVectorStore.from_documents(
                all_documents, embeddings, index_name="versa-ai-voyage"
            )
            logging.info(f"✅ PDF {pdf_id} successfully stored in Pinecone.")
        except Exception as pinecone_e:
            logging.error(
                f"❌ Failed to upsert documents for PDF {pdf_id} to Pinecone: {pinecone_e}",
                exc_info=True,
            )
            # Depending on your error handling, you might want to retry or alert here.

    except Exception as e:
        # Catch any other unexpected errors during the process
        logging.error(
            f"❌ An unexpected error occurred while processing PDF {pdf_id}: {e}",
            exc_info=True,
        )
