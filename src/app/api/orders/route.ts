import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { createOrder, getPaginatedOrders } from "@/app/api/database"
import { MAX_PAGE_LIMIT, PAGE_LIMIT } from "@/shared/api/contracts"
import { createOrderSchema } from "@/shared/api/shemas"

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

export async function POST(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const body = await request.json().catch(() => null)
  const parsedBody = createOrderSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsedBody.error.flatten()
      },
      { status: 400 }
    )
  }

  const orderId = createOrder(parsedBody.data)

  return NextResponse.json({ ok: true, id: orderId }, { status: 201 })
}
