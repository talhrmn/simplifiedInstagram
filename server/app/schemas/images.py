from pydantic import BaseModel


class LikesRatio(BaseModel):
    likes: int = 0
    dislikes: int = 0

class ImageData(LikesRatio):
    image_url: str


class ImageDataSchema(ImageData):
    image_id: str
