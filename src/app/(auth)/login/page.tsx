import { AuthForm } from "@/features/auth"
import { getServerLocale } from "@/shared/lib/locale"

import styles from "../styles/AuthPage.module.css"

export default async function LoginPage() {
  const locale = await getServerLocale()

  return (
    <main className={styles.page}>
      <AuthForm mode="login" locale={locale} />
    </main>
  )
}
