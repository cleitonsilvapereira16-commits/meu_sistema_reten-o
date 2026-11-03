import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <--- Adiciona esta linha para gerar HTML estático puro
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;