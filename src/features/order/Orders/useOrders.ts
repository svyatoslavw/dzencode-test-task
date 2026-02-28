"use client"

import { OrdersListResponse, useOrdersQuery } from "@/shared/api"
import { useEffect, useMemo, useRef, useState } from "react"

export const useOrders = ({ initialPage }: { initialPage: OrdersListResponse }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useOrdersQuery({ initialPage })

  const orders = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])

  const safeSelectedOrderId =
    selectedOrderId !== null && orders.some((order) => order.id === selectedOrderId)
      ? selectedOrderId
      : null

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const state = {
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    error,
    orders,
    selectedOrderId: safeSelectedOrderId,
    containerRef
  }

  const handlers = { setSelectedOrderId }

  return { state, handlers }
}
