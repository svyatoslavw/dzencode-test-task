import { getServerLocale } from "@/shared/lib/locale"
import { NavigationMenu, TopMenu } from "@/widgets"

export default async function ApplicationLayout({ children }: { children: React.ReactNode }) {
  // const cookieStore = await cookies()
  // const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  // const isAuthorized = Boolean(token && verifyAuthToken(token))

  // if (!isAuthorized) redirect("/login")

  const locale = await getServerLocale()

  return (
    <div
      className="container-fluid bg-body-tertiary min-vh-100 vh-100 px-0 overflow-hidden"
      style={{ maxHeight: "100vh" }}
    >
      <TopMenu locale={locale} />
      <NavigationMenu locale={locale} />
      <main
        className="p-3 p-md-4 d-flex flex-column overflow-y-auto"
        style={{
          marginTop: "var(--app-header-height)",
          marginLeft: "var(--app-sidebar-width)",
          height: "calc(100vh - var(--app-header-height))",
          minHeight: 0
        }}
      >
        <div className="h-100 d-flex flex-column">{children}</div>
      </main>
    </div>
  )
}
