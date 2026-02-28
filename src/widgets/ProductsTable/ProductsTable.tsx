"use client"

import { useState } from "react"

import { ProductList, RemoveProductModal, useProducts } from "@/features/product"
import type { ProductsListResponse } from "@/shared/api/contracts"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface ProductsTableProps {
  locale: Locale
  initialType?: string
  initialPage: ProductsListResponse
}

export const ProductsTable = ({ locale, initialType = "", initialPage }: ProductsTableProps) => {
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null)
  const { state, handlers } = useProducts({ initialType, initialPage })
  const {
    containerRef,
    products,
    productTypes,
    type,
    error,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage
  } = state
  const { handleTypeChange } = handlers

  const closeModal = () => setProductIdToDelete(null)

  return (
    <div className="h-100 d-flex flex-column" style={{ minHeight: 0 }}>
      <div className="row g-2 align-items-center mb-3">
        <div className="col-auto">
          <label htmlFor="type" className="col-form-label">
            {m.products_filter_label({}, { locale })}
          </label>
        </div>
        <div className="col-12 col-sm-2">
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(event) => handleTypeChange(event.target.value)}
          >
            <option value="">{m.products_filter_all_types({}, { locale })}</option>
            {productTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="alert alert-info mb-0">{m.products_loading({}, { locale })}</div>
      )}
      {isError && (
        <div className="alert alert-danger mb-0">
          {m.common_error_with_message({ message: (error as Error).message }, { locale })}
        </div>
      )}

      {!isLoading && !isError && (
        <section className="row g-3 flex-grow-1" style={{ minHeight: 0 }}>
          <ProductList
            locale={locale}
            products={products}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            containerRef={containerRef}
            setProductIdToDelete={setProductIdToDelete}
          />
        </section>
      )}

      <RemoveProductModal
        locale={locale}
        productIdToDelete={productIdToDelete}
        onClose={closeModal}
        onSuccess={closeModal}
      />
    </div>
  )
}
