from fastapi import APIRouter, Request, status, HTTPException, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import json
import asyncio
import logging
import time
from typing import Optional, List

# Your existing imports
from .pinecone_retriever_chain import create_chain
from firebase_admin import firestore
from .verify_access import get_current_user
from .basic_chain import generate_chat_title
from .query_refiner import refine_user_query
from slowapi import Limiter
from slowapi.util import get_remote_address

from langchain_core.messages import (
    BaseMessage,
    HumanMessage,
    AIMessage,
)


router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

message_queues = {}


class MessageRequest(BaseModel):
    message: str
    chat_session_id: str
    pdf_id: str
    userId: str
    isNewSession: Optional[bool] = False
    model: Optional[str] = None
    retrievalMethod: Optional[str] = "auto"


class PDFIngestRequest(BaseModel):
    pdfId: str
    userId: str


async def verify_user(user_id: str) -> bool:
    """Check if the user exists in Firestore."""
    try:
        user_ref = firestore.client().collection("users").document(user_id)
        user_doc = user_ref.get()
        return user_doc.exists
    except Exception as e:
        logging.error(f"❌ Error verifying user in Firestore: {e}")
        return False


@router.post("/upsert_pdf")
@limiter.limit("30/minute")
async def upsert_pdf(
    request: Request, body: PDFIngestRequest, user_id: str = Depends(get_current_user)
):
    task_data = json.dumps({"pdfId": body.pdfId, "userId": body.userId})

    logging.info(
        f"🚀 Queuing PDF ingestion task for user {body.userId} with PDF ID {body.pdfId}"
    )
    redis_instance = request.app.state.redis_instance
    await redis_instance.lpush("pdf_ingestion_queue", task_data)

    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "PDF ingestion task queued"}
    )


@router.post("/chat_send")
@limiter.limit("30/minute")
async def chat_send(
    request: Request,
    message_request: MessageRequest,
    user_id_from_token: str = Depends(get_current_user),
):
    """
    Handles sending a chat message, refining the query, processing with history,
    and initiating the streaming response via Redis Pub/Sub.
    """
    user_message = message_request.message
    pdf_id = message_request.pdf_id
    chat_session_id = message_request.chat_session_id
    user_id = message_request.userId  # User ID from the request body
    model = message_request.model
    isNewSession = message_request.isNewSession

    logging.info(
        f"🚀 Received message for chat session {chat_session_id} from user {user_id}. Is new session? {isNewSession}"
    )
    logging.info(f"🚀 Original user message: {user_message}")

    # --- User Verification ---
    user_exists = await verify_user(user_id)  # Assuming verify_user exists
    if not user_exists:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "User not found"},
        )

    # --- New Session Handling ---
    new_title = None
    session_manager = (
        request.app.state.session_manager_firebase
    )  # Assuming session_manager is available
    if isNewSession:
        # Generate title based on the original message
        new_title = await generate_chat_title(
            user_message
        )  # Assuming generate_chat_title exists
        await session_manager.create_session(
            chat_session_id, user_id, pdf_id, initial_title="New Chat"
        )
        asyncio.create_task(
            session_manager.update_session_title(chat_session_id, new_title)
        )

    try:
        # --- Redis Check ---
        redis_instance = (
            request.app.state.redis_instance
        )  # Assuming redis_instance is available
        if redis_instance is None:
            logging.error("❌ Redis instance is unavailable.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error: Could not connect to Redis",
            )

        # --- Fetch and Prepare History ---
        # Get history as list of dictionaries from session manager
        chat_history_dicts = await session_manager.get_history(chat_session_id)

        # Select recent history (e.g., last 10 messages or 1000 words)
        word_count = 0
        recent_history_dicts = []
        for entry in reversed(chat_history_dicts[-10:]):
            msg_content = entry.get("content", "")
            words_in_msg = len(msg_content.split())
            if word_count + words_in_msg > 1000 and len(recent_history_dicts) >= 4:
                break
            recent_history_dicts.append(entry)
            word_count += words_in_msg
        recent_history_dicts.reverse()

        # Convert dict history to LangChain BaseMessage objects for refinement
        langchain_history_for_refinement: List[BaseMessage] = []
        for entry in recent_history_dicts:
            role = entry.get("role")
            content = entry.get("content", "")
            if role == "human":
                langchain_history_for_refinement.append(HumanMessage(content=content))
            elif role == "ai":
                langchain_history_for_refinement.append(AIMessage(content=content))
        # Note: langchain_history_for_refinement does NOT include the current user_message yet

        # --- Query Refinement ---
        # Call the reusable refiner function
        refined_query = await refine_user_query(
            chat_history=langchain_history_for_refinement,  # History BEFORE current message
            query=user_message,
            logger=logging,  # Pass the FastAPI logger instance
            # Optionally add model_name or temperature arguments if needed
        )
        # --- End Refinement ---

        # --- Store Original User Message ---
        # Store the ORIGINAL user message in the session history
        await session_manager.add_message(
            chat_session_id, user_id, pdf_id, "human", str(user_message)
        )

        # --- Prepare History for Main Chain ---
        # Add the current user message to the history list that will be passed to the chain
        langchain_history_for_chain = langchain_history_for_refinement + [
            HumanMessage(content=user_message)
        ]

        # --- Create Main Retrieval Chain ---
        # Pass history *including* the latest user message
        # Ensure create_chain accepts List[BaseMessage] for chat_history
        retrieval_chain = create_chain(
            chat_history=langchain_history_for_chain,
            user_id=user_id,
            pdf_id=pdf_id,
        )

        # --- Process AI response via Background Task ---
        async def publish_response():
            """Handles streaming the response and storing the AI message."""
            BATCH_SIZE = 5
            MAX_DELAY = 0.1
            chunk_buffer = []
            all_chunks: List[str] = []
            last_send = time.time()
            ai_response_generated = False

            try:
                # Use the refined_query here when calling the chain
                async for chunk in retrieval_chain.astream(
                    refined_query
                ):  # Pass refined string directly
                    content_to_process = None
                    # Handle different possible chunk structures (adapt as needed)
                    if isinstance(chunk, dict):
                        if "answer" in chunk:
                            content_to_process = chunk["answer"]
                        elif "content" in chunk:
                            content_to_process = chunk["content"]
                        elif "text" in chunk:
                            content_to_process = chunk["text"]
                    elif hasattr(chunk, "content"):
                        content_to_process = chunk.content

                    if content_to_process is not None and isinstance(
                        content_to_process, str
                    ):
                        ai_response_generated = True  # Mark that we got some content
                        chunk_buffer.append(content_to_process)
                        all_chunks.append(content_to_process)

                        # Send buffer if full or delay exceeded
                        if (
                            len(chunk_buffer) >= BATCH_SIZE
                            or (time.time() - last_send) > MAX_DELAY
                        ):
                            await redis_instance.publish(
                                f"chat:{chat_session_id}",
                                json.dumps(
                                    {
                                        "type": "chunk",
                                        "content": chunk_buffer,
                                        "timestamp": time.time(),
                                    }
                                ),
                            )
                            chunk_buffer = []
                            last_send = time.time()

                # Send remaining chunks
                if chunk_buffer:
                    await redis_instance.publish(
                        f"chat:{chat_session_id}",
                        json.dumps(
                            {
                                "type": "chunk",
                                "content": chunk_buffer,
                                "timestamp": time.time(),
                            }
                        ),
                    )

                # Publish completion event
                await redis_instance.publish(
                    f"chat:{chat_session_id}",
                    json.dumps({"type": "complete", "timestamp": time.time()}),
                )

                # Store the full AI response in session history if content was generated
                if ai_response_generated:
                    full_response = "".join(all_chunks)
                    await session_manager.add_message(
                        chat_session_id, user_id, pdf_id, "ai", full_response
                    )
                    logging.info(
                        f"Full AI Response stored for session {chat_session_id}"
                    )
                else:
                    logging.warning(
                        f"No AI content generated for session {chat_session_id}, AI message not stored."
                    )

            except Exception as e:
                logging.exception(
                    f"❌ Error during AI response streaming/storage for session {chat_session_id}: {e}"
                )
                # Optionally publish an error event to Redis
                try:
                    await redis_instance.publish(
                        f"chat:{chat_session_id}",
                        json.dumps(
                            {
                                "type": "error",
                                "content": "Error processing response.",
                                "timestamp": time.time(),
                            }
                        ),
                    )
                except Exception as pub_e:
                    logging.error(
                        f"❌ Failed to publish error event to Redis for session {chat_session_id}: {pub_e}"
                    )

        # Start the background task
        asyncio.create_task(publish_response())

    except Exception as e:
        logging.exception(
            f"❌ Error processing message for session {chat_session_id}: {e}"
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Internal Server Error"},
        )

    # --- Send Initial Response ---
    response_content = {"status": "Message processing started"}
    if isNewSession and new_title:
        response_content["status"] = (
            "New chat session created, title generation started"
        )
        response_content["new_title"] = new_title

    return JSONResponse(status_code=status.HTTP_200_OK, content=response_content)


@router.get("/chat_stream/{chat_session_id}")
async def chat_stream(request: Request, chat_session_id: str):
    async def event_generator():
        redis = await request.app.state.redis_instance
        if not redis:
            yield "event: error\ndata: Redis unavailable\n\n"
            return

        pubsub = redis.pubsub()
        all_chunks: List[str] = []
        try:
            await pubsub.subscribe(f"chat:{chat_session_id}")
            last_activity = time.time()
            KEEP_ALIVE_INTERVAL = 15

            while True:
                try:
                    message = await pubsub.get_message(
                        ignore_subscribe_messages=True,
                        timeout=0.05,
                    )

                    if message:
                        last_activity = time.time()
                        data = json.loads(message["data"])

                        if data["type"] == "chunk":
                            # Send each chunk from the batch as a separate JSON message (FIXED)
                            for chunk_content in data["content"]:
                                all_chunks.append(chunk_content)  # Append every chunk
                                # Create the JSON payload expected by the frontend
                                sse_payload = {
                                    "type": "chunk",
                                    "content": chunk_content,  # Send one piece of content at a time
                                }
                                # Yield the JSON string as the SSE data field
                                # Use json.dumps to convert the dict to a JSON string
                                yield f"data: {json.dumps(sse_payload)}\n\n"
                        elif data["type"] == "complete":
                            print(
                                f"Full AI Response (chat_stream - complete signal): {''.join(all_chunks)}"
                            )  # Print the full response on complete
                            yield "event: end\ndata: \n\n"
                            break

                    # Send keep-alive only if inactive (MODIFIED)
                    if (time.time() - last_activity) > KEEP_ALIVE_INTERVAL:
                        yield ":keep-alive\n\n"
                        last_activity = time.time()

                except asyncio.TimeoutError:
                    continue
                except Exception as e:
                    logging.error(f"Stream error: {e}")
                    break

        except asyncio.CancelledError:
            logging.info(f"Client disconnected from {chat_session_id}")
        finally:
            try:
                await pubsub.unsubscribe(f"chat:{chat_session_id}")
                await pubsub.close()
            except Exception as e:
                logging.error(f"Cleanup error: {e}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Added to prevent proxy buffering
        },
    )


@router.head("/health")
async def health_check():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"status": "ok"})
