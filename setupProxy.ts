import { createProxyMiddleware } from "http-proxy-middleware"
import { Express } from "express"

export default function setupProxy(app: Express) {
  const target = process.env.REACT_APP_API_URL

  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  )
}
