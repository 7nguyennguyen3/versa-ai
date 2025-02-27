from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.db import lifespan
from dotenv import load_dotenv
import logging
import os
from app.routes import router 
load_dotenv()

# Get log level from environment variable or default to INFO
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
allowed_origins = os.getenv("ALLOWED_ORIGINS")

# Configure logging globally
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logging.info("🚀 Logging is set up globally!")

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
            "detail": err["msg"]
        }
        for err in exc.errors()
    ]

    return JSONResponse(
        status_code=422,
        content={"detail": errors}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)), log_level="debug")
