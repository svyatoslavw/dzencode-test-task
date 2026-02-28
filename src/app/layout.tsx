import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { headers } from "next/headers"
import { cache } from "react"

import { Providers } from "@/app/providers"
import {
  assertIsLocale,
  baseLocale,
  getLocale,
  getTextDirection,
  overwriteGetLocale,
  overwriteGetUrlOrigin
} from "@/shared/i18n/runtime"

import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

const APP_TITLE = "Orders & Products"
const APP_DESCRIPTION = "Orders and products management dashboard"

export const metadata: Metadata = {
  title: {
    default: APP_TITLE as string,
    template: `%s | ${APP_TITLE}`
  },
  description: APP_DESCRIPTION,
  applicationName: APP_TITLE,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  keywords: ["orders", "products", "inventory", "dashboard"],
  openGraph: {
    type: "website",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_TITLE
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true
  }
}

const ssrLocale = cache(() => ({ locale: baseLocale, origin: "http://localhost" }))

overwriteGetLocale(() => assertIsLocale(ssrLocale().locale))
overwriteGetUrlOrigin(() => ssrLocale().origin)

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const localeHeader = requestHeaders.get("x-paraglide-locale")
  const requestUrlHeader = requestHeaders.get("x-paraglide-request-url")

  ssrLocale().locale = assertIsLocale(localeHeader ?? baseLocale)
  ssrLocale().origin = requestUrlHeader ? new URL(requestUrlHeader).origin : "http://localhost"

  return (
    <html lang={getLocale()} dir={getTextDirection()}>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
