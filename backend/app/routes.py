from fastapi import APIRouter, Request, status, HTTPException, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import json
import asyncio
import logging
import os
from .pinecone_retriever_chain import create_chain
from firebase_admin import firestore  
from .verify_access import get_current_user
from .basic_chain import generate_chat_title
from slowapi import Limiter
from slowapi.util import get_remote_address
from typing import Optional

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

message_queues = {}

class MessageRequest(BaseModel):
    message: str
    chat_session_id: str
    pdf_id: str
    userId: str
    isNewSession: Optional[bool] = False

class PDFIngestRequest(BaseModel):
    pdfId: str
    userId: str

class DemoMessageRequest(BaseModel):
    message: str
    chat_session_id: str
    pdf_id: str
    demo_secret: str

async def verify_user(user_id: str) -> bool:
    """Check if the user exists in Firestore."""
    try:
        user_ref = firestore.client().collection("users").document(user_id)
        user_doc = user_ref.get()
        return user_doc.exists
    except Exception as e:
        logging.error(f"❌ Error verifying user in Firestore: {e}")
        return False  # Assume the user does not exist in case of failure

@router.post("/upsert_pdf")
@limiter.limit("10/minute")
async def upsert_pdf(request: Request, body: PDFIngestRequest, user_id: str = Depends(get_current_user)):
    task_data = json.dumps({
        "pdfId": body.pdfId,
        "userId": body.userId
    })

    logging.info(f"🚀 Queuing PDF ingestion task for user {body.userId} with PDF ID {body.pdfId}")
    redis_instance = request.app.state.redis_instance
    await redis_instance.lpush("pdf_ingestion_queue", task_data)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "PDF ingestion task queued"}
    )

@router.post("/chat_send")
@limiter.limit("10/minute")
async def chat_send(request: Request, message_request: MessageRequest, user_id: str = Depends(get_current_user)):
    user_message = message_request.message
    pdf_id = message_request.pdf_id
    chat_session_id = message_request.chat_session_id
    user_id = message_request.userId
    isNewSession = message_request.isNewSession

    logging.info(f"🚀 Received message for chat session {chat_session_id} from user {user_id}. Is new session? {isNewSession}")

    user_exists = await verify_user(user_id)
    if not user_exists:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "User not found"}
        )
    
    if isNewSession:
        new_title = await generate_chat_title(user_message)
        session_manager = request.app.state.session_manager_firebase
        await session_manager.create_session(chat_session_id, user_id, pdf_id, initial_title="New Chat")
        asyncio.create_task(
            session_manager.update_session_title(
                chat_session_id, new_title
            )
        )

    try:
        redis_instance = await request.app.state.redis_instance
        if redis_instance is None:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"error": "Redis is unavailable"}
            )

        # Get chat history and process message
        session_manager = request.app.state.session_manager_firebase
        chat_history = await session_manager.get_history(chat_session_id)

        # History processing logic (same as before)
        word_count = 0
        recent_history = []
        for entry in reversed(chat_history[-6:]):
            msg_content = entry.get("content", "")
            words_in_msg = len(msg_content.split())

            if word_count + words_in_msg > 1000 and len(recent_history) >= 4:
                break

            recent_history.append(entry)
            word_count += words_in_msg

        recent_history.reverse()

        # Create processing chain
        retrieval_chain = create_chain(recent_history, user_id, pdf_id)

        # Store user message first
        await session_manager.add_message(chat_session_id, user_id, pdf_id, "human", str(user_message))

        # Process AI response and stream via Redis Pub/Sub
        async def publish_response():
            ai_response_chunks = []
            async for chunk in retrieval_chain.astream(user_message):
                if hasattr(chunk, "content"):
                    content = chunk.content.replace("\n", "<br>")
                    ai_response_chunks.append(content)
                    # Publish each chunk to Redis
                    await redis_instance.publish(
                        f"chat:{chat_session_id}",
                        json.dumps({"type": "chunk", "content": content})
                    )
            
            # Publish completion and store final message
            ai_response = "".join(ai_response_chunks)
            await redis_instance.publish(
                f"chat:{chat_session_id}",
                json.dumps({"type": "complete"})
            )
            await session_manager.add_message(chat_session_id, user_id, pdf_id, "ai", ai_response)

        # Start processing in background
        asyncio.create_task(publish_response())

    except Exception as e:
        logging.error(f"❌ Error processing message: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Internal Server Error"}
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "Message processing started"}
    )

@router.get("/chat_stream/{chat_session_id}")
async def chat_stream(request: Request, chat_session_id: str):
    async def event_generator():
        redis = await request.app.state.redis_instance
        if not redis:
            yield "event: error\ndata: Redis unavailable\n\n"
            return

        pubsub = redis.pubsub()
        try:
            await pubsub.subscribe(f"chat:{chat_session_id}")
            
            while True:
                try:
                    message = await pubsub.get_message(
                        ignore_subscribe_messages=True,
                        timeout=1.0
                    )
                    
                    if message:
                        data = json.loads(message["data"])
                        
                        if data["type"] == "chunk":
                            yield f"data: {data['content']}\n\n"
                        elif data["type"] == "complete":
                            yield "event: end\ndata: \n\n"
                            break
                            
                    # Yield keep-alive comment
                    yield ":keep-alive\n\n"
                    
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
            "Connection": "keep-alive"
        }
    )

@router.head("/health")
async def health_check():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"status": "ok"})

@router.post("/demo_chat_send")
async def demo_chat_send(request: Request, messageRequest: DemoMessageRequest):
    """Endpoint to send a message for a demo chat session."""

    if messageRequest.demo_secret != os.getenv("DEMO_SECRET"):
        logging.error("Unauthorized: Invalid secret")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Invalid secret"
        )

    user_message = messageRequest.message
    chat_session_id = messageRequest.chat_session_id
    pdf_id = messageRequest.pdf_id

    logging.info(f"🚀 Received message for chat session {chat_session_id}")

    # Ensure the queue exists for this session
    if chat_session_id not in message_queues:
        message_queues[chat_session_id] = asyncio.Queue()

    # Put message into queue
    await message_queues[chat_session_id].put({
        "message": user_message,
        "pdf_id": pdf_id
    })

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "Message received and queued"}
    )

@router.get("/demo_chat_stream/{chat_session_id}")
@limiter.limit("10/minute")
async def demo_chat_stream(request: Request, chat_session_id: str):
    """Endpoint to stream responses for a demo chat session."""
    try:
        # Check if the chat session exists
        if chat_session_id not in message_queues:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found"
            )

        # Get the next message from the queue
        message_data = await message_queues[chat_session_id].get()
        user_message = message_data["message"]
        pdf_id = message_data["pdf_id"]

        # Create the retrieval chain for the demo
        retrieval_chain = create_chain(chat_history=[], user_id="demo-user", pdf_id=pdf_id, demo=True)

        async def generate():
            """Generator function to stream AI responses."""
            try:
                async for chunk in retrieval_chain.astream(user_message):
                        if hasattr(chunk, "content"):  # Check if chunk has content
                            content = chunk.content.replace("\n", "<br>")
                            yield f"data: {content}\n\n"
                yield "event: end\ndata: \n\n"
            except Exception as e:
                logging.error(f"❌ Error generating stream: {e}")
                yield "event: error\ndata: Internal server error\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        logging.error(f"❌ Error processing stream: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal processing error"
        )




    

