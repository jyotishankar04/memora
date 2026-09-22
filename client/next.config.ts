import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pricing", destination: "/contribute", permanent: true },
      { source: "/open-source", destination: "/contribute", permanent: true },
    ];
  },
};

export default nextConfig;
