import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { deleteProductById } from "@/app/api/database"

export const runtime = "nodejs"

interface Params {
  params: Promise<{ id: string }>
}

const parseId = async ({ params }: Params): Promise<number | null> => {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)

  if (!Number.isInteger(id) || id <= 0) return null

  return id
}

export async function DELETE(request: NextRequest, context: Params) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const id = await parseId(context)

  if (!id) {
    return NextResponse.json({ message: "Invalid product id" }, { status: 400 })
  }

  const deleted = deleteProductById(id)

  if (!deleted) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
