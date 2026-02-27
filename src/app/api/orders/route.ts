import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { getPaginatedOrders } from "@/app/api/database"
import { MAX_PAGE_LIMIT, PAGE_LIMIT } from "@/shared/api/contracts"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const parseNumberParam = (value: string | null, fallback: number) => {
    if (!value) {
      return fallback
    }

    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return fallback
    }

    return parsed
  }

  const page = parseNumberParam(request.nextUrl.searchParams.get("page"), 1)
  const limit = Math.min(
    parseNumberParam(request.nextUrl.searchParams.get("limit"), PAGE_LIMIT),
    MAX_PAGE_LIMIT
  )
  const orders = getPaginatedOrders({ page, limit })

  return NextResponse.json(orders)
}
