import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import type { SellerPointWithCoordinates } from "./types"

interface SellersListProps {
  locale: Locale
  points: SellerPointWithCoordinates[]
  activeSellerName: string
  onSelect: (sellerName: string) => void
}

export const SellersList = ({ locale, points, activeSellerName, onSelect }: SellersListProps) => {
  return (
    <article className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-2">
        <h2 className="h6 mb-1">{m.maps_list_title({}, { locale })}</h2>
        <div className="list-group list-group-flush">
          {points.map((point) => {
            const isActive = point.seller === activeSellerName

            return (
              <button
                key={point.seller}
                type="button"
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  isActive ? "active" : ""
                }`}
                onClick={() => onSelect(point.seller)}
              >
                <span className="clamp">{point.seller}</span>
                <span
                  className={`badge rounded-pill ${isActive ? "text-bg-light" : "text-bg-secondary"}`}
                >
                  {point.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}
