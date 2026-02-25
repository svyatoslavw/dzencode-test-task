import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/shared/lib"

export const runtime = "nodejs"

export async function POST() {
  const response = NextResponse.json({ ok: true })

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0
  })

  return response
}
