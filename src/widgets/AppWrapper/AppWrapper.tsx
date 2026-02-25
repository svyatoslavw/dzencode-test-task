"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserCard } from "@/entities/user/ui/UserCard"
import { useCurrentUser } from "@/shared/api/hooks/useCurrentUser"
import { useLogout } from "@/shared/api/hooks/useLogout"
import { useLiveDateTime } from "@/widgets/AppWrapper/useLiveDateTime"

interface AppWrapperProps {
  title: string
  children: React.ReactNode
}

const navItems = [
  { href: "/orders", label: "Приходы" },
  { href: "/products", label: "Продукты" }
]

export const AppWrapper = ({ title, children }: AppWrapperProps) => {
  const pathname = usePathname()
  const logout = useLogout()
  const { data: user } = useCurrentUser()
  const currentDateTime = useLiveDateTime()

  return (
    <div className="container-fluid bg-body-tertiary min-vh-100 d-flex flex-column px-0">
      <header className="bg-white border-bottom p-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-dark">OP</span>
          <strong>Orders & Products</strong>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="btn-group btn-group-sm" role="group" aria-label="Language toggle">
            <button type="button" className="btn btn-outline-secondary active">
              RU
            </button>
            <button type="button" className="btn btn-outline-secondary">
              EN
            </button>
          </div>

          <span className="small text-body-secondary">{currentDateTime}</span>
          <span className="badge rounded-pill text-bg-primary">Active: --</span>
        </div>
      </header>

      <div className="row flex-grow-1 g-0">
        <aside className="col-12 col-lg-3 col-xl-2 bg-white border-end d-flex flex-column px-3 py-4 gap-3">
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

          <div className="mt-auto d-flex flex-column gap-3">
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

        <main className="col-12 col-lg-9 col-xl-10 p-3 p-md-4 d-flex flex-column flex-1">
          <div className="card h-100 border-0">
            <div className="card-body">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
