import jwt from "jsonwebtoken"

export const AUTH_COOKIE_NAME = "auth_token"

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me"
const JWT_EXPIRES_IN = "7d"

export interface AuthTokenPayload {
  sub: number
  email: string
  name: string
}

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7
} as const

export const signAuthToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET)

    if (!payload || typeof payload === "string") {
      return null
    }

    const sub = typeof payload.sub === "string" ? Number(payload.sub) : payload.sub

    if (!sub || Number.isNaN(sub)) {
      return null
    }

    if (typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null
    }

    return {
      sub,
      email: payload.email,
      name: payload.name
    }
  } catch {
    return null
  }
}
