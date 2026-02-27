"use client"

import type { ProductModel } from "@/entities/product/model/types"
import { useOrderDetailsQuery } from "@/shared/api/hooks"
import { formatShortDate } from "@/shared/lib"

interface OrderDetailsProps {
  selectedOrderId: number | null
  onClose: () => void
}

const formatProductPrices = (product: ProductModel): string => {
  return product.price.map((item) => `${item.value.toFixed(2)} ${item.symbol}`).join(" / ")
}

export const OrderDetails = ({ selectedOrderId, onClose }: OrderDetailsProps) => {
  const { data, isLoading, isError, error } = useOrderDetailsQuery(selectedOrderId)

  if (!selectedOrderId) return null

  return (
    <div className="col-12 position-relative col-xxl-6">
      <section className="card position-fixed border-0 shadow-sm max-h-75">
        <div className="card-body d-flex flex-column gap-2 p-3">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h2 className="h6 mb-1">{data?.title ?? "Детали прихода"}</h2>
              <p className="mb-0 small text-body-secondary">
                {data?.description ?? "Информация о выбранном приходе"}
              </p>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Закрыть" />
          </div>

          {isLoading && (
            <div className="alert alert-info mb-0">Загрузка информации о приходе...</div>
          )}

          {isError && (
            <div className="alert alert-danger mb-0">Ошибка: {(error as Error).message}</div>
          )}

          {!isLoading && !isError && data && (
            <>
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-2 h-100 small">
                    <div className="small text-body-secondary">Продуктов</div>
                    <div className="fw-semibold">{data.productsCount}</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-2 h-100 small">
                    <div className="small text-body-secondary">Сумма прихода</div>
                    <div className="fw-semibold">
                      {data.totalUSD} USD / {data.totalUAH} UAH
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive border rounded-3">
                <table className="table table-sm align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Продукт</th>
                      <th scope="col">Серийный номер</th>
                      <th scope="col">Гарантия</th>
                      <th scope="col">Цены</th>
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
                          {formatShortDate(product.guarantee.start)} -{" "}
                          {formatShortDate(product.guarantee.end)}
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
