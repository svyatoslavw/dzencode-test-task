import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { OrderModel } from "@/entities/order/model/types"
import { OrderCard } from "@/entities/order/ui/OrderCard"

const createOrder = (overrides: Partial<OrderModel> = {}): OrderModel => ({
  id: 1,
  title: "Order #1",
  description: "Description",
  date: "2024-01-01 00:00:00",
  productsCount: 3,
  totalUSD: 200000,
  totalUAH: 5600000,
  ...overrides
})

describe("OrderCard", () => {
  it("renders formatted totals", () => {
    render(
      <table>
        <tbody>
          <OrderCard
            order={createOrder()}
            locale="en"
            isSelected={false}
            handleSelectOrder={vi.fn()}
            setOrderToDelete={vi.fn()}
          />
        </tbody>
      </table>
    )

    expect(screen.getByText("2 000.00 USD")).toBeInTheDocument()
    expect(screen.getByText("56 000.00 UAH")).toBeInTheDocument()
  })
})
