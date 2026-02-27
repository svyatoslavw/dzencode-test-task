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

export const metadata: Metadata = {
  title: "Orders & Products",
  description: "DZencode test task"
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
