export const formatPrice = (value: number): string => {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  const normalizedCents = Math.round(value)
  const amount = normalizedCents / 100

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
    .format(amount)
    .replace(/,/g, " ")
}
