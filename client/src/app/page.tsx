"use client";

import ImagesPageComponent from "@/app/components/images-page-component/imagePageComponent";
import { ImageDataProvider } from "@/app/contexts/image-context/imageContext";

import styles from "./page.module.css";
import { HeaderComponent } from "@/app/components/header-component/headerComponent";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ImageDataProvider>
          <HeaderComponent />
          <ImagesPageComponent />
        </ImageDataProvider>
      </div>
    </div>
  );
}
