"use client"

import { useEffect, useState } from "react"

interface SessionsMessage {
  type: "sessions"
  count: number
}

const getWsUrl = (): string | null => {
  if (typeof window === "undefined") {
    return null
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws"
  return `${protocol}://${window.location.host}/ws`
}

export const useActiveSessions = () => {
  const [sessions, setSessions] = useState(1)

  useEffect(() => {
    const url = getWsUrl()
    if (!url) {
      return
    }

    let socket: WebSocket | null = null
    let reconnectTimeout: number | null = null
    let isUnmounted = false

    const connect = () => {
      socket = new WebSocket(url)

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as SessionsMessage
          if (payload.type === "sessions" && Number.isFinite(payload.count)) {
            setSessions(payload.count)
          }
        } catch {
          // Ignore non-JSON messages from unknown peers/proxies
        }
      }

      socket.onclose = () => {
        if (isUnmounted) {
          return
        }

        reconnectTimeout = window.setTimeout(connect, 1500)
      }
    }

    connect()

    return () => {
      isUnmounted = true

      if (reconnectTimeout) {
        window.clearTimeout(reconnectTimeout)
      }

      socket?.close()
    }
  }, [])

  return sessions
}
