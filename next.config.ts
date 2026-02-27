import { paraglideWebpackPlugin } from "@inlang/paraglide-js"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [42, 84],
    qualities: [85],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/seed/**"
      }
    ]
  },
  webpack: (config) => {
    config.plugins.push(
      paraglideWebpackPlugin({
        outdir: "./src/shared/i18n",
        project: "./project.inlang",
        strategy: ["cookie", "baseLocale"]
      })
    )

    return config
  },
  reactCompiler: true,
  turbopack: {
    root: process.cwd()
  }
}

export default nextConfig
