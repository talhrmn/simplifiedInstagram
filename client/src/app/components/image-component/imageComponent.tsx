import { ImageDataProps } from "@/app/components/images-page-component/types";
import styles from "@/app/components/image-component/styles.module.css";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useState } from "react";
import { apiClient } from "@/app/utils/apiClient";
import { useDataImage } from "@/app/contexts/image-context/imageContext";
import Image from "next/image";

const ImageComponent = ({
  image_id,
  image_url,
  likes,
  dislikes,
}: ImageDataProps) => {
  const { updateImage } = useDataImage();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClickLike = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/images/${image_id}/like`);
      updateImage({ type: "like", image_id, likes: response.data });
    } catch (error: unknown) {
      console.error("Failed to like image", error);
    } finally {
      setIsLoading(false);
    }
  }, [image_id, updateImage, isLoading]);

  const handleOnClickDislike = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/images/${image_id}/dislike`);
      updateImage({ type: "dislike", image_id, dislikes: response.data });
    } catch (error: unknown) {
      console.error("Failed to dislike image", error);
    } finally {
      setIsLoading(false);
    }
  }, [image_id, updateImage, isLoading]);

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <div className={styles.imageBox}>
          <Image
            key={image_id}
            src={image_url}
            alt=""
            layout="fill" // Makes the image fill the parent container
            objectFit="cover" // Ensures the image behaves like the `object-fit: cover;` in your CSS
            className={styles.imageBox} // Apply the styles
          />
        </div>
      </div>
      <div className={styles.Actions}>
        <button
          className={styles.dislike}
          onClick={handleOnClickDislike}
          disabled={isLoading}
        >
          <ThumbsDown size={16} />
          <span>{dislikes}</span>
        </button>
        <button
          className={styles.like}
          onClick={handleOnClickLike}
          disabled={isLoading}
        >
          <ThumbsUp size={16} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};

export default ImageComponent;
