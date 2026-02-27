import { cookies } from "next/headers"

import { assertIsLocale } from "@/shared/i18n/runtime"
import { AppWrapper } from "@/widgets/AppWrapper"

export default async function ApplicationLayout({ children }: { children: React.ReactNode }) {
  //   const response = await apiRequest<{ user: UserModel }>("/api/auth/me")

  //   if (!response.user) {
  //     redirect("/login")
  //   }

  const cookieStore = await cookies()
  const locale = assertIsLocale(cookieStore.get("PARAGLIDE_LOCALE")?.value)

  return <AppWrapper locale={locale}>{children}</AppWrapper>
}
