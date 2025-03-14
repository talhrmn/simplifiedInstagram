import pytest
from unittest.mock import MagicMock

from app.handlers.images import ImagesHandler


@pytest.mark.asyncio
async def test_check_if_image_exists_true():
    mock_redis_client = MagicMock()

    async def mock_exists(image_id):
        return 1

    mock_redis_client.exists = mock_exists

    handler = ImagesHandler()
    result = await handler.check_if_image_exists("image1", mock_redis_client)

    assert result is True


@pytest.mark.asyncio
async def test_check_if_image_exists_false():
    mock_redis_client = MagicMock()

    async def mock_exists(image_id):
        return 0

    mock_redis_client.exists = mock_exists

    handler = ImagesHandler()
    result = await handler.check_if_image_exists("image1", mock_redis_client)

    assert result is False


@pytest.mark.asyncio
async def test_like_image():
    mock_redis_client = MagicMock()

    async def mock_hincrby(image_id, field, value):
        assert field == "likes"
        assert value == 1
        return 10

    mock_redis_client.hincrby = mock_hincrby

    handler = ImagesHandler()
    result = await handler.like_image("image1", mock_redis_client)

    assert result == 10


@pytest.mark.asyncio
async def test_dislike_image():
    mock_redis_client = MagicMock()

    async def mock_hincrby(image_id, field, value):
        assert field == "dislikes"
        assert value == 1
        return 5

    mock_redis_client.hincrby = mock_hincrby

    handler = ImagesHandler()
    result = await handler.dislike_image("image1", mock_redis_client)

    assert result == 5
