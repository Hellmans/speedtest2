from fastapi import FastAPI, APIRouter, Request, Query
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import time
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Pre-generate chunks (zeros are fastest)
CHUNKS = {
    10: b'\x00' * (10 * 1024 * 1024),
    25: b'\x00' * (25 * 1024 * 1024),
    50: b'\x00' * (50 * 1024 * 1024),
    100: b'\x00' * (100 * 1024 * 1024),
}

@api_router.get("/")
async def root():
    return {"message": "SpeedTest API"}

@api_router.get("/ping")
async def ping():
    return {"t": time.time() * 1000}

@api_router.get("/download")
async def download(size: int = Query(default=50)):
    """Return pre-generated data chunk"""
    chunk_size = min(size, 100)
    if chunk_size not in CHUNKS:
        chunk_size = 50
    
    return Response(
        content=CHUNKS[chunk_size],
        media_type="application/octet-stream",
        headers={
            "Content-Length": str(len(CHUNKS[chunk_size])),
            "Cache-Control": "no-store"
        }
    )

@api_router.post("/upload")
async def upload(request: Request):
    """Receive upload data"""
    total = 0
    async for chunk in request.stream():
        total += len(chunk)
    return {"bytes": total}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
