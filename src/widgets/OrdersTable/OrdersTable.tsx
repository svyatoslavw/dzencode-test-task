"use client"

import { useState } from "react"

import { OrderDetails } from "@/features/order/OrderDetails"
import { OrderList, useOrderList } from "@/features/order/OrderList"
import { RemoveOrderModal } from "@/features/order/RemoveOrder"
import type { OrdersListResponse } from "@/shared/api/contracts"

interface OrdersTableProps {
  initialPage: OrdersListResponse
}

export const OrdersTable = ({ initialPage }: OrdersTableProps) => {
  const { state, handlers } = useOrderList({ initialPage })
  const {
    containerRef,
    orders,
    error,
    selectedOrderId,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage
  } = state
  const { setSelectedOrderId } = handlers
  const [orderIdToDelete, setOrderIdToDelete] = useState<number | null>(null)

  const closeModal = () => setOrderIdToDelete(null)

  const handleSuccessDelete = () => {
    if (selectedOrderId === orderIdToDelete) {
      setSelectedOrderId(null)
    }

    setOrderIdToDelete(null)
  }

  if (isLoading) {
    return <div className="alert alert-info mb-0">Загрузка приходов...</div>
  }

  if (isError) {
    return <div className="alert alert-danger mb-0">Ошибка: {(error as Error).message}</div>
  }

  return (
    <>
      <section className="row g-3">
        <OrderList
          orders={orders}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          setOrderToDelete={setOrderIdToDelete}
        />
        <OrderDetails selectedOrderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      </section>

      {!isError && hasNextPage && (
        <div ref={containerRef} className="d-flex justify-content-center mt-3">
          {isFetchingNextPage && <p className="text-body-secondary">Загрузка...</p>}
        </div>
      )}

      <RemoveOrderModal
        orderIdToDelete={orderIdToDelete}
        onClose={closeModal}
        onSuccess={handleSuccessDelete}
      />
    </>
  )
}
