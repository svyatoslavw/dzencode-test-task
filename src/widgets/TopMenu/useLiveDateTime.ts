"use client"

import { useEffect, useState } from "react"

const formatDateTime = (date: Date, locale: string): string => {
  const formatLocale = locale === "en" ? "en-GB" : "ru-RU"

  return new Intl.DateTimeFormat(formatLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date)
}

export const useLiveDateTime = (locale: string) => {
  const [currentDateTime, setCurrentDateTime] = useState(() => formatDateTime(new Date(), locale))

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(formatDateTime(new Date(), locale)), 1000)

    return () => clearInterval(timer)
  }, [locale])

  return currentDateTime
}
