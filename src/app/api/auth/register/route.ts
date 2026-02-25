import { NextRequest, NextResponse } from "next/server"

import bcrypt from "bcryptjs"
import { z } from "zod"

import { createUser, findUserByEmail, toPublicUser } from "@/app/api/database"
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS, signAuthToken } from "@/shared/lib"

export const runtime = "nodejs"

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.email("Invalid email").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "Password should contain at least 6 symbols")
})

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsedBody = registerSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsedBody.error.flatten()
      },
      { status: 400 }
    )
  }

  const { name, email, password } = parsedBody.data
  const existingUser = findUserByEmail(email)

  if (existingUser) {
    return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = createUser({
    email,
    name,
    passwordHash
  })

  const token = signAuthToken({
    sub: user.id,
    email: user.email,
    name: user.name
  })

  const response = NextResponse.json(
    {
      user: toPublicUser(user)
    },
    { status: 201 }
  )

  response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

  return response
}
