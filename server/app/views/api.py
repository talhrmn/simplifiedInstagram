from fastapi import APIRouter

from app.views.v1 import images , sse

api_router = APIRouter()

api_router.include_router(images.router, prefix="/images", tags=["Images"])
api_router.include_router(sse.router, prefix="/sse", tags=["SSE"])
