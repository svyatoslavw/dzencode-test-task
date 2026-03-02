import { describe, expect, it } from "vitest"

import { formatPrice } from "@/shared/lib/price"

describe("formatPrice", () => {
  it("formats cents with thousands and two decimal places", () => {
    expect(formatPrice(250000)).toBe("2 500.00")
    expect(formatPrice(20000000)).toBe("200 000.00")
  })

  it("handles cents precisely and rounds to nearest cent value", () => {
    expect(formatPrice(250050)).toBe("2 500.50")
    expect(formatPrice(1234567)).toBe("12 345.67")
    expect(formatPrice(1234567.4)).toBe("12 345.67")
    expect(formatPrice(1234567.6)).toBe("12 345.68")
  })

  it("handles negative numbers and zero", () => {
    expect(formatPrice(-12345)).toBe("-123.45")
    expect(formatPrice(0)).toBe("0.00")
  })

  it("returns string value for non-finite numbers", () => {
    expect(formatPrice(Number.NaN)).toBe("NaN")
    expect(formatPrice(Number.POSITIVE_INFINITY)).toBe("Infinity")
  })
})
