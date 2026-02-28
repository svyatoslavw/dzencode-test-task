import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface OrderDetailsHeaderProps {
  locale: Locale
  title?: string
  description?: string
  onClose: () => void
}

export const OrderDetailsHeader = ({
  locale,
  title,
  description,
  onClose
}: OrderDetailsHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-start gap-2">
      <div>
        <h2 className="h6 mb-1 clamp">
          {title ?? m.orders_details_title_fallback({}, { locale })}
        </h2>
        <p className="mb-0 small text-body-secondary">
          {description ?? m.orders_details_description_fallback({}, { locale })}
        </p>
      </div>
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label={m.common_close({}, { locale })}
      />
    </div>
  )
}
