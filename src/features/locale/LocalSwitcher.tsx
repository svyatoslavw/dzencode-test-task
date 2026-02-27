"use client"

import { Locale, setLocale } from "@/shared/i18n/runtime"
import { m } from "@/shared/i18n/messages"

interface LocalSwitcherProps {
  locale: Locale
}

const LocalSwitcher = ({ locale }: LocalSwitcherProps) => {
  const handleLocaleChange = async (nextLocale: "ru" | "en") => {
    await setLocale(nextLocale)
  }

  return (
    <div
      className="btn-group btn-group-sm"
      role="group"
      aria-label={m.locale_switch_aria({}, { locale })}
    >
      <button
        type="button"
        className={`btn btn-outline-secondary ${locale === "ru" ? "active" : ""}`}
        onClick={() => handleLocaleChange("ru")}
      >
        RU
      </button>
      <button
        type="button"
        className={`btn btn-outline-secondary ${locale === "en" ? "active" : ""}`}
        onClick={() => handleLocaleChange("en")}
      >
        EN
      </button>
    </div>
  )
}

export { LocalSwitcher }
