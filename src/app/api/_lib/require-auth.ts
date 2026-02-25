import { NextRequest, NextResponse } from "next/server"

import { findUserById, toPublicUser } from "@/app/api/database"
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/shared/lib"

export const unauthorizedResponse = (): NextResponse => {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}

export const getAuthorizedUser = (request: NextRequest) => {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const payload = verifyAuthToken(token)

  if (!payload) {
    return null
  }

  const user = findUserById(Number(payload.sub))

  return user ? toPublicUser(user) : null
}
