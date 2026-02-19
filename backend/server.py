from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import StreamingResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import time
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Pre-generate chunk of zeros (much faster than random)
CHUNK_SIZE = 1024 * 1024  # 1MB
ZERO_CHUNK = b'\x00' * CHUNK_SIZE

@api_router.get("/")
async def root():
    return {"message": "SpeedTest API"}

@api_router.get("/ping")
async def ping():
    return {"t": time.time() * 1000}

@api_router.get("/download")
async def download():
    """Fast download test - streams pre-generated data"""
    total_chunks = 100  # 100MB total
    
    def generate():
        for _ in range(total_chunks):
            yield ZERO_CHUNK
    
    return StreamingResponse(
        generate(),
        media_type="application/octet-stream",
        headers={
            "Content-Length": str(CHUNK_SIZE * total_chunks),
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff"
        }
    )

@api_router.post("/upload")
async def upload(request: Request):
    """Fast upload test - just count bytes"""
    total = 0
    async for chunk in request.stream():
        total += len(chunk)
    return {"bytes": total, "t": time.time() * 1000}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
