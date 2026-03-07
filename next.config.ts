import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "shikimori.one" },
      { protocol: "https", hostname: "shikimori.io" },
      { protocol: "https", hostname: "shikimori.me" },
      { protocol: "https", hostname: "shikimori.org" },
      { protocol: "https", hostname: "shikimori.net" },
      { protocol: "https", hostname: "desu.me" },
    ]
  }
};

export default nextConfig;
