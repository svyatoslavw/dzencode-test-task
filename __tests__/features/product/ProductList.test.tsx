import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { ProductModel } from "@/entities/product/model/types"
import { ProductList } from "@/features/product/Products"
import { m } from "@/shared/i18n/messages"

const { cardSpy } = vi.hoisted(() => ({
  cardSpy: vi.fn()
}))

vi.mock("@/entities/product", () => ({
  ProductCard: (props: { product: ProductModel }) => {
    cardSpy(props)

    return (
      <tr data-testid={`product-card-${props.product.id}`}>
        <td>{props.product.title}</td>
      </tr>
    )
  }
}))

const createProduct = (id: number): ProductModel => ({
  id,
  serialNumber: 1000 + id,
  isNew: true,
  inStock: true,
  quality: "new",
  seller: "Seller",
  photo: "https://picsum.photos/seed/test/400/300",
  title: `Product ${id}`,
  type: "Laptop",
  guarantee: {
    start: "2024-01-01 00:00:00",
    end: "2025-01-01 00:00:00"
  },
  order: 1,
  orderTitle: "Order #1",
  date: "2024-01-01 00:00:00",
  price: [{ value: 1000, symbol: "USD", isDefault: true }]
})

describe("ProductList", () => {
  it("renders empty state when products list is empty", () => {
    render(
      <ProductList
        locale={"en" as never}
        products={[]}
        hasNextPage={false}
        isFetchingNextPage={false}
        containerRef={{ current: null }}
        setProductIdToDelete={vi.fn()}
      />
    )

    expect(screen.getByText(m.products_empty({}, { locale: "en" as never }))).toBeInTheDocument()
    expect(screen.queryByTestId(/product-card-/)).not.toBeInTheDocument()
  })

  it("renders product cards and load more loader", () => {
    cardSpy.mockClear()

    render(
      <ProductList
        locale={"en" as never}
        products={[createProduct(1), createProduct(2)]}
        hasNextPage={true}
        isFetchingNextPage={true}
        containerRef={{ current: null }}
        setProductIdToDelete={vi.fn()}
      />
    )

    expect(screen.getByTestId("product-card-1")).toBeInTheDocument()
    expect(screen.getByTestId("product-card-2")).toBeInTheDocument()
    expect(cardSpy).toHaveBeenCalledTimes(2)
    expect(
      screen.getByText(m.products_load_more_loading({}, { locale: "en" as never }))
    ).toBeInTheDocument()
  })
})
