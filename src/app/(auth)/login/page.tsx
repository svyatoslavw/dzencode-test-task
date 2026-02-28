import { AuthForm } from "@/features/auth"
import { getServerLocale } from "@/shared/lib/locale"

export default async function LoginPage() {
  const locale = await getServerLocale()

  return <AuthForm mode="login" locale={locale} />
}
