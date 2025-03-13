import redis.asyncio as redis

from server.clients.redis_client import redis_client


def get_redis_client() -> redis.Redis:
    return redis_client.client
