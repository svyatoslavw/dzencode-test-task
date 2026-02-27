import { describe, expect, it } from "vitest"

import { formatPrice } from "@/shared/lib/price"

describe("formatPrice", () => {
  it("formats thousands with spaces", () => {
    expect(formatPrice(2500)).toBe("2 500")
    expect(formatPrice(200000)).toBe("200 000")
  })

  it("keeps decimal values", () => {
    expect(formatPrice(2500.5)).toBe("2 500.5")
    expect(formatPrice(12345.67)).toBe("12 345.67")
  })

  it("handles negative numbers and zero", () => {
    expect(formatPrice(-12345)).toBe("-12 345")
    expect(formatPrice(0)).toBe("0")
  })

  it("returns string value for non-finite numbers", () => {
    expect(formatPrice(Number.NaN)).toBe("NaN")
    expect(formatPrice(Number.POSITIVE_INFINITY)).toBe("Infinity")
  })
})
