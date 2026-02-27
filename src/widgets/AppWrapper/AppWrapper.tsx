import { Locale } from "@/shared/i18n/runtime"
import { TopMenu } from "../TopMenu"
import { AppSidebar } from "./AppSidebar"

interface AppWrapperProps {
  locale: Locale
  children: React.ReactNode
}

export const AppWrapper = ({ locale, children }: AppWrapperProps) => {
  return (
    <div className="container-fluid bg-body-tertiary min-vh-100 px-0">
      <TopMenu locale={locale} />
      <AppSidebar locale={locale} />
      <main
        className="p-3 p-md-4"
        style={{
          marginTop: "var(--app-header-height)",
          marginLeft: "var(--app-sidebar-width)"
        }}
      >
        <div>{children}</div>
      </main>
    </div>
  )
}
