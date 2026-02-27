import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface OrdersHeaderProps {
  locale: Locale
  ordersCount: number
}

const OrdersHeader = ({ locale, ordersCount = 0 }: OrdersHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fw-semibold">{m.orders_header_title({ count: ordersCount }, { locale })}</h1>
    </div>
  )
}

export { OrdersHeader }
