import type { SellerActivityPoint } from "@/app/api/database"
import type { SellerPointWithCoordinates } from "./types"

const UKRAINE_BOUNDS = {
  minLat: 44.2,
  maxLat: 52.3,
  minLon: 22.1,
  maxLon: 40.3
}

const hashString = (value: string): number => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

const buildCoordinates = (seller: string) => {
  const baseHash = hashString(seller)
  const latRatio = (baseHash % 10_000) / 10_000
  const lonRatio = (((baseHash * 17) >>> 0) % 10_000) / 10_000

  return {
    lat: Number(
      (UKRAINE_BOUNDS.minLat + latRatio * (UKRAINE_BOUNDS.maxLat - UKRAINE_BOUNDS.minLat)).toFixed(
        4
      )
    ),
    lon: Number(
      (UKRAINE_BOUNDS.minLon + lonRatio * (UKRAINE_BOUNDS.maxLon - UKRAINE_BOUNDS.minLon)).toFixed(
        4
      )
    )
  }
}

export const createMapSrc = ({ lat, lon }: { lat: number; lon: number }) => {
  const latOffset = 1.4
  const lonOffset = 2.2
  const minLat = (lat - latOffset).toFixed(4)
  const maxLat = (lat + latOffset).toFixed(4)
  const minLon = (lon - lonOffset).toFixed(4)
  const maxLon = (lon + lonOffset).toFixed(4)
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`
  const marker = `${lat.toFixed(4)},${lon.toFixed(4)}`

  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${encodeURIComponent(marker)}`
}

export const createMapLink = ({ lat, lon }: { lat: number; lon: number }) => {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(4)}&mlon=${lon.toFixed(4)}#map=7/${lat.toFixed(4)}/${lon.toFixed(4)}`
}

export const mapSellerPoints = (sellers: SellerActivityPoint[]): SellerPointWithCoordinates[] => {
  return sellers.map((seller) => ({ ...seller, ...buildCoordinates(seller.seller) }))
}
