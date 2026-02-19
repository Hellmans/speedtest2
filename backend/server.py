from fastapi import FastAPI, APIRouter, Response
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import time
import random
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@api_router.get("/")
async def root():
    return {"message": "SpeedTest API - Ready"}

@api_router.get("/ping")
async def ping():
    """Endpoint for measuring ping/latency"""
    return {"timestamp": time.time() * 1000}

@api_router.get("/download")
async def download():
    """
    Generate random data for download speed test
    Returns 25MB of random data
    """
    chunk_size = 1024 * 1024  # 1MB chunks
    total_size = 25 * 1024 * 1024  # 25MB total
    
    def generate_data():
        bytes_sent = 0
        while bytes_sent < total_size:
            # Generate random bytes for realistic speed test
            chunk = os.urandom(min(chunk_size, total_size - bytes_sent))
            bytes_sent += len(chunk)
            yield chunk
    
    return StreamingResponse(
        generate_data(),
        media_type="application/octet-stream",
        headers={
            "Content-Length": str(total_size),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@api_router.post("/upload")
async def upload(request_body: bytes = b""):
    """
    Endpoint for upload speed test
    Receives data and returns the size received
    """
    from fastapi import Request
    return {"received": 0, "timestamp": time.time() * 1000}

from fastapi import Request

@api_router.post("/upload-test")
async def upload_test(request: Request):
    """
    Endpoint for upload speed test
    Receives streamed data and returns the size received
    """
    total_bytes = 0
    start_time = time.time()
    
    async for chunk in request.stream():
        total_bytes += len(chunk)
    
    end_time = time.time()
    duration = end_time - start_time
    
    return {
        "received": total_bytes,
        "duration": duration,
        "timestamp": time.time() * 1000
    }

@api_router.get("/garbage")
async def garbage():
    """
    Alternative download endpoint that returns chunks for precise measurement
    Query param: size (in MB, default 10)
    """
    from fastapi import Query
    return StreamingResponse(
        iter([os.urandom(1024 * 1024) for _ in range(10)]),
        media_type="application/octet-stream"
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("SpeedTest API started")
