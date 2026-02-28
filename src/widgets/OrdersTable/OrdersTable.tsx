"use client"

import { useState } from "react"

import { OrderDetails, OrderList, RemoveOrderModal, useOrders } from "@/features/order"
import type { OrdersListResponse } from "@/shared/api/contracts"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface OrdersTableProps {
  locale: Locale
  initialPage: OrdersListResponse
}

export const OrdersTable = ({ locale, initialPage }: OrdersTableProps) => {
  const { state, handlers } = useOrders({ initialPage })
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
    return <div className="alert alert-info mb-0">{m.orders_loading({}, { locale })}</div>
  }

  if (isError) {
    return (
      <div className="alert alert-danger mb-0">
        {m.common_error_with_message({ message: (error as Error).message }, { locale })}
      </div>
    )
  }

  return (
    <div className="h-100 d-flex flex-column" style={{ minHeight: 0 }}>
      <section className="row g-3 flex-grow-1" style={{ minHeight: 0 }}>
        <OrderList
          locale={locale}
          orders={orders}
          selectedOrderId={selectedOrderId}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          containerRef={containerRef}
          onSelectOrder={setSelectedOrderId}
          setOrderToDelete={setOrderIdToDelete}
        />
        <OrderDetails
          locale={locale}
          selectedOrderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      </section>

      <RemoveOrderModal
        locale={locale}
        orderIdToDelete={orderIdToDelete}
        onClose={closeModal}
        onSuccess={handleSuccessDelete}
      />
    </div>
  )
}
