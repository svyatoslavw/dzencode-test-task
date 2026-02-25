import { NextRequest, NextResponse } from "next/server"

import bcrypt from "bcryptjs"
import { z } from "zod"

import { findUserByEmail, toPublicUser } from "@/app/api/database"
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS, signAuthToken } from "@/shared/lib"

export const runtime = "nodejs"

const loginSchema = z.object({
  email: z.email("Invalid email").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required")
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsedBody = loginSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsedBody.error.flatten()
      },
      { status: 400 }
    )
  }

  const { email, password } = parsedBody.data

  const user = findUserByEmail(email)

  if (!user) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
  }

  const passwordMatched = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatched) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
  }

  const token = signAuthToken({
    sub: user.id,
    email: user.email,
    name: user.name
  })

  const response = NextResponse.json({ user: toPublicUser(user) })
  response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

  return response
}
