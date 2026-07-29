import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que Next confunda la raíz del workspace con un lockfile ajeno en el home.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
