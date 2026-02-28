import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { createMapLink, createMapSrc } from "./mapCoordinates"
import type { SellerPointWithCoordinates } from "./types"

interface MapPreviewProps {
  locale: Locale
  activePoint: SellerPointWithCoordinates
}

export const MapPreview = ({ locale, activePoint }: MapPreviewProps) => {
  return (
    <article className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-2">
        <div>
          <h1 className="h5 mb-1">{m.maps_sellers_title({}, { locale })}</h1>
          <p className="small text-body-secondary mb-0">{m.maps_subtitle({}, { locale })}</p>
        </div>

        <div className="ratio ratio-16x9 rounded-3 overflow-hidden border">
          <iframe
            title={m.maps_sellers_title({}, { locale })}
            src={createMapSrc(activePoint)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="small text-body-secondary">
          <a
            href={createMapLink(activePoint)}
            target="_blank"
            rel="noreferrer"
            className="link-secondary"
          >
            {m.maps_open_osm({}, { locale })}
          </a>
        </div>
      </div>
    </article>
  )
}
