import { AuthForm } from "@/features/auth/AuthForm"

import styles from "../styles/AuthPage.module.css"

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <AuthForm mode="register" />
    </main>
  )
}
