from typing import Optional

import redis

from server.core.settings import server_settings


class RedisClient:

    def __init__(self):
        self.host = server_settings.REDIS_HOST
        self.port = server_settings.REDIS_PORT
        self.db = server_settings.REDIS_DB
        self.client: Optional[redis.Redis] = None

    def connect(self):
        self.client = redis.Redis(host=self.host, port=self.port, db=self.db, decode_responses=True)

    def close(self):
        if self.client:
            self.client.close()


redis_client = RedisClient()
