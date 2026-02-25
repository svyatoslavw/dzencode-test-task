import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { listProducts } from "@/app/api/database"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const type = request.nextUrl.searchParams.get("type")?.trim() ?? ""
  const products = listProducts(type || undefined)

  return NextResponse.json({ data: products })
}
