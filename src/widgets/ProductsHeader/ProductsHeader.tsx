import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface ProductsHeaderProps {
  locale: Locale
  productsCount: number
}

const ProductsHeader = ({ locale, productsCount = 0 }: ProductsHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fw-semibold">
        {m.products_header_title({ count: productsCount }, { locale })}
      </h1>
    </div>
  )
}

export { ProductsHeader }
