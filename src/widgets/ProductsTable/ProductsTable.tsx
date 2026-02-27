"use client"

import { useState } from "react"

import { ProductList, useProductList } from "@/features/product/ProductList"
import { RemoveProductModal } from "@/features/product/RemoveProduct"
import type { ProductsListResponse } from "@/shared/api/contracts"

interface ProductsTableProps {
  initialType?: string
  initialPage: ProductsListResponse
}

export const ProductsTable = ({ initialType = "", initialPage }: ProductsTableProps) => {
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null)
  const { state, handlers } = useProductList({ initialType, initialPage })
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
    <>
      <div className="row g-2 align-items-center mb-3">
        <div className="col-auto">
          <label htmlFor="type" className="col-form-label">
            Фильтр по типу
          </label>
        </div>
        <div className="col-12 col-sm-2">
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(event) => handleTypeChange(event.target.value)}
          >
            <option value="">Все типы</option>
            {productTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="alert alert-info mb-0">Загрузка продуктов...</div>}
      {isError && <div className="alert alert-danger mb-0">Ошибка: {(error as Error).message}</div>}

      {!isLoading && !isError && (
        <section className="row g-3">
          <ProductList products={products} setProductIdToDelete={setProductIdToDelete} />
        </section>
      )}

      {!isError && hasNextPage && (
        <div ref={containerRef} className="d-flex justify-content-center mt-3">
          {isFetchingNextPage && <p className="text-body-secondary">Загрузка...</p>}
        </div>
      )}

      <RemoveProductModal
        productIdToDelete={productIdToDelete}
        onClose={closeModal}
        onSuccess={closeModal}
      />
    </>
  )
}
