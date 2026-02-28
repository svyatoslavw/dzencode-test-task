import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { OrderModel } from "@/entities/order/model/types"
import { OrderList } from "@/features/order/Orders"
import { m } from "@/shared/i18n/messages"

const { cardSpy } = vi.hoisted(() => ({ cardSpy: vi.fn() }))

vi.mock("@/entities/order", () => ({
  OrderCard: (props: { order: OrderModel; isSelected: boolean }) => {
    cardSpy(props)

    return (
      <tr data-testid={`order-card-${props.order.id}`} data-selected={String(props.isSelected)}>
        <td>{props.order.title}</td>
      </tr>
    )
  }
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

describe("OrderList", () => {
  it("renders empty state when orders list is empty", () => {
    render(
      <OrderList
        locale="en"
        orders={[]}
        selectedOrderId={null}
        hasNextPage={false}
        isFetchingNextPage={false}
        containerRef={{ current: null }}
        onSelectOrder={vi.fn()}
        setOrderToDelete={vi.fn()}
      />
    )

    expect(screen.getByText(m.orders_empty({}, { locale: "en" as never }))).toBeInTheDocument()
    expect(screen.queryByTestId(/order-card-/)).not.toBeInTheDocument()
  })

  it("renders order cards and passes selected state", () => {
    cardSpy.mockClear()

    render(
      <OrderList
        locale="en"
        orders={[createOrder(1), createOrder(2)]}
        selectedOrderId={2}
        hasNextPage
        isFetchingNextPage
        containerRef={{ current: null }}
        onSelectOrder={vi.fn()}
        setOrderToDelete={vi.fn()}
      />
    )

    expect(screen.getByTestId("order-card-1")).toHaveAttribute("data-selected", "false")
    expect(screen.getByTestId("order-card-2")).toHaveAttribute("data-selected", "true")
    expect(cardSpy).toHaveBeenCalledTimes(2)
    expect(screen.getByText(m.orders_load_more_loading({}, { locale: "en" }))).toBeInTheDocument()
  })
})
