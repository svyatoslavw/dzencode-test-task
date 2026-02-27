"use client"

import type { ProductModel } from "@/entities/product/model/types"
import { useOrderDetailsQuery } from "@/shared/api/hooks"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { formatPrice, formatShortDate } from "@/shared/lib"

interface OrderDetailsProps {
  locale: Locale
  selectedOrderId: number | null
  onClose: () => void
}

const formatProductPrices = (product: ProductModel): string => {
  return product.price.map((item) => `${formatPrice(item.value)} ${item.symbol}`).join(" / ")
}

export const OrderDetails = ({ locale, selectedOrderId, onClose }: OrderDetailsProps) => {
  const { data, isLoading, isError, error } = useOrderDetailsQuery(selectedOrderId)

  if (!selectedOrderId) return null

  return (
    <div className="col-12 col-xxl-6">
      <section className="card border-0 shadow-sm max-h-75">
        <div className="card-body d-flex flex-column gap-2 p-3">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h2 className="h6 mb-1 clamp">
                {data?.title ?? m.orders_details_title_fallback({}, { locale })}
              </h2>
              <p className="mb-0 small text-body-secondary">
                {data?.description ?? m.orders_details_description_fallback({}, { locale })}
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label={m.common_close({}, { locale })}
            />
          </div>

          {isLoading && (
            <div className="alert alert-info mb-0">{m.orders_details_loading({}, { locale })}</div>
          )}

          {isError && (
            <div className="alert alert-danger mb-0">
              {m.common_error_with_message({ message: (error as Error).message }, { locale })}
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-2 h-100 small">
                    <div className="small text-body-secondary">
                      {m.orders_details_products({}, { locale })}
                    </div>
                    <div className="fw-semibold">{data.productsCount}</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-2 h-100 small">
                    <div className="small text-body-secondary">
                      {m.orders_details_total({}, { locale })}
                    </div>
                    <div className="fw-semibold">
                      {formatPrice(data.totalUSD)} USD / {formatPrice(data.totalUAH)} UAH
                    </div>
                  </div>
                </div>
              </div>

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
                    {data.products.map((product) => (
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
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
