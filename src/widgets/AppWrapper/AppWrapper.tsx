"use client"

import { AppHeader } from "./AppHeader"
import { AppSidebar } from "./AppSidebar"

interface AppWrapperProps {
  title: string
  children: React.ReactNode
}

export const AppWrapper = ({ title, children }: AppWrapperProps) => {
  return (
    <div className="container-fluid bg-body-tertiary min-vh-100 px-0">
      <AppHeader />
      <AppSidebar />
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
