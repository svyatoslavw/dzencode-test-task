import { AuthForm } from "@/features/auth/AuthForm"

import styles from "../styles/AuthPage.module.css"

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <AuthForm mode="login" />
    </main>
  )
}
