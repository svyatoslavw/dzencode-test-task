import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { OrderModel } from "@/entities/order/model/types"
import type { OrdersListResponse } from "@/shared/api/contracts"
import { useOrderList } from "@/features/order/OrderList/useOrderList"

const useOrdersQueryMock = vi.fn()

vi.mock("@/shared/api", () => ({
  useOrdersQuery: (...args: unknown[]) => useOrdersQueryMock(...args)
}))

const createOrder = (id: number): OrderModel => ({
  id,
  title: `Order #${id}`,
  description: "Description",
  date: "2024-01-01 00:00:00",
  productsCount: 1,
  totalUSD: 1000,
  totalUAH: 40000
})

const initialPage: OrdersListResponse = {
  data: [createOrder(1)],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    hasMore: false,
    nextPage: null
  }
}

describe("useOrderList", () => {
  let orders: OrderModel[]

  beforeEach(() => {
    orders = [createOrder(1), createOrder(2)]
    useOrdersQueryMock.mockReset()
    useOrdersQueryMock.mockImplementation(() => ({
      data: {
        pages: [{ data: orders }]
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false
    }))
  })

  it("resets selected order id when selected order is no longer present", () => {
    const { result, rerender } = renderHook(() => useOrderList({ initialPage }))

    act(() => {
      result.current.handlers.setSelectedOrderId(1)
    })

    expect(result.current.state.selectedOrderId).toBe(1)

    orders = [createOrder(2)]
    rerender()

    expect(result.current.state.selectedOrderId).toBeNull()
  })
})
