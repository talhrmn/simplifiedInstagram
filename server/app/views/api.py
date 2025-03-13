from fastapi import APIRouter

from server.app.views.v1.images import router

api_router = APIRouter()

api_router.include_router(router, prefix="/images", tags=["Images"])
