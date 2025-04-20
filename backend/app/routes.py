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
from .stream_with_indentation_fix import stream_with_indentation_fix
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
    user_id_from_token: str = Depends(get_current_user),  # Authenticated user ID
):
    """
    Handles sending a chat message, refining the query, processing with history,
    and initiating the streaming response via Redis Pub/Sub.
    """
    # Unpack request
    user_message = message_request.message
    pdf_id = message_request.pdf_id
    chat_session_id = message_request.chat_session_id
    user_id = message_request.userId
    model = message_request.model
    retrieval_method = message_request.retrievalMethod
    isNewSession = message_request.isNewSession

    logging.info(
        f"🚀 Received message for chat session {chat_session_id} "
        f"from user {user_id}. Is new session? {isNewSession}"
    )
    logging.info(f"🚀 Original user message: {user_message!r}")

    # --- Auth check ---
    if user_id != user_id_from_token:
        logging.error(
            f"Unauthorized: Token user {user_id_from_token}, " f"Request user {user_id}"
        )
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "Unauthorized user or user ID mismatch"},
        )

    # --- New Session Handling ---
    session_manager = request.app.state.session_manager_firebase
    new_title = None
    if isNewSession:
        new_title = await generate_chat_title(user_message)
        await session_manager.create_session(
            chat_session_id, user_id, pdf_id, initial_title="New Chat"
        )
        # Update title in the background
        asyncio.create_task(
            session_manager.update_session_title(chat_session_id, new_title)
        )

    # --- Redis Connection ---
    redis_instance = request.app.state.redis_instance
    if redis_instance is None:
        logging.error("❌ Redis instance is unavailable.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error: Could not connect to Redis",
        )

    # --- Fetch & Prepare History ---
    chat_history_dicts = await session_manager.get_history(chat_session_id)
    word_count = 0
    recent_history = []
    for entry in reversed(chat_history_dicts):
        if len(recent_history) >= 10 and word_count >= 1000:
            break
        content = entry.get("content", "")
        wc = len(content.split())
        if word_count + wc > 1000 and len(recent_history) >= 4:
            break
        recent_history.append(entry)
        word_count += wc
    recent_history.reverse()

    from langchain.schema import HumanMessage, AIMessage

    langchain_history = []
    for entry in recent_history:
        role = entry.get("role")
        content = entry.get("content", "")
        if role == "human":
            langchain_history.append(HumanMessage(content=content))
        elif role == "ai":
            langchain_history.append(AIMessage(content=content))

    # --- Query Refinement ---
    refined_query = await refine_user_query(
        chat_history=langchain_history,
        query=user_message,
        logger=logging,
    )

    # --- Store Original User Message ---
    await session_manager.add_message(
        chat_session_id, user_id, pdf_id, "human", user_message
    )

    # --- Prepare History for Chain ---
    langchain_history_for_chain = langchain_history + [
        HumanMessage(content=user_message)
    ]

    # --- Create Main Retrieval Chain ---
    retrieval_chain = create_chain(
        chat_history=langchain_history_for_chain,
        user_id=user_id,
        pdf_id=pdf_id,
        preferred_model=model,
        mode=retrieval_method,
        isNewSession=isNewSession,
    )

    # --- Background Task: Stream & Store AI Response ---
    async def publish_response():
        BATCH_SIZE = 5
        MAX_DELAY = 0.1
        chunk_buffer = []
        all_processed = []
        original_chunks = []
        last_send = time.time()
        generated = False

        try:
            async for orig_chunk, proc_item in stream_with_indentation_fix(
                retrieval_chain.astream(refined_query)
            ):
                # Extract original text
                if isinstance(orig_chunk, dict):
                    text = (
                        orig_chunk.get("answer")
                        or orig_chunk.get("content")
                        or orig_chunk.get("text")
                    )
                elif hasattr(orig_chunk, "content"):
                    text = orig_chunk.content
                else:
                    text = orig_chunk if isinstance(orig_chunk, str) else None

                if text:
                    original_chunks.append(text)

                if isinstance(proc_item, str):
                    generated = True
                    chunk_buffer.append(proc_item)
                    all_processed.append(proc_item)

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
                # ignore non-str items for now

        except Exception as stream_err:
            logging.exception(
                f"❌ Error streaming response for session {chat_session_id}: {stream_err}"
            )
            # Notify frontend of error
            try:
                await redis_instance.publish(
                    f"chat:{chat_session_id}",
                    json.dumps(
                        {
                            "type": "error",
                            "content": f"Error processing response: {stream_err}",
                            "timestamp": time.time(),
                        }
                    ),
                )
            except Exception as pub_err:
                logging.error(f"❌ Failed publishing error event: {pub_err}")
            return  # abort further processing

        # Flush remaining chunks
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

        # Signal completion
        await redis_instance.publish(
            f"chat:{chat_session_id}",
            json.dumps({"type": "complete", "timestamp": time.time()}),
        )

        # Store full AI response
        if generated:
            full = "".join(original_chunks)
            await session_manager.add_message(
                chat_session_id, user_id, pdf_id, "ai", full
            )
            logging.info(f"Full AI response stored for session {chat_session_id}")
        else:
            logging.warning(f"No AI content generated for session {chat_session_id}")

    # Kick off streaming in background
    asyncio.create_task(publish_response())

    # --- Initial HTTP Response ---
    response_payload = {"status": "Message processing started"}
    if isNewSession and new_title:
        response_payload.update(
            {
                "status": "New chat session created, title generation started",
                "new_title": new_title,
            }
        )
    return JSONResponse(status_code=status.HTTP_200_OK, content=response_payload)


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
