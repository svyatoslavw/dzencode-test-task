export const formatPrice = (value: number): string => {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 })
    .format(value)
    .replace(/,/g, " ")
}
