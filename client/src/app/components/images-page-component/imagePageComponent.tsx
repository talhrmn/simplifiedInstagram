import ImageComponent from "@/app/components/image-component/imageComponent";
import styles from "@/app/components/images-page-component/styles.module.css";
import { useDataImage } from "@/app/contexts/image-context/imageContext";
import { apiClient } from "@/app/utils/apiClient";
import { useEffect, useState } from "react";

const ImagesPageComponent = () => {
  const { imageData, setImageData } = useDataImage();
  const [loading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/images");
        setImageData(response.data);
      } catch (error: unknown) {
        console.error("Failed to fetch image data: ", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [setImageData]);

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

  return <>{loading ? loadingPage : error ? errorPage : imageGrid}</>;
};

export default ImagesPageComponent;
