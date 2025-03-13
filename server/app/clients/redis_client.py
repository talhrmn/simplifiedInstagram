from typing import Optional

import redis.asyncio as redis
import httpx

from app.core.settings import server_settings


class RedisClient:

    def __init__(self):
        self.host = server_settings.REDIS_HOST
        self.port = server_settings.REDIS_PORT
        self.db = server_settings.REDIS_DB
        self.client: Optional[redis.Redis] = None

    async def connect(self):
        self.client = redis.from_url(url=f"redis://{self.host}:{self.port}/{self.db}", decode_responses=True)
        await self._load_images(image_data_url=server_settings.IMAGE_DATA_URL)

    async def close(self):
        if self.client:
            await self.client.close()

    async def _load_images(self, image_data_url: str):
        total_keys = await self.client.dbsize()
        if total_keys != server_settings.DEFAULT_IMAGE_LIMIT:
            async with httpx.AsyncClient() as async_httpx_client:
                response = await async_httpx_client.get(url=f"{image_data_url}={server_settings.DEFAULT_IMAGE_LIMIT - total_keys}")
                response.raise_for_status()
                response_data = response.json()
                image_data = {image.get("id"): image.get("download_url") for image in response_data}
                async with self.client.pipeline() as async_pipeline:
                    for image_id, image_url in image_data.items():
                        async_pipeline.hset(image_id, mapping={"image_url": image_url, "likes": 0, "dislikes": 0})
                    await async_pipeline.execute()


redis_client = RedisClient()
