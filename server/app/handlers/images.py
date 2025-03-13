import redis.asyncio as redis


class ImagesHandler:
    def __init__(self):
        pass

    @staticmethod
    async def check_if_image_exists(image_id: str, redis_client: redis.Redis):
        return await redis_client.exists(image_id) != 0

    @staticmethod
    async def like_image(image_id: str, redis_client: redis.Redis) -> int:
        updated_likes = await redis_client.hincrby(image_id, "likes", 1)
        return updated_likes

    @staticmethod
    async def dislike_image(image_id: str, redis_client: redis.Redis) -> int:
        updated_dislikes = await redis_client.hincrby(image_id, "dislikes", 1)
        return updated_dislikes

image_handler = ImagesHandler()