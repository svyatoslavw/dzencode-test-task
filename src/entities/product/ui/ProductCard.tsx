import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { formatFullDate, formatPrice } from "@/shared/lib"
import Image from "next/image"
import type { ProductModel } from "../model"

interface ProductCardProps {
  product: ProductModel
  locale: Locale
  setProductIdToDelete: (productId: number | null) => void
}

const getPriceBySymbol = (
  prices: { value: number; symbol: "USD" | "UAH" }[],
  symbol: "USD" | "UAH"
) => prices.find((price) => price.symbol === symbol)?.value

const getOptimizedProductImage = (photo: string): string => {
  try {
    const parsed = new URL(photo)

    if (parsed.hostname !== "picsum.photos") {
      return photo
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean)

    if (pathParts.length >= 4 && pathParts[0] === "seed") {
      const seed = pathParts[1]
      return `https://picsum.photos/seed/${seed}/120/120`
    }
  } catch {
    return photo
  }

  return photo
}

export const ProductCard = ({ product, locale, setProductIdToDelete }: ProductCardProps) => {
  const optimizedPhoto = getOptimizedProductImage(product.photo)
  const usdPrice = getPriceBySymbol(product.price, "USD")
  const uahPrice = getPriceBySymbol(product.price, "UAH")

  return (
    <tr key={product.id}>
      <td className="products-col-name">
        <div className="d-flex align-items-center gap-2">
          <Image
            src={optimizedPhoto}
            alt={product.title}
            width={42}
            height={42}
            sizes="(min-width: 768px) 42px, 42px"
            quality={100}
            className="rounded border object-fit-cover flex-shrink-0"
          />
          <div className="fw-semibold clamp-2">{product.title}</div>
        </div>
      </td>
      <td className="products-col-stock">
        <span className={`badge ${product.inStock ? "text-bg-success" : "text-bg-secondary"}`}>
          {product.inStock
            ? m.products_stock_in({}, { locale })
            : m.products_stock_out({}, { locale })}
        </span>
      </td>
      <td>
        <div className="d-flex flex-column text-nowrap">
          <span className="small text-body-secondary">
            {formatFullDate(product.guarantee.start, locale)}
          </span>
          <span>{formatFullDate(product.guarantee.end, locale)}</span>
        </div>
      </td>
      <td className="products-col-condition">
        {product.quality === "new"
          ? m.products_quality_new({}, { locale })
          : m.products_quality_used({}, { locale })}
      </td>
      <td className="products-col-seller">
        <div className="clamp-2">{product.seller}</div>
      </td>
      <td>
        <div className="clamp-2">{product.orderTitle}</div>
      </td>
      <td className="text-end fw-semibold">
        <div className="d-flex flex-column text-nowrap">
          <span className="small text-body-secondary">
            {usdPrice === undefined ? "—" : formatPrice(usdPrice)} USD
          </span>
          <span className="small text-body-secondary">
            {uahPrice === undefined ? "—" : formatPrice(uahPrice)} UAH
          </span>
        </div>
      </td>
      <td className="text-end text-nowrap products-col-date">
        {formatFullDate(product.date, locale)}
      </td>
      <td className="text-end products-col-actions">
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => setProductIdToDelete(product.id)}
        >
          {m.common_delete({}, { locale })}
        </button>
      </td>
    </tr>
  )
}
