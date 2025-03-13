import { ImageDataProps } from "@/app/components/images-page-component/types";
import styles from "@/app/components/image-component/styles.module.css";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useCallback, useState } from "react";
import { apiClient } from "@/app/utils/apiClient";

const ImageComponent = ({
  image_id,
  image_url,
  likes,
  dislikes,
}: ImageDataProps) => {
  const [imageLikes, setImageLikes] = useState<number>(likes);
  const [imageDislikes, setImageDislikes] = useState<number>(dislikes);

  const handleOnClickLike = useCallback(async () => {
    try {
      const response = await apiClient.post(`/images/${image_id}/like`);
      console.log(response.data);
      setImageLikes(response.data);
    } catch (error: any) {
      console.error("Failed to fetch image data");
    }
  }, []);

  const handleOnClickDislike = useCallback(async () => {
    try {
      const response = await apiClient.post(`/images/${image_id}/dislike`);
      setImageDislikes(response.data);
    } catch (error: any) {
      console.error("Failed to fetch image data");
    }
  }, []);

  return (
    <div className={styles.container}>
      <img key={image_id} src={image_url} className={styles.imageBox} />
      <div className={styles.Actions}>
        <div className={styles.dislike} onClick={handleOnClickDislike}>
          <ThumbsDown size={16} />
          {imageDislikes}
        </div>
        <div className={styles.like} onClick={handleOnClickLike}>
          <ThumbsUp size={16} />
          {imageLikes}
        </div>
      </div>
    </div>
  );
};

export default ImageComponent;
