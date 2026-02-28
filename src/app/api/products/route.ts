import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { createProduct, getPaginatedProducts } from "@/app/api/database"
import { MAX_PAGE_LIMIT, PAGE_LIMIT } from "@/shared/api/contracts"
import { createProductSchema } from "@/shared/api/shemas"

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

  const type = request.nextUrl.searchParams.get("type")?.trim() ?? ""
  const orderIdParam = request.nextUrl.searchParams.get("orderId")
  const parsedOrderId = orderIdParam ? Number.parseInt(orderIdParam, 10) : NaN
  const orderId = Number.isFinite(parsedOrderId) && parsedOrderId > 0 ? parsedOrderId : undefined
  const page = parseNumberParam(request.nextUrl.searchParams.get("page"), 1)
  const limit = Math.min(
    parseNumberParam(request.nextUrl.searchParams.get("limit"), PAGE_LIMIT),
    MAX_PAGE_LIMIT
  )
  const products = getPaginatedProducts({
    page,
    limit,
    type: type || undefined,
    orderId
  })

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const body = await request.json().catch(() => null)
  const parsedBody = createProductSchema.safeParse(body)

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: parsedBody.error.flatten()
      },
      { status: 400 }
    )
  }

  const productId = createProduct(parsedBody.data)

  if (!productId) {
    return NextResponse.json(
      { message: "Cannot create product: selected order does not exist." },
      { status: 400 }
    )
  }

  return NextResponse.json({ ok: true, id: productId }, { status: 201 })
}
