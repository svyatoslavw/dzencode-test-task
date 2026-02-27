import { paraglideWebpackPlugin } from "@inlang/paraglide-js"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
