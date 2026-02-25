import { NextRequest, NextResponse } from "next/server"

import { getAuthorizedUser, unauthorizedResponse } from "@/app/api/_lib/require-auth"
import { deleteOrderById, getOrderDetails } from "@/app/api/database"

export const runtime = "nodejs"

interface Params {
  params: Promise<{ id: string }>
}

const parseId = async ({ params }: Params): Promise<number | null> => {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)

  if (!Number.isInteger(id) || id <= 0) {
    return null
  }

  return id
}

export async function GET(request: NextRequest, context: Params) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const id = await parseId(context)

  if (!id) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 })
  }

  const order = getOrderDetails(id)

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ data: order })
}

export async function DELETE(request: NextRequest, context: Params) {
  const user = getAuthorizedUser(request)

  if (!user) {
    return unauthorizedResponse()
  }

  const id = await parseId(context)

  if (!id) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 })
  }

  const deleted = deleteOrderById(id)

  if (!deleted) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
