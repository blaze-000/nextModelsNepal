import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.68.105",
        port: "8000",

      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      }
    ],
  },
};

export default nextConfig;