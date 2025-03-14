import pytest
from fastapi.testclient import TestClient
import redis.asyncio as redis
from app.dependencies import get_redis_client
from app.main import app
from unittest.mock import MagicMock

client = TestClient(app)


@pytest.mark.asyncio
async def test_get_all_images():
    async def mock_scan_iter():
        for image_id in ["image1", "image2"]:
            yield image_id

    async def mock_execute():
        return [
            {"likes": 5, "dislikes": 2, "image_url": "image_url1"},
            {"likes": 3, "dislikes": 1, "image_url": "image_url2"}
        ]

    mock_redis_client = MagicMock()
    mock_redis_client.scan_iter = mock_scan_iter
    mock_redis_client.hgetall.side_effect = mock_execute
    app.dependency_overrides[get_redis_client] = lambda: mock_redis_client
    mock_redis_client.pipeline.return_value.__aenter__.return_value.execute = mock_execute

    response = client.get("/api/v1/images/")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["image_id"] == "image1"
    assert response.json()[0]["image_url"] == "image_url1"
    assert response.json()[0]["likes"] == 5
    assert response.json()[0]["dislikes"] == 2


@pytest.mark.asyncio
async def test_like_image():
    async def mock_exists(image_id):
        return 1

    async def mock_hincrby(image_id, field, value):
        return 6

    async def mock_publish(channel, message):
        pass

    mock_redis_client = MagicMock()
    mock_redis_client.exists = mock_exists
    mock_redis_client.hincrby = mock_hincrby
    mock_redis_client.publish = mock_publish

    app.dependency_overrides[get_redis_client] = lambda: mock_redis_client

    response = client.post("/api/v1/images/image1/like")

    assert response.status_code == 200
    assert response.json() == 6


@pytest.mark.asyncio
async def test_like_image_not_found():
    mock_redis_client = MagicMock()

    async def mock_exists(image_id):
        return 0

    mock_redis_client.exists = mock_exists

    app.dependency_overrides[get_redis_client] = lambda: mock_redis_client

    response = client.post("/api/v1/images/image1/like")

    assert response.status_code == 404
    assert response.json() == {"detail": "Image not found"}


@pytest.mark.asyncio
async def test_dislike_image():
    async def mock_exists(image_id):
        return 1

    async def mock_hincrby(image_id, field, value):
        return 3

    async def mock_publish(channel, message):
        pass

    mock_redis_client = MagicMock()
    mock_redis_client.exists = mock_exists
    mock_redis_client.hincrby = mock_hincrby
    mock_redis_client.publish = mock_publish

    app.dependency_overrides[get_redis_client] = lambda: mock_redis_client

    response = client.post("/api/v1/images/image1/dislike")

    assert response.status_code == 200
    assert response.json() == 3


@pytest.mark.asyncio
async def test_dislike_image_not_found():
    mock_redis_client = MagicMock()

    async def mock_exists(image_id):
        return 0

    mock_redis_client.exists = mock_exists

    app.dependency_overrides[get_redis_client] = lambda: mock_redis_client

    response = client.post("/api/v1/images/image1/dislike")

    assert response.status_code == 404
    assert response.json() == {"detail": "Image not found"}


@pytest.mark.asyncio
async def test_redis_connection_error_on_like():
    async def mock_exists(image_id):
        return 1

    async def mock_hincrby(image_id, field, value):
        raise redis.ConnectionError("Redis connection error")

    mock_redis_client = MagicMock()
    mock_redis_client.exists = mock_exists
    mock_redis_client.hincrby = mock_hincrby

    app.dependency_overrides[get_redis_client] = lambda: mock_redis_client

    response = client.post("/api/v1/images/image1/like")

    assert response.status_code == 500
    assert "Connection error" in response.json()["detail"]
