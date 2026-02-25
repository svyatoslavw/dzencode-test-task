import { NextRequest, NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/shared/lib/auth"

const PUBLIC_ROUTES = new Set(["/login", "/register"])
const PROTECTED_ROUTES = ["/orders", "/products"]

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.has(pathname)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const hasValidToken = Boolean(token && verifyAuthToken(token))

  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/auth/")) {
      return NextResponse.next()
    }

    if (!hasValidToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.next()
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = hasValidToken ? "/orders" : "/login"
    return NextResponse.redirect(url)
  }

  if (isPublicRoute(pathname) && hasValidToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/orders"
    return NextResponse.redirect(url)
  }

  if (isProtectedRoute(pathname) && !hasValidToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
