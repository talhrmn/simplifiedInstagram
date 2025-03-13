import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["picsum.photos"], // Add "picsum.photos" to allowed domains
  },
};

export default nextConfig;
