import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "192.168.1.103",
    "192.168.1.103:3000",
    "192.168.1.102",
    "192.168.1.102:3000",
    "192.168.1.*",
    "192.168.*.*",
    "0.0.0.0",
    "0.0.0.0:3000"
  ]
};

export default nextConfig;
