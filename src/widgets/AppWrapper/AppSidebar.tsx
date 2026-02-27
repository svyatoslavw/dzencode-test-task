"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserCard } from "@/entities/user"
import { useCurrentUserQuery, useLogoutMutation } from "@/shared/api"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

const navItems = [{ href: "/orders" }, { href: "/products" }]

interface AppSidebarProps {
  locale: Locale
}

const AppSidebar = ({ locale }: AppSidebarProps) => {
  const pathname = usePathname()
  const logout = useLogoutMutation()
  const { data: user } = useCurrentUserQuery()

  return (
    <aside
      className="d-none d-lg-flex position-fixed start-0 bg-white border-end flex-column px-3 py-4 gap-3"
      style={{
        top: "var(--app-header-height)",
        height: "calc(100vh - var(--app-header-height))",
        width: "var(--app-sidebar-width)",
        zIndex: 1020
      }}
    >
      <nav className="nav nav-pills pt-4 flex-column gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : "link-body-emphasis"}`}
            >
              {item.href === "/orders"
                ? m.nav_orders({}, { locale })
                : m.nav_products({}, { locale })}
            </Link>
          )
        })}
      </nav>

      <div className="d-flex flex-column gap-3 mt-auto">
        <UserCard locale={locale} user={user} />
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? m.logout_pending({}, { locale }) : m.logout_button({}, { locale })}
        </button>
      </div>
    </aside>
  )
}

export { AppSidebar }
