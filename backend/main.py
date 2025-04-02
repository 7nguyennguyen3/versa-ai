from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import os

# Configure logging FIRST before any imports
load_dotenv()
log_level = os.getenv("LOG_LEVEL", "INFO").upper()

logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,  # Override existing configurations
)

# Suppress DEBUG logs from third-party libraries
logging.getLogger("pinecone").setLevel(logging.WARNING)
logging.getLogger("pinecone_plugin_interface").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("httpx").setLevel(logging.WARNING)

logging.info("🚀 Logging is set up globally!")

# Now import other modules
from app.db import lifespan
from app.routes import router

allowed_origins = os.getenv("ALLOWED_ORIGINS")

app = FastAPI(lifespan=lifespan)
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [
        {
            "error": f"Missing/Invalid Field: {'.'.join(map(str, err['loc']))}",
            "detail": err["msg"],
        }
        for err in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": errors})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        log_config=None,  # Prevent Uvicorn from overriding your config
    )
