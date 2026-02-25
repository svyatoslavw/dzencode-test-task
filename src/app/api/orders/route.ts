import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { listOrders } from "@/app/api/database"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const orders = listOrders()

  return NextResponse.json({ data: orders })
}
