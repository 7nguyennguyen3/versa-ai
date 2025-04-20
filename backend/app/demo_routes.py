# demo_routes.py

from fastapi import APIRouter, Request, status, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import asyncio
import logging
import json
import os
import time
from collections import defaultdict
from typing import Dict, List

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
        if chat_session_id not in message_queues:
            logging.warning(
                f"No active message queue found for session {chat_session_id}. Did send run?"
            )
            try:
                # Add timeout to prevent infinite waiting if send fails
                message_data = await asyncio.wait_for(
                    message_queues[chat_session_id].get(), timeout=10.0
                )
            except asyncio.TimeoutError:
                logging.error(
                    f"Timeout waiting for message for session {chat_session_id}"
                )

                async def empty_stream():
                    # Using the same error format as generation errors
                    yield "event: error\ndata: Timeout waiting for message\n\n"

                return StreamingResponse(empty_stream(), media_type="text/event-stream")
            except KeyError:
                logging.error(
                    f"Message queue key error for session {chat_session_id} (likely cleaned up)."
                )

                async def error_stream():
                    # Using the same error format as generation errors
                    yield "event: error\ndata: Session expired or not found\n\n"

                return StreamingResponse(error_stream(), media_type="text/event-stream")
        else:
            # Get the message data from the queue for this session (blocks if empty)
            message_data = await message_queues[chat_session_id].get()

        user_message = message_data["message"]
        pdf_id = message_data["pdf_id"]
        model = message_data.get(
            "model", "gemini-2.0"
        )  # Get model, default if not present
        retrieval_method = message_data.get(
            "retrieval_method", "auto"
        )  # Get retrieval_method, default if not present

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
            # Optionally add model_name or temperature arguments if needed
        )
        # --- End Refinement ---

        # --- Prepare History for Main Chain ---
        # History list *including* the current message for the main chain's context
        current_history_for_chain = history_before_current + [human_msg_object]

        # --- Create Main Retrieval Chain ---
        retrieval_chain = create_chain(
            chat_history=current_history_for_chain,
            user_id="demo-user",  # Hardcoded user_id for demo
            pdf_id=pdf_id,
            demo=True,  # Flag for demo mode (e.g., different vector store)
            preferred_model=model,  # Pass model from request
            mode=retrieval_method,  # Pass retrieval_method from request
        )

        # --- Generate Streaming Response ---
        async def generate():
            """Generator function to stream AI responses and update history."""
            ai_response_chunks = []
            ai_response_generated = False
            # State to track if the last character processed was a newline
            # Used to determine if leading whitespace should be stripped from the next chunk
            last_char_was_newline = (
                True  # State: Assume the response starts after a conceptual newline
            )

            try:
                # Stream the response using the REFINED query
                async for chunk in retrieval_chain.astream(refined_query):
                    content_to_process = None
                    # Handle different possible chunk structures (adapt as needed)
                    if isinstance(chunk, dict):
                        if "answer" in chunk:
                            content_to_process = chunk["answer"]
                        elif "content" in chunk:
                            content_to_process = chunk["content"]
                        elif (
                            "text" in chunk
                        ):  # Added 'text' based on previous observation
                            content_to_process = chunk["text"]
                    elif hasattr(chunk, "content"):
                        content_to_process = chunk.content
                    # Add a fallback for raw string chunks if they occur unexpectedly
                    elif isinstance(chunk, str):
                        content_to_process = chunk

                    if content_to_process is not None and isinstance(
                        content_to_process, str
                    ):
                        ai_response_generated = True

                        processed_chunk_for_stream = content_to_process

                        # --- Streaming Post-processing: Remove leading whitespace from lines ---
                        # Only strip leading whitespace if the previous character was a newline.
                        # This targets unintended indentation at the start of lines (like for paragraphs or lists).
                        # This WILL remove indentation from 'indented code blocks' (4+ spaces) if they start a chunk after a newline.
                        # It should generally preserve indentation *within* fenced code blocks (```).
                        if (
                            last_char_was_newline
                            and processed_chunk_for_stream.lstrip()
                            != processed_chunk_for_stream
                        ):
                            # If the last char was a newline AND the chunk starts with whitespace, strip it.
                            processed_chunk_for_stream = (
                                processed_chunk_for_stream.lstrip()
                            )
                        # --- End Streaming Post-processing ---

                        # Append the original chunk to the list for accumulating the full response (for history)
                        ai_response_chunks.append(content_to_process)

                        # Create the SSE payload with the potentially processed chunk
                        sse_payload = {
                            "type": "chunk",
                            "content": processed_chunk_for_stream,
                        }
                        # Ensure the payload is a valid JSON string
                        try:
                            yield f"data: {json.dumps(sse_payload)}\n\n"
                        except Exception as json_e:
                            logging.error(
                                f"Failed to JSON encode payload: {sse_payload}. Error: {json_e}"
                            )
                            # Optionally yield an error event here if JSON encoding fails
                            yield f"event: error\ndata: Failed to encode response chunk.\n\n"
                            # Decide if you want to stop the stream here or try to continue

                        # Update the state for the next chunk based on the *original* chunk
                        if content_to_process:  # Only update if the chunk had content
                            if content_to_process.endswith("\n"):
                                last_char_was_newline = True
                            else:
                                # If the chunk contains newlines within it, check the very last character
                                last_char_was_newline = content_to_process.endswith(
                                    "\n"
                                )
                        # If content_to_process was None or empty string, the state doesn't change

                # If content_to_process was None or not a string, the loop continues,
                # but we should ensure last_char_was_newline is handled.
                # If a chunk is not text (e.g., tool calls), we might need to handle state update based on its effect,
                # but assuming the chain only yields text chunks for the final answer stream.

                # Send end event
                yield "event: end\ndata: \n\n"  # Empty data field for end event

                # --- History Update ---
                # Note: The full_ai_response accumulated here uses the *original* chunks.
                # If you want the history to store the *processed* version, you would need
                # to accumulate `processed_chunk_for_stream` instead, but this might lose
                # intentional indentation inside code blocks in the history.
                # Let's keep accumulating original for history for now, assuming history stores raw AI output.
                full_ai_response = "".join(ai_response_chunks)
                async with memory_lock:
                    # Add the processed human message and AI response to shared history
                    demo_chat_histories[chat_session_id].append(human_msg_object)
                    if ai_response_generated:
                        # If you want history to store processed, process full_ai_response here
                        # processed_full_response = process_full_text_markdown_indentation(full_ai_response) # Requires a new function
                        ai_msg = AIMessage(
                            content=full_ai_response
                        )  # Storing original AI output
                        demo_chat_histories[chat_session_id].append(ai_msg)
                        log_msg = f"Stored Human+AI messages for {chat_session_id}."
                    else:
                        log_msg = f"Stored Human message for {chat_session_id} (No AI response)."
                        logging.warning(
                            f"No AI response generated for session {chat_session_id}"
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
                # Error format already matches
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
