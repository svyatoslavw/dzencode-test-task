import { Locale } from "@/shared/i18n/runtime"
import { TopMenu } from "../TopMenu"
import { AppSidebar } from "./AppSidebar"

interface AppWrapperProps {
  locale: Locale
  children: React.ReactNode
}

export const AppWrapper = ({ locale, children }: AppWrapperProps) => {
  return (
    <div
      className="container-fluid bg-body-tertiary min-vh-100 vh-100 px-0 overflow-hidden"
      style={{ maxHeight: "100vh" }}
    >
      <TopMenu locale={locale} />
      <AppSidebar locale={locale} />
      <main
        className="p-3 p-md-4 d-flex flex-column overflow-hidden"
        style={{
          marginTop: "var(--app-header-height)",
          marginLeft: "var(--app-sidebar-width)",
          height: "calc(100vh - var(--app-header-height))",
          minHeight: 0
        }}
      >
        <div className="h-100 d-flex flex-column" style={{ minHeight: 0 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
