import type { NextConfig } from "next";

const corsHeaders = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "Content-Type, Authorization, X-Requested-With, Accept",
  },
];

const nextConfig: NextConfig = {
  async rewrites() {
    const dest =
      process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_API;
    if (!dest) return [];
    const destClean = dest.replace(/\/$/, "");
    return [
      {
        source: "/api/:path((?!dfu|macros).*)",
        destination: `${destClean}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: corsHeaders,
      },
    ];
  },
};

export default nextConfig;
