import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// Serve from the root during local development so `pnpm dev` works at
// http://localhost:3000. Production builds keep the deployed sub-path.
const IS_DEV = process.env.NODE_ENV === "development";
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (IS_DEV ? "" : "/docs/synth");

/** @type {import('next').NextConfig} */
const config = {
  ...(IS_DEV ? {} : { output: "export" }),
  trailingSlash: true,
  reactStrictMode: true,
  serverExternalPackages: ["@takumi-rs/image-response"],
  images: {
    unoptimized: true,
  },
  ...(BASE_PATH ? { basePath: BASE_PATH, assetPrefix: BASE_PATH } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default withMDX(config);
