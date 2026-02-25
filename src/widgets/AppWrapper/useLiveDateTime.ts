"use client"

import { useEffect, useState } from "react"

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date)
}

export const useLiveDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(() => formatDateTime(new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(formatDateTime(new Date()))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return currentDateTime
}
