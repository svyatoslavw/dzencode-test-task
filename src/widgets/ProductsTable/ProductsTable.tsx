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

import styles from "./ProductsTable.module.css"

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

  const qualityLabel = (quality: "new" | "used") => (quality === "new" ? "Новый" : "БУ")

  const formatDate = (value: string) => {
    const date = new Date(value.includes("T") ? value : value.replace(" ", "T"))

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return new Intl.DateTimeFormat("ru-RU").format(date)
  }

  const getPriceBySymbol = (
    prices: { value: number; symbol: "USD" | "UAH" }[],
    symbol: "USD" | "UAH"
  ) => prices.find((price) => price.symbol === symbol)?.value

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
        <div className={`overflow-auto table-responsive ${styles.tableWrap}`}>
          <table className={`table table-hover align-middle mb-0 `}>
            <thead className="table-light">
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Остаток</th>
                <th>Гарантия</th>
                <th>Состояние</th>
                <th>Продавец</th>
                <th>Приход</th>
                <th className="text-end">Цена</th>
                <th className="text-end">Дата</th>
                <th className="text-end">Действия</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={`${styles.clamp} fw-semibold`}>{product.title}</div>
                  </td>
                  <td>
                    <div className={styles.clamp}>{product.type}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${product.inStock ? "text-bg-success" : "text-bg-secondary"}`}
                    >
                      {product.inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column text-nowrap">
                      <span className="small text-body-secondary">
                        {formatDate(product.guarantee.start)}
                      </span>
                      <span>{formatDate(product.guarantee.end)}</span>
                    </div>
                  </td>
                  <td>{qualityLabel(product.quality)}</td>
                  <td>
                    <div className={styles.clamp}>{product.seller}</div>
                  </td>
                  <td>
                    <div className={styles.clamp}>{product.orderTitle}</div>
                  </td>
                  <td className="text-end fw-semibold">
                    <div className="d-flex flex-column text-nowrap">
                      <span className="small text-body-secondary">
                        {getPriceBySymbol(product.price, "USD") ?? "—"} USD
                      </span>
                      <span>{getPriceBySymbol(product.price, "UAH") ?? "—"} UAH</span>
                    </div>
                  </td>
                  <td className="text-end text-nowrap">{formatDate(product.date)}</td>
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
