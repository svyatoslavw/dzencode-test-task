import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/shared/lib"

export default async function HomePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const isAuthorized = Boolean(token && verifyAuthToken(token))

  redirect(isAuthorized ? "/orders" : "/login")
}
