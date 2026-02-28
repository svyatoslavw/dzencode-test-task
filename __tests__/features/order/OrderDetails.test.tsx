import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { OrderDetails } from "@/features/order/OrderDetails/OrderDetails"
import { useOrderDetailsQuery, useProductsQuery } from "@/shared/api/hooks"

vi.mock("@/shared/api/hooks", () => ({
  useOrderDetailsQuery: vi.fn(),
  useProductsQuery: vi.fn()
}))

vi.mock("@/shared/api", () => ({
  useCreateProductMutation: vi.fn(() => ({
    isPending: false,
    mutate: vi.fn()
  })),
  getErrorMessage: vi.fn(() => "")
}))

const mockedUseOrderDetailsQuery = vi.mocked(useOrderDetailsQuery)
const mockedUseProductsQuery = vi.mocked(useProductsQuery)

describe("OrderDetails", () => {
  beforeEach(() => {
    mockedUseOrderDetailsQuery.mockReset()
    mockedUseProductsQuery.mockReset()
  })

  it("renders formatted totals and product prices", () => {
    mockedUseOrderDetailsQuery.mockReturnValue({
      data: {
        id: 1,
        title: "Order #1",
        description: "Description",
        date: "2024-01-01 00:00:00",
        productsCount: 1,
        totalUSD: 200000,
        totalUAH: 5600000,
        products: [
          {
            id: 1,
            serialNumber: 1001,
            isNew: true,
            inStock: true,
            quality: "new",
            seller: "Seller",
            photo: "https://picsum.photos/seed/test/400/300",
            title: "MacBook Pro",
            type: "Laptop",
            guarantee: {
              start: "2024-01-01 00:00:00",
              end: "2025-01-01 00:00:00"
            },
            order: 1,
            orderTitle: "Order #1",
            date: "2024-01-01 00:00:00",
            price: [
              { value: 2500, symbol: "USD", isDefault: true },
              { value: 120000, symbol: "UAH", isDefault: false }
            ]
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null
    } as never)
    mockedUseProductsQuery.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 1,
                serialNumber: 1001,
                isNew: true,
                inStock: true,
                quality: "new",
                seller: "Seller",
                photo: "https://picsum.photos/seed/test/400/300",
                title: "MacBook Pro",
                type: "Laptop",
                guarantee: {
                  start: "2024-01-01 00:00:00",
                  end: "2025-01-01 00:00:00"
                },
                order: 1,
                orderTitle: "Order #1",
                date: "2024-01-01 00:00:00",
                price: [
                  { value: 2500, symbol: "USD", isDefault: true },
                  { value: 120000, symbol: "UAH", isDefault: false }
                ]
              }
            ],
            pagination: {
              page: 1,
              limit: 20,
              total: 1,
              hasMore: false,
              nextPage: null
            }
          }
        ]
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false
    } as never)

    render(<OrderDetails locale={"en" as never} selectedOrderId={1} onClose={vi.fn()} />)

    expect(screen.getByText("200 000 USD / 5 600 000 UAH")).toBeInTheDocument()
    expect(screen.getByText("2 500 USD / 120 000 UAH")).toBeInTheDocument()
  })

  it("returns null when no order is selected", () => {
    mockedUseOrderDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null
    } as never)
    mockedUseProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false
    } as never)

    const { container } = render(
      <OrderDetails locale={"en" as never} selectedOrderId={null} onClose={vi.fn()} />
    )

    expect(container.firstChild).toBeNull()
  })
})
