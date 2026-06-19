import type { NextConfig } from "next";
import BundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack(config: any, { isServer }: { isServer: boolean }) {
    if (!isServer) {
      const splitChunks = config.optimization?.splitChunks ?? {};
      const existingCacheGroups = splitChunks.cacheGroups ?? {};

      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...splitChunks,
          cacheGroups: {
            ...existingCacheGroups,
            // Isolate Stellar/Soroban SDK into its own chunk — only loaded on
            // wallet-connected routes (/dashboard, /escrow).
            stellarSdk: {
              name: "stellar-sdk",
              test: /[\\/]node_modules[\\/](@stellar[\\/]stellar-sdk|@stellar[\\/]freighter-api|stellar-base|@stellar[\\/]stellar-base)[\\/]/,
              chunks: "all",
              priority: 30,
              enforce: true,
              reuseExistingChunk: false,
            },
            // bignumber.js is pulled in by the Stellar SDK and currency utils.
            // Keep it separate to avoid polluting the main chunk.
            bigNumber: {
              name: "bignumber",
              test: /[\\/]node_modules[\\/]bignumber\.js[\\/]/,
              chunks: "all",
              priority: 25,
              enforce: true,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
