import { AuthForm } from "@/features/auth"
import { getServerLocale } from "@/shared/lib/locale"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false
  }
}

export default async function LoginPage() {
  const locale = await getServerLocale()

  return <AuthForm mode="login" locale={locale} />
}
