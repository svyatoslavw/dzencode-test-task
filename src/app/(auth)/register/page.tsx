import { AuthForm } from "@/features/auth"
import { getServerLocale } from "@/shared/lib/locale"

import styles from "../styles/AuthPage.module.css"

export default async function RegisterPage() {
  const locale = await getServerLocale()

  return (
    <main className={styles.page}>
      <AuthForm mode="register" locale={locale} />
    </main>
  )
}
