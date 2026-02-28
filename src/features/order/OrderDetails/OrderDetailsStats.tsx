import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { formatPrice } from "@/shared/lib"

interface OrderDetailsStatsProps {
  locale: Locale
  productsCount: number
  totalUSD: number
  totalUAH: number
}

export const OrderDetailsStats = ({
  locale,
  productsCount,
  totalUSD,
  totalUAH
}: OrderDetailsStatsProps) => {
  return (
    <div className="row g-2">
      <div className="col-12 col-md-6">
        <div className="border rounded-3 p-2 h-100 small">
          <div className="small text-body-secondary">
            {m.orders_details_products({}, { locale })}
          </div>
          <div className="fw-semibold">{productsCount}</div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="border rounded-3 p-2 h-100 small">
          <div className="small text-body-secondary">{m.orders_details_total({}, { locale })}</div>
          <div className="fw-semibold">
            {formatPrice(totalUSD)} USD / {formatPrice(totalUAH)} UAH
          </div>
        </div>
      </div>
    </div>
  )
}
