import asyncio

from fastapi import APIRouter, Request, Depends
import redis.asyncio as redis
from starlette.responses import StreamingResponse

from app.dependencies import get_redis_client

router = APIRouter()


@router.get("/")
async def sse(request: Request, redis_client: redis.Redis = Depends(get_redis_client)):
    async def event_generator():
        redis_pubsub = redis_client.pubsub()

        await redis_pubsub.subscribe("image_updates")

        try:
            yield "data: connected\n\n"

            while True:
                if await request.is_disconnected():
                    break

                message = await redis_pubsub.get_message(ignore_subscribe_messages=True, timeout=1)
                if message and message.get("type") == "message":

                    data = message.get("data")
                    if isinstance(data, bytes):
                        data = data.decode("utf-8")
                    yield f"data: {data}\n\n"

                await asyncio.sleep(0.5)

        except redis.ConnectionError:
            pass
        finally:
            await redis_pubsub.unsubscribe("image_updates")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )
