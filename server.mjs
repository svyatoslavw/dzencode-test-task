import { createServer } from "node:http"

import next from "next"
import { WebSocket, WebSocketServer } from "ws"

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME ?? "0.0.0.0"
const port = Number(process.env.PORT ?? 3000)
const wsPath = process.env.WS_PATH ?? "/ws"

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res)
    })

    const wss = new WebSocketServer({ noServer: true })

    const broadcastSessions = () => {
      const payload = JSON.stringify({
        type: "sessions",
        count: wss.clients.size
      })

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload)
        }
      })
    }

    wss.on("connection", (ws) => {
      broadcastSessions()

      ws.on("close", () => {
        broadcastSessions()
      })
    })

    server.on("upgrade", (request, socket, head) => {
      const requestPath = request.url ? request.url.split("?")[0] : ""

      if (requestPath !== wsPath) {
        socket.destroy()
        return
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request)
      })
    })

    server.listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> WebSocket endpoint: ws://${hostname}:${port}${wsPath}`)
    })
  })
  .catch((error) => {
    console.error("Failed to start server", error)
    process.exit(1)
  })
