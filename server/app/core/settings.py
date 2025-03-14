from typing import List

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """
    App Config
    """

    APP_NAME: str = "Simplified Instagram"
    APP_ROUTE: str
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    CORS_ORIGINS: List[str]

    API_PREFIX: str = "/api"
    API_VERSION: str = "v1"

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int

    IMAGE_DATA_URL: str
    DEFAULT_IMAGE_LIMIT: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


server_settings = Settings()
