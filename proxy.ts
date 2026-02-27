import { NextRequest, NextResponse } from "next/server"

import { paraglideMiddleware } from "@/shared/i18n/server"
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

  return paraglideMiddleware(request, ({ request: localizedRequest, locale }) => {
    const localizedUrl = new URL(localizedRequest.url)
    const localizedPathname = localizedUrl.pathname

    const requestHeaders = new Headers(localizedRequest.headers)
    requestHeaders.set("x-paraglide-locale", locale)
    requestHeaders.set("x-paraglide-request-url", localizedRequest.url)

    if (localizedPathname.startsWith("/api/")) {
      if (localizedPathname.startsWith("/api/auth/")) {
        return NextResponse.next({
          request: { headers: requestHeaders }
        })
      }

      if (!hasValidToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      return NextResponse.next({
        request: { headers: requestHeaders }
      })
    }

    if (localizedPathname === "/") {
      return NextResponse.redirect(new URL(hasValidToken ? "/orders" : "/login", request.url))
    }

    if (isPublicRoute(localizedPathname) && hasValidToken) {
      return NextResponse.redirect(new URL("/orders", request.url))
    }

    if (isProtectedRoute(localizedPathname) && !hasValidToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next({
      request: { headers: requestHeaders }
    })
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
