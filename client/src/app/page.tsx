"use client";

import ImagesPageComponent from "@/app/components/images-page-component/imagePageComponent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <ImagesPageComponent />
    </div>
  );
}
