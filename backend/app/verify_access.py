from fastapi import Depends, HTTPException, status, Cookie, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
import logging

security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        # Use 'id' instead of 'sub'
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        logging.error("Token validation failed:", e)  # Log the error
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
async def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: Missing user ID")

        expiration = payload.get("exp")
        if expiration:
            raise HTTPException(status_code=401, detail="Token expired")

        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        logging.error(f"Token validation failed: {e}")  # Debugging
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

async def get_current_user_from_query(request: Request):
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing in query parameters")
    
    return await verify_token(token)