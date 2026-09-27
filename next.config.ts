import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes plain HTML/CSS/JS to out/, which GitHub
  // Pages (or any static host, including Vercel) serves with no Node server.
  output: "export",
  // The site uses plain <img> with pre-generated srcset variants (see
  // scripts/make-images.mjs), so the image optimisation server is not needed.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
