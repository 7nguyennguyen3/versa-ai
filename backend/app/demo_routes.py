# demo_routes.py

from fastapi import APIRouter, Request, status, HTTPException, Depends, FastAPI
from fastapi.responses import JSONResponse, StreamingResponse
import asyncio
import logging
import os
import time
from collections import defaultdict
from typing import Dict, List, Any

# Assume your local imports work
from .pinecone_retriever_chain import create_chain
from .query_refiner import refine_user_query

from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel

from langchain_core.messages import (
    HumanMessage,
    AIMessage,
    BaseMessage,
)

# --- Globals for Demo ---
# Restore the message queue
message_queues: Dict[str, asyncio.Queue] = defaultdict(asyncio.Queue)
# History and activity tracking remain
demo_chat_histories: Dict[str, List[BaseMessage]] = defaultdict(list)
demo_session_last_activity: Dict[str, float] = {}
memory_lock = asyncio.Lock()  # Lock for shared memory access

# --- Constants ---
DEMO_SESSION_TIMEOUT_SECONDS = 5 * 60  # 5 minutes (adjust as needed)
CLEANUP_INTERVAL_SECONDS = 60  # Check every minute

# --- Router Definition ---
demo_router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class DemoMessageRequest(BaseModel):
    message: str
    chat_session_id: str
    pdf_id: str
    demo_secret: str


# --- Background Cleanup Task ---
async def cleanup_inactive_demo_sessions():
    """Periodically removes demo sessions inactive for too long."""
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)
        now = time.time()
        inactive_sessions = []
        # Make a copy of keys to avoid runtime error during iteration
        session_ids = list(demo_session_last_activity.keys())

        async with memory_lock:  # Protect access to shared dictionaries
            for session_id in session_ids:
                last_activity = demo_session_last_activity.get(session_id)
                if last_activity and (
                    now - last_activity > DEMO_SESSION_TIMEOUT_SECONDS
                ):
                    inactive_sessions.append(session_id)

            if inactive_sessions:
                logging.info(
                    f"🧹 Cleaning up inactive demo sessions: {inactive_sessions}"
                )
                for session_id in inactive_sessions:
                    # Use pop with default to avoid KeyErrors
                    demo_chat_histories.pop(session_id, None)
                    demo_session_last_activity.pop(session_id, None)
                    # Also remove the message queue for the inactive session
                    message_queues.pop(session_id, None)


# --- Function to run cleanup task (call this from startup) ---
def start_cleanup_task():
    logging.info(
        "🚀 Starting background task for cleaning up inactive demo sessions..."
    )
    asyncio.create_task(cleanup_inactive_demo_sessions())


# --- Demo Routes ---


@demo_router.post("/demo_chat_send")
@limiter.limit("10/minute")
async def demo_chat_send(request: Request, messageRequest: DemoMessageRequest):
    """
    Endpoint to receive a message, validate, and queue it for the demo stream.
    Also updates activity time.
    """
    # --- Validation ---
    if messageRequest.demo_secret != os.getenv("DEMO_SECRET"):
        logging.error(
            f"Unauthorized demo access attempt for session {messageRequest.chat_session_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized: Invalid secret"
        )

    chat_session_id = messageRequest.chat_session_id
    user_message = messageRequest.message
    pdf_id = messageRequest.pdf_id

    logging.info(
        f"🚀 Received message for demo session {chat_session_id}: '{user_message}'"
    )

    # --- Queue the message ---
    # No lock needed for defaultdict with Queue creation itself
    # Put the message data into the specific queue for this session
    # The stream endpoint will await message_queues[chat_session_id].get()
    await message_queues[chat_session_id].put(
        {"message": user_message, "pdf_id": pdf_id}
    )
    logging.info(f"Message queued for session {chat_session_id}")

    # --- Update Activity Time ---
    async with memory_lock:
        demo_session_last_activity[chat_session_id] = time.time()

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "Message received and queued for streaming.",
            "chat_session_id": chat_session_id,
        },
    )


@demo_router.get("/demo_chat_stream/{chat_session_id}")
@limiter.limit("30/minute")  # Allow more frequent streaming calls maybe
async def demo_chat_stream(request: Request, chat_session_id: str):
    """
    Endpoint to wait for a queued message, process it with history and refinement,
    and stream the response. Signature reverted to original.
    """
    try:
        logging.info(
            f"👂 Streaming endpoint waiting for message for session {chat_session_id}"
        )

        # --- Dequeue Message ---
        # Check if queue exists (it should if send was called)
        if chat_session_id not in message_queues:
            # This might happen if stream is called before send, or after cleanup
            logging.warning(
                f"No active message queue found for session {chat_session_id}. Did send run?"
            )
            # Decide how to handle: wait, error, or empty stream? Let's wait briefly.
            # A better approach might involve signalling from the send endpoint.
            # For now, just try getting, it will block or raise if queue removed.
            # Consider adding a timeout to the get() call:
            try:
                message_data = await asyncio.wait_for(
                    message_queues[chat_session_id].get(), timeout=10.0
                )
            except asyncio.TimeoutError:
                logging.error(
                    f"Timeout waiting for message for session {chat_session_id}"
                )

                # Return an empty stream or an error event
                async def empty_stream():
                    yield "event: error\ndata: Timeout waiting for message\n\n"

                return StreamingResponse(empty_stream(), media_type="text/event-stream")
            except KeyError:
                logging.error(
                    f"Message queue key error for session {chat_session_id} (likely cleaned up)."
                )

                async def error_stream():
                    yield "event: error\ndata: Session expired or not found\n\n"

                return StreamingResponse(error_stream(), media_type="text/event-stream")

        else:
            # Get the message data from the queue for this session (blocks if empty)
            message_data = await message_queues[chat_session_id].get()

        user_message = message_data["message"]
        pdf_id = message_data["pdf_id"]
        logging.info(
            f"📬 Dequeued message for session {chat_session_id}: '{user_message}'"
        )

        # Mark the message as processed by the queue
        message_queues[
            chat_session_id
        ].task_done()  # Important for queue management if needed later

        # --- Fetch History ---
        async with memory_lock:
            # Fetch history *before* adding current message
            history_before_current = demo_chat_histories[chat_session_id].copy()
            # Update activity time now that we are processing
            demo_session_last_activity[chat_session_id] = time.time()
            # Lock released after this block

        # --- Prepare Message Object ---
        # Create the object for the current message *now* after getting it from queue
        human_msg_object = HumanMessage(content=user_message)

        # --- Query Refinement ---
        # Call the reusable refiner function
        refined_query = await refine_user_query(
            chat_history=history_before_current,  # History BEFORE current message
            query=user_message,
            logger=logging,  # Pass the logger instance
        )
        # --- End Refinement ---

        # --- Prepare History for Main Chain ---
        # History list *including* the current message for the main chain's context
        current_history_for_chain = history_before_current + [human_msg_object]

        # --- Create Main Retrieval Chain ---
        retrieval_chain = create_chain(
            chat_history=current_history_for_chain,
            user_id="demo-user",
            pdf_id=pdf_id,  # Use pdf_id obtained from queue
            demo=True,
        )

        # --- Generate Streaming Response ---
        async def generate():
            """Generator function to stream AI responses and update history."""
            ai_response_chunks = []
            ai_response_generated = False
            try:
                # Stream the response using the REFINED query
                async for chunk in retrieval_chain.astream(refined_query):
                    content_to_process = None
                    # (Chunk handling logic as before)
                    if isinstance(chunk, dict):
                        if "answer" in chunk:
                            content_to_process = chunk["answer"]
                        elif "content" in chunk:
                            content_to_process = chunk["content"]
                    elif hasattr(chunk, "content"):
                        content_to_process = chunk.content

                    if content_to_process is not None and isinstance(
                        content_to_process, str
                    ):
                        ai_response_generated = True
                        ai_response_chunks.append(content_to_process)
                        yield f"data: {content_to_process}\n\n"

                # Send end event
                yield "event: end\ndata: finished\n\n"

                # --- History Update ---
                full_ai_response = "".join(ai_response_chunks)
                async with memory_lock:
                    # Add the processed human message and AI response to shared history
                    demo_chat_histories[chat_session_id].append(human_msg_object)
                    if ai_response_generated:
                        ai_msg = AIMessage(content=full_ai_response)
                        demo_chat_histories[chat_session_id].append(ai_msg)
                        log_msg = f"Stored Human+AI messages for {chat_session_id}."
                    else:
                        log_msg = f"Stored Human message for {chat_session_id} (No AI response)."
                        logging.warning(
                            f"No AI response generated for {chat_session_id}"
                        )

                    logging.info(
                        f"{log_msg} History length: {len(demo_chat_histories[chat_session_id])}"
                    )
                    # Update activity time *after* successful processing
                    demo_session_last_activity[chat_session_id] = time.time()

            except Exception as e:
                logging.exception(
                    f"❌ Error generating stream for session {chat_session_id}: {e}"
                )
                error_message = f"Error processing message: {str(e)}".replace("\n", " ")
                yield f"event: error\ndata: {error_message}\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        # Catch errors happening *before* streaming starts (e.g., queue errors)
        logging.exception(
            f"❌ Error processing stream request for session {chat_session_id}: {e}"
        )
        # Cannot return StreamingResponse if headers not sent, raise HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal processing error before streaming",
        )
