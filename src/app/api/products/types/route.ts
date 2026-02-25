import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { listProductTypes } from "@/app/api/database"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const types = listProductTypes()

  return NextResponse.json({ data: types })
}
