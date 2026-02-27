const parseDate = (value: string): Date | null => {
  const normalized = value.includes("T") ? value : value.replace(" ", "T")
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

const resolveLocale = (locale: "ru" | "en"): string => {
  return locale === "en" ? "en-GB" : "ru-RU"
}

export const formatDateByParts = (
  value: string,
  options: Intl.DateTimeFormatOptions,
  locale: "ru" | "en" = "ru"
): string => {
  const date = parseDate(value)

  if (!date) {
    return value
  }

  return new Intl.DateTimeFormat(resolveLocale(locale), options)
    .formatToParts(date)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join("/")
}

export const formatShortDate = (value: string, locale: "ru" | "en" = "ru"): string => {
  return formatDateByParts(
    value,
    {
      day: "2-digit",
      month: "2-digit"
    },
    locale
  )
}

export const formatFullDate = (value: string, locale: "ru" | "en" = "ru"): string => {
  return formatDateByParts(
    value,
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    },
    locale
  )
}
