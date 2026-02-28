import { AuthForm } from "@/features/auth"
import { getServerLocale } from "@/shared/lib/locale"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  robots: {
    index: false,
    follow: false
  }
}

export default async function RegisterPage() {
  const locale = await getServerLocale()

  return <AuthForm mode="register" locale={locale} />
}
