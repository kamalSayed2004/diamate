import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const dest =
      process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_API;
    if (!dest) return [];
    const destClean = dest.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${destClean}/:path*`,
      },
    ];
  },
};

export default nextConfig;
