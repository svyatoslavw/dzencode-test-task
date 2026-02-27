import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { ProductModel } from "@/entities/product"
import { ProductCard } from "@/entities/product"

vi.mock("next/image", () => ({
  default: (props: React.ComponentProps<"img">) => <img {...props} />
}))

const createProduct = (overrides: Partial<ProductModel> = {}): ProductModel => ({
  id: 1,
  serialNumber: 1001,
  isNew: true,
  inStock: true,
  quality: "new",
  seller: "Seller",
  photo: "https://picsum.photos/seed/test/400/300",
  title: "MacBook Pro",
  type: "Laptop",
  specification: "Spec",
  guarantee: {
    start: "2024-01-01 00:00:00",
    end: "2025-01-01 00:00:00"
  },
  order: 1,
  orderTitle: "Order #1",
  date: "2024-02-01 00:00:00",
  price: [
    { value: 2500, symbol: "USD", isDefault: true },
    { value: 120000, symbol: "UAH", isDefault: false }
  ],
  ...overrides
})

describe("ProductCard", () => {
  it("renders formatted prices", () => {
    render(
      <table>
        <tbody>
          <ProductCard
            product={createProduct()}
            locale={"en" as never}
            setProductIdToDelete={vi.fn()}
          />
        </tbody>
      </table>
    )

    expect(screen.getByText("2 500 USD")).toBeInTheDocument()
    expect(screen.getByText("120 000 UAH")).toBeInTheDocument()
  })

  it("shows fallback when currency price is missing", () => {
    render(
      <table>
        <tbody>
          <ProductCard
            product={createProduct({ price: [{ value: 2500, symbol: "USD", isDefault: true }] })}
            locale="en"
            setProductIdToDelete={vi.fn()}
          />
        </tbody>
      </table>
    )

    expect(screen.getByText("2 500 USD")).toBeInTheDocument()
    expect(screen.getByText("— UAH")).toBeInTheDocument()
  })
})
