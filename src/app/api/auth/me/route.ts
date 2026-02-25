import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  return NextResponse.json({ user })
}
