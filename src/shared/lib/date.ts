const parseDate = (value: string): Date | null => {
  const normalized = value.includes("T") ? value : value.replace(" ", "T")
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export const formatDateByParts = (value: string, options: Intl.DateTimeFormatOptions): string => {
  const date = parseDate(value)

  if (!date) {
    return value
  }

  return new Intl.DateTimeFormat("en-GB", options)
    .formatToParts(date)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join(" / ")
}

export const formatShortDate = (value: string): string => {
  return formatDateByParts(value, {
    day: "2-digit",
    month: "2-digit"
  })
}

export const formatFullDate = (value: string): string => {
  return formatDateByParts(value, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}
