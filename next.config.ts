import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    domains: ["media.cnn.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
