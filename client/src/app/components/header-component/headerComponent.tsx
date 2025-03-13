import styles from "@/app/components/header-component/styles.module.css";
import { useDataImage } from "@/app/contexts/image-context/imageContext";
import { useCallback } from "react";
import { Download } from "lucide-react";

export const HeaderComponent = () => {
  const { imageData } = useDataImage();

  const handleExport = useCallback(async () => {
    try {
      const headers = ["image_id", "image_url", "likes", "dislikes"];
      const csvContent = [
        headers.join(","),
        ...imageData.map((item) =>
          [item.image_id, item.image_url, item.likes, item.dislikes].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "simplified_instagram_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data. Please try again.");
    }
  }, [imageData]);

  return (
    <div className={styles.title}>
      <h3 className={styles.h3Title}>Welcome to Simplified Instagram</h3>
      <button className={styles.exportButton} onClick={handleExport}>
        <Download size={16} /> Export
      </button>
    </div>
  );
};
