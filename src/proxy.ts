import { NextRequest, NextResponse } from "next/server"

import { paraglideMiddleware } from "@/shared/i18n/server"
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth"

const PUBLIC_ROUTES = new Set(["/login", "/register"])
const PROTECTED_ROUTES = ["/orders", "/products", "/statistics"]

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.has(pathname)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const hasValidToken = Boolean(token && verifyAuthToken(token))

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasValidToken ? "/orders" : "/login", request.url))
  }

  if (isPublicRoute(pathname) && hasValidToken) {
    return NextResponse.redirect(new URL("/orders", request.url))
  }

  if (isProtectedRoute(pathname) && !hasValidToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return paraglideMiddleware(request, ({ request: localizedRequest, locale }) => {
    const requestHeaders = new Headers(localizedRequest.headers)
    requestHeaders.set("x-paraglide-locale", locale)
    requestHeaders.set("x-paraglide-request-url", localizedRequest.url)

    return NextResponse.next({ request: { headers: requestHeaders } })
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
