import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Maps"
}

export default function MapsPage() {
  redirect("/statistics")
}
