import { ImageDataProps } from "@/app/components/images-page-component/types";
import { BASE_API_URL, BASE_API_VERSION } from "@/app/consts";
import {
  ImageContextProps,
  ImageUpdateProps,
} from "@/app/contexts/image-context/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const imageDataContext = createContext<ImageContextProps | null>(null);

export const ImageDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [imageData, setImageData] = useState<ImageDataProps[]>([]);
  const [imageMap, setImageMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setImageMap(
      new Map(imageData.map((image, index) => [image.image_id, index]))
    );
  }, [imageData]);

  const updateImage = useCallback(
    (imageUpdate: ImageUpdateProps) => {
      setImageData((prev) => {
        const imageIndex = imageMap.get(imageUpdate.image_id);
        if (imageIndex === undefined) return prev;

        const newData = [...prev];
        const updatedImage = { ...prev[imageIndex] };

        if (imageUpdate.type === "like" && imageUpdate.likes !== undefined) {
          updatedImage.likes = imageUpdate.likes;
        } else if (
          imageUpdate.type === "dislike" &&
          imageUpdate.dislikes !== undefined
        ) {
          updatedImage.dislikes = imageUpdate.dislikes;
        }
        newData[imageIndex] = updatedImage;
        return newData;
      });
    },
    [imageMap]
  );

  useEffect(() => {
    const apiUrl = `${BASE_API_URL}/${BASE_API_VERSION}/sse`;

    const eventSource = new EventSource(apiUrl);

    eventSource.onopen = () => {};

    eventSource.onmessage = (event) => {
      if (event.data === "connected") {
        return;
      }

      try {
        const eventUpdate = JSON.parse(event.data) as ImageUpdateProps;
        updateImage(eventUpdate);
      } catch (error) {
        console.error(
          "Failed to parse SSE data:",
          error,
          "Raw data:",
          event.data
        );
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      setTimeout(() => {
        eventSource.close();
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [updateImage]);

  return (
    <imageDataContext.Provider value={{ imageData, setImageData, updateImage }}>
      {children}
    </imageDataContext.Provider>
  );
};

export const useDataImage = () => {
  const context = useContext(imageDataContext);
  if (context === null) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
};
