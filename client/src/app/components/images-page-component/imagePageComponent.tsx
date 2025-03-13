import ImageComponent from "@/app/components/image-component/imageComponent";
import { ImageDataProps } from "@/app/components/images-page-component/types";
import { apiClient } from "@/app/utils/apiClient";
import { useEffect, useState } from "react";
import styles from "@/app/components/images-page-component/styles.module.css";

const ImagesPageComponent = () => {
  const [imageData, setImageData] = useState<ImageDataProps[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/images");
        setImageData(response.data);
      } catch (error: any) {
        console.error("Failed to fetch image data");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const errorPage = <div className={styles.errorPage}>Error</div>;
  const loadingPage = <div className={styles.loadingPage}>Loading</div>;
  const imageGrid = !imageData.length ? (
    <div className={styles.noImages}>No Images To Display</div>
  ) : (
    <div className={styles.imageGrid}>
      {imageData.map((image) => (
        <ImageComponent key={image.image_id} {...image} />
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h3 className={styles.h3Title}>Welcome to Simplified Instagram</h3>
      </div>
      {loading ? loadingPage : error ? errorPage : imageGrid}
    </div>
  );
};

export default ImagesPageComponent;
