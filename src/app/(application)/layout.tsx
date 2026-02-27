import { getServerLocale } from "@/shared/lib/locale"
import { AppWrapper } from "@/widgets/AppWrapper"

export default async function ApplicationLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale()

  return <AppWrapper locale={locale}>{children}</AppWrapper>
}
