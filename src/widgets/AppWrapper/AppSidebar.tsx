"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserCard } from "@/entities/user"
import { useCurrentUserQuery, useLogoutMutation } from "@/shared/api"

const navItems = [
  { href: "/orders", label: "Приходы" },
  { href: "/products", label: "Продукты" }
]

const AppSidebar = () => {
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
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="d-flex flex-column gap-3 mt-auto">
        <UserCard user={user} />
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? "Выход..." : "Выйти"}
        </button>
      </div>
    </aside>
  )
}

export { AppSidebar }
