import { AuthForm } from "@/features/auth"
import { getServerLocale } from "@/shared/lib/locale"

export default async function RegisterPage() {
  const locale = await getServerLocale()

  return <AuthForm mode="register" locale={locale} />
}
