import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Charts"
}

export default function ChartsPage() {
  redirect("/statistics")
}
