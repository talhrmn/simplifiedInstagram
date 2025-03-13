from contextlib import asynccontextmanager

import uvicorn
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from server.app.views.api import api_router
from server.clients.redis_client import redis_client
from server.core.settings import server_settings
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis_client.connect()
    yield
    await redis_client.close()


app = FastAPI(
    title=server_settings.APP_NAME,
    version=server_settings.API_VERSION,
    openapi_url=f"{server_settings.API_PREFIX}/openapi.json",
    docs_url=f"{server_settings.API_PREFIX}/docs",
    redoc_url=f"{server_settings.API_PREFIX}/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=server_settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=f"{server_settings.API_PREFIX}/{server_settings.API_VERSION}")


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url=f"{server_settings.API_PREFIX}/docs")


if __name__ == '__main__':
    uvicorn.run(app=server_settings.APP_ROUTE, host=server_settings.APP_HOST, port=server_settings.APP_PORT,
                reload=True)
