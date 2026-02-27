import { formatFullDate, formatPrice, formatShortDate } from "@/shared/lib"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { memo } from "react"
import type { OrderModel } from "../model"

interface OrderCardProps {
  order: OrderModel
  locale: Locale
  isSelected: boolean
  handleSelectOrder: (orderId: number) => void
  setOrderToDelete: (orderId: number | null) => void
}

export const OrderCard = memo(
  ({ order, locale, isSelected, handleSelectOrder, setOrderToDelete }: OrderCardProps) => {
    return (
      <tr
        key={order.id}
        className={isSelected ? "table-active" : undefined}
        style={{ cursor: "pointer" }}
        onClick={() => handleSelectOrder(order.id)}
      >
        <td>
          <div className="fw-semibold text-decoration-underline clamp">{order.title}</div>
        </td>
        <td>{order.productsCount}</td>
        <td>
          <div className="d-flex flex-column">
            <span className="small text-body-secondary">{formatShortDate(order.date, locale)}</span>
            <span>{formatFullDate(order.date, locale)}</span>
          </div>
        </td>
        <td>
          <div className="d-flex flex-column text-nowrap">
            <span className="small text-body-secondary">{formatPrice(order.totalUSD)} USD</span>
            <span>{formatPrice(order.totalUAH)} UAH</span>
          </div>
        </td>
        <td className="text-end">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={(event) => {
              event.stopPropagation()
              setOrderToDelete(order.id)
            }}
          >
            {m.common_delete({}, { locale })}
          </button>
        </td>
      </tr>
    )
  }
)

OrderCard.displayName = "OrderCard"
