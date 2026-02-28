"use client"

import { m } from "@/shared/i18n/messages"
import { useMemo, useState } from "react"
import { mapSellerPoints } from "./mapCoordinates"
import { MapPreview } from "./MapPreview"
import { SellersList } from "./SellersList"
import type { MapsPanelProps } from "./types"

const MapsPanel = ({ locale, sellers }: MapsPanelProps) => {
  const points = useMemo(() => mapSellerPoints(sellers), [sellers])
  const [selectedSellerName, setSelectedSellerName] = useState<string | null>(
    () => sellers[0]?.seller ?? null
  )

  const activePoint =
    points.find((point) => point.seller === selectedSellerName) ?? points[0] ?? null

  if (!activePoint) {
    return <div className="alert alert-info mb-0">{m.maps_empty({}, { locale })}</div>
  }

  return (
    <section className="row g-3">
      <div className="col-12 col-xxl-8">
        <MapPreview locale={locale} activePoint={activePoint} />
      </div>

      <div className="col-12 col-xxl-4">
        <SellersList
          locale={locale}
          points={points}
          activeSellerName={activePoint.seller}
          onSelect={setSelectedSellerName}
        />
      </div>
    </section>
  )
}

export { MapsPanel }
