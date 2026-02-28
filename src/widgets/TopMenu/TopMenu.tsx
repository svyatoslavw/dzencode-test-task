"use client"
import { LocalSwitcher } from "@/features/locale"
import { m } from "@/shared/i18n/messages"
import { Locale } from "@/shared/i18n/runtime"
import { useActiveSessions } from "./useActiveSessions"
import { useLiveDateTime } from "./useLiveDateTime"

interface TopMenuProps {
  locale: Locale
}

const TopMenu = ({ locale }: TopMenuProps) => {
  const currentDateTime = useLiveDateTime(locale)
  const sessions = useActiveSessions()

  return (
    <header
      className="position-fixed top-0 start-0 end-0 bg-white border-bottom px-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
      style={{ height: "var(--app-header-height)", zIndex: 1030 }}
    >
      <div className="d-flex align-items-center gap-2">
        <span className="badge text-bg-dark">OP</span>
        <strong>{m.header_title({}, { locale })}</strong>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3">
        <LocalSwitcher locale={locale} />
        <span className="small text-body-secondary" suppressHydrationWarning>
          {currentDateTime}
        </span>
        <span className="badge rounded-pill text-bg-primary">
          {m.header_active_users({ count: sessions }, { locale })}
        </span>
      </div>
    </header>
  )
}

export { TopMenu }
