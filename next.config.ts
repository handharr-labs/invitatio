import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Forge Kit packages ship raw TS source (main: ./src/index.ts, no build step),
  // so Next must transpile them like first-party code.
  transpilePackages: [
    "@handharr-labs/forge-core",
    "@handharr-labs/forge-web-server",
    "@handharr-labs/forge-auth",
    "@handharr-labs/forge-ui-dos",
    "@handharr-labs/forge-ui-base-gold",
  ],
  images: {
    // Guest photos come from Supabase storage / arbitrary couple-supplied URLs.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
