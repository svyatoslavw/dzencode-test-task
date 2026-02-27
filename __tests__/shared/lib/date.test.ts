import { describe, expect, it } from "vitest"

import { formatDateByParts, formatFullDate, formatShortDate } from "@/shared/lib/date"

describe("date helpers", () => {
  it("formats short date for locales", () => {
    expect(formatShortDate("2024-01-15 10:00:00", "en")).toBe("15/01")
    expect(formatShortDate("2024-01-15 10:00:00", "ru")).toBe("15/01")
  })

  it("formats full date (day/m/year) ", () => {
    const enFormat = formatFullDate("2024-01-15 10:00:00", "en")
    const ruFormat = formatFullDate("2024-01-15 10:00:00", "ru")

    expect(enFormat).toBe("15/Jan/2024")
    expect(ruFormat).toBe("15/янв./2024")
  })

  it("returns raw value for invalid input", () => {
    expect(formatShortDate("not-a-date", "en")).toBe("not-a-date")
    expect(formatFullDate("invalid", "ru")).toBe("invalid")
  })

  it("supports direct formatDateByParts usage", () => {
    expect(
      formatDateByParts(
        "2024-05-20 09:30:00",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        },
        "en"
      )
    ).toBe("20/05/2024")
  })
})
