import { ImageDataProps } from "@/app/components/images-page-component/types";

type ImageUpdateType = "like" | "dislike";

export interface ImageUpdateProps {
  type: ImageUpdateType;
  image_id: string;
  likes?: number;
  dislikes?: number;
}

export interface ImageContextProps {
  imageData: ImageDataProps[];
  setImageData: React.Dispatch<React.SetStateAction<ImageDataProps[]>>;
  updateImage: (imageUpdate: ImageUpdateProps) => void;
}
