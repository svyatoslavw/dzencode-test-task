"use client"

import { useState } from "react"

import type { ProductModel } from "@/entities/product/model/types"
import { useRemoveOrder } from "@/features/order/RemoveOrder/useRemoveOrder"
import { useOrderDetails, useOrders } from "@/shared/api/hooks/useOrders"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@/shared/ui/modal/modal"

const parseDate = (value: string): Date | null => {
  const normalized = value.includes("T") ? value : value.replace(" ", "T")
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

const formatDateByParts = (value: string, options: Intl.DateTimeFormatOptions): string => {
  const date = parseDate(value)

  if (!date) {
    return value
  }

  return new Intl.DateTimeFormat("en-GB", options)
    .formatToParts(date)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join(" / ")
}

const formatShortDate = (value: string): string => {
  return formatDateByParts(value, {
    day: "2-digit",
    month: "2-digit"
  })
}

const formatFullDate = (value: string): string => {
  return formatDateByParts(value, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}

const formatProductPrices = (product: ProductModel): string => {
  return product.price.map((item) => `${item.value} ${item.symbol}`).join(" / ")
}

export const OrdersTable = () => {
  const { data, isLoading, isError, error } = useOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null)
  const safeSelectedOrderId =
    selectedOrderId !== null && data?.some((order) => order.id === selectedOrderId)
      ? selectedOrderId
      : null
  const removeOrder = useRemoveOrder()
  const {
    data: selectedOrder,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    error: detailsError
  } = useOrderDetails(safeSelectedOrderId)

  const closeModal = () => {
    if (!removeOrder.isPending) {
      setOrderToDelete(null)
    }
  }

  const confirmDelete = () => {
    if (!orderToDelete) {
      return
    }

    const deletingOrderId = orderToDelete

    removeOrder.mutate(deletingOrderId, {
      onSuccess: () => {
        if (selectedOrderId === deletingOrderId) {
          setSelectedOrderId(null)
        }

        setOrderToDelete(null)
      }
    })
  }

  if (isLoading) {
    return <div className="alert alert-info mb-0">Загрузка приходов...</div>
  }

  if (isError) {
    return <div className="alert alert-danger mb-0">Ошибка: {(error as Error).message}</div>
  }

  return (
    <>
      <div className="row g-3">
        <div className={selectedOrderId ? "col-12 col-xxl-6" : "col-12"}>
          <div className="table-responsive border rounded-3 bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Приход</th>
                  <th scope="col">Продуктов</th>
                  <th scope="col">Дата</th>
                  <th scope="col">Сумма</th>
                  <th scope="col" className="text-end">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((order) => {
                  const isSelected = safeSelectedOrderId === order.id

                  return (
                    <tr
                      key={order.id}
                      className={isSelected ? "table-active" : undefined}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="fw-semibold text-decoration-underline">{order.title}</td>
                      <td>{order.productsCount}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small text-body-secondary">
                            {formatShortDate(order.date)}
                          </span>
                          <span>{formatFullDate(order.date)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small text-body-secondary">{order.totalUSD} USD</span>
                          <span>{order.totalUAH} UAH</span>
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={(event) => {
                            event.stopPropagation()
                            setOrderToDelete(order.id)
                          }}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrderId !== null && (
          <div className="col-12 col-xxl-6">
            <section className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column gap-2 p-3">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <h2 className="h6 mb-1">{selectedOrder?.title ?? "Детали прихода"}</h2>
                    <p className="mb-0 small text-body-secondary">
                      {selectedOrder?.description ?? "Информация о выбранном приходе"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedOrderId(null)}
                    aria-label="Закрыть"
                  />
                </div>

                {isDetailsLoading && (
                  <div className="alert alert-info mb-0">Загрузка информации о приходе...</div>
                )}

                {isDetailsError && (
                  <div className="alert alert-danger mb-0">
                    Ошибка: {(detailsError as Error).message}
                  </div>
                )}

                {!isDetailsLoading && !isDetailsError && selectedOrder && (
                  <>
                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-2 h-100 small">
                          <div className="small text-body-secondary">Продуктов</div>
                          <div className="fw-semibold">{selectedOrder.productsCount}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-2 h-100 small">
                          <div className="small text-body-secondary">Сумма прихода</div>
                          <div className="fw-semibold">
                            {selectedOrder.totalUSD} USD / {selectedOrder.totalUAH} UAH
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="table-responsive border rounded-3"
                      style={{ maxHeight: "360px" }}
                    >
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
                          {selectedOrder.products.map((product) => (
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
        )}
      </div>

      <Modal isOpen={orderToDelete !== null} onClose={closeModal}>
        <ModalHeader>
          <ModalTitle>Удаление прихода</ModalTitle>
          <ModalCloseButton onClick={closeModal} disabled={removeOrder.isPending} />
        </ModalHeader>

        <ModalBody>
          <p className="mb-0">Вы действительно хотите удалить приход?</p>
        </ModalBody>

        <ModalFooter>
          <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
            Отмена
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={confirmDelete}
            disabled={removeOrder.isPending}
          >
            {removeOrder.isPending ? "Удаление..." : "Удалить"}
          </button>
        </ModalFooter>
      </Modal>
    </>
  )
}
