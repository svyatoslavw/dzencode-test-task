import type { ProductModel } from "@/entities/product"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { formatPrice, formatShortDate } from "@/shared/lib"
import type { RefObject } from "react"

interface OrderDetailsProductsTableProps {
  locale: Locale
  products: ProductModel[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  containerRef: RefObject<HTMLDivElement | null>
}

const formatProductPrices = (product: ProductModel): string => {
  return product.price.map((item) => `${formatPrice(item.value)} ${item.symbol}`).join(" / ")
}

export const OrderDetailsProductsTable = ({
  locale,
  products,
  hasNextPage,
  isFetchingNextPage,
  containerRef
}: OrderDetailsProductsTableProps) => {
  return (
    <div className="table-responsive border rounded-3">
      <table className="table table-sm align-middle mb-0 small">
        <thead className="table-light">
          <tr>
            <th scope="col">{m.orders_details_column_product({}, { locale })}</th>
            <th scope="col">{m.orders_details_column_serial({}, { locale })}</th>
            <th scope="col">{m.orders_details_column_guarantee({}, { locale })}</th>
            <th scope="col">{m.orders_details_column_prices({}, { locale })}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="fw-semibold">{product.title}</div>
                <div className="small text-body-secondary">{product.type}</div>
              </td>
              <td>{product.serialNumber}</td>
              <td>
                {formatShortDate(product.guarantee.start, locale)} -{" "}
                {formatShortDate(product.guarantee.end, locale)}
              </td>
              <td>{formatProductPrices(product)}</td>
            </tr>
          ))}

          {hasNextPage && (
            <tr>
              <td colSpan={4}>
                <div ref={containerRef} className="d-flex justify-content-center py-2">
                  {isFetchingNextPage && (
                    <p className="text-body-secondary mb-0">
                      {m.products_load_more_loading({}, { locale })}
                    </p>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
