"use client"

import { useMemo, useState } from "react"

import { useRemoveProduct } from "@/features/product/RemoveProduct/useRemoveProduct"
import { useProducts, useProductTypes } from "@/shared/api/hooks/useProducts"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@/shared/ui/modal/modal"

export const ProductsTable = () => {
  const [type, setType] = useState<string>("")
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  const { data: types } = useProductTypes()
  const { data, isLoading, isError, error } = useProducts(type || undefined)
  const removeProduct = useRemoveProduct()

  const safeTypes = useMemo(() => types ?? [], [types])

  const closeModal = () => {
    if (!removeProduct.isPending) {
      setProductToDelete(null)
    }
  }

  const confirmDelete = () => {
    if (!productToDelete) {
      return
    }

    removeProduct.mutate(productToDelete, {
      onSuccess: () => setProductToDelete(null)
    })
  }

  return (
    <>
      <div className="row g-2 align-items-center mb-3">
        <div className="col-auto">
          <label htmlFor="type" className="col-form-label">
            Фильтр по типу
          </label>
        </div>
        <div className="col-12 col-sm-4">
          <select
            id="type"
            className="form-select"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">Все типы</option>
            {safeTypes.map((item) => (
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
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Название</th>
                <th scope="col">Тип</th>
                <th scope="col">Приход</th>
                <th scope="col">Цена</th>
                <th scope="col" className="text-end">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((product) => (
                <tr key={product.id}>
                  <td className="fw-semibold">{product.title}</td>
                  <td>{product.type}</td>
                  <td>{product.orderTitle}</td>
                  <td>
                    {product.price.map((price) => `${price.value} ${price.symbol}`).join(" / ")}
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setProductToDelete(product.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={productToDelete !== null} onClose={closeModal}>
        <ModalHeader>
          <ModalTitle>Удаление продукта</ModalTitle>
          <ModalCloseButton onClick={closeModal} disabled={removeProduct.isPending} />
        </ModalHeader>

        <ModalBody>
          <p className="mb-0">Вы действительно хотите удалить продукт?</p>
        </ModalBody>

        <ModalFooter>
          <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
            Отмена
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={confirmDelete}
            disabled={removeProduct.isPending}
          >
            {removeProduct.isPending ? "Удаление..." : "Удалить"}
          </button>
        </ModalFooter>
      </Modal>
    </>
  )
}
