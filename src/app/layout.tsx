import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Providers } from "@/app/providers"

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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
