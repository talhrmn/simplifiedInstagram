import json
from typing import List

import redis.asyncio as redis
from fastapi import APIRouter, HTTPException
from fastapi.params import Depends

from app.dependencies import get_redis_client
from app.handlers.images import image_handler
from app.schemas.images import ImageDataSchema, ImageData

router = APIRouter()


@router.get("/", response_model=List[ImageDataSchema])
async def get_all_images(redis_client: redis.Redis = Depends(get_redis_client)) -> List[ImageDataSchema]:
    async with redis_client.pipeline(transaction=False) as async_pipeline:
        image_ids = [image_id async for image_id in redis_client.scan_iter()]
        for image_id in image_ids:
            async_pipeline.hgetall(image_id)
        results = await async_pipeline.execute()

    image_data = [
        ImageDataSchema(image_id=image_id, **ImageData(**results[index]).model_dump())
        for index, image_id in enumerate(image_ids)
    ]

    return image_data


@router.post("/{image_id}/like", response_model=int)
async def like_image(
        image_id: str,
        redis_client: redis.Redis = Depends(get_redis_client)
) -> int:
    if not await image_handler.check_if_image_exists(image_id=image_id, redis_client=redis_client):
        raise HTTPException(status_code=404, detail="Image not found")
    try:
        update_likes = await image_handler.like_image(image_id=image_id, redis_client=redis_client)
        update_data = {
            "type": "like",
            "image_id": image_id,
            "likes": update_likes
        }
        await redis_client.publish("image_updates", json.dumps(update_data))
        return update_likes
    except redis.ConnectionError as conn_err:
        raise HTTPException(status_code=500, detail=f"Connection error: {conn_err}")


@router.post("/{image_id}/dislike", response_model=int)
async def dislike_image(
        image_id: str,
        redis_client: redis.Redis = Depends(get_redis_client)
) -> int:
    if not await image_handler.check_if_image_exists(image_id=image_id, redis_client=redis_client):
        raise HTTPException(status_code=404, detail="Image not found")
    try:
        update_dislikes = await image_handler.dislike_image(image_id=image_id, redis_client=redis_client)
        update_data = {
            "type": "like",
            "image_id": image_id,
            "dislikes": update_dislikes
        }
        await redis_client.publish("image_updates", json.dumps(update_data))
        return update_dislikes
    except redis.ConnectionError as conn_err:
        raise HTTPException(status_code=500, detail=f"Connection error: {conn_err}")
