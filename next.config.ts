import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow AMPRE CDN image domains (confirmed: trreb-image.ampre.ca)
    remotePatterns: [
      {
        // Confirmed AMPRE/TRREB photo CDN
        protocol: "https",
        hostname: "trreb-image.ampre.ca",
      },
      {
        // Wildcard for other AMPRE subdomains
        protocol: "https",
        hostname: "**.ampre.ca",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.trreb.ca",
      },
    ],
  },
};

export default nextConfig;
