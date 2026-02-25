"use client"

import { useQuery } from "@tanstack/react-query"

import type { OrderDetailsModel, OrderModel } from "@/entities/order/model/types"
import { apiRequest } from "@/shared/api/request"

interface OrdersResponse {
  data: OrderModel[]
}

interface OrderDetailsResponse {
  data: OrderDetailsModel
}

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => apiRequest<OrdersResponse>("/api/orders"),
    select: (response) => response.data
  })
}

export const useOrderDetails = (orderId: number | null) => {
  return useQuery({
    queryKey: ["orders", "details", orderId],
    enabled: orderId !== null,
    queryFn: () => apiRequest<OrderDetailsResponse>(`/api/orders/${orderId}`),
    select: (response) => response.data
  })
}
