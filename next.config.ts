import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// API requests under /api/v1 and /api/v2 are proxied by Route Handlers
// (src/app/api/v1|v2/[...path]/route.ts) instead of rewrites, so that the
// browser's same-origin cookies are stripped before reaching the upstream API.
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
