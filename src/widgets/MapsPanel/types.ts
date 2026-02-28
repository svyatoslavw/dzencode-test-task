import type { SellerActivityPoint } from "@/app/api/database"
import type { Locale } from "@/shared/i18n/runtime"

export interface MapsPanelProps {
  locale: Locale
  sellers: SellerActivityPoint[]
}

export interface SellerPointWithCoordinates extends SellerActivityPoint {
  lat: number
  lon: number
}
