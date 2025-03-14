import redis.asyncio as redis

from app.clients.redis_client import redis_client


def get_redis_client() -> redis.Redis:
    """
    Dependency func to retrieve the redis client
    :return:
    """
    if not redis_client.client:
        raise Exception("Redis was not initialized properly!")
    return redis_client.client
