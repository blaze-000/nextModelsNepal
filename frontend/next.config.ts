import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.68.103",
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

  // Webpack config for handling ORPC backend imports
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Allow importing backend code on server side
      config.externals = [...(config.externals || [])];
    }
    return config;
  },
};

export default nextConfig;