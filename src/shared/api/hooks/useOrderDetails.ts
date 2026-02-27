"use client"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

import type { OrderDetailsModel } from "@/entities/order/model/types"
import type { OrderDetailsResponse } from "@/shared/api/services/orders.service"
import { ordersService } from "@/shared/api/services/orders.service"

type UseOrderDetailsQueryOptions = Omit<
  UseQueryOptions<
    OrderDetailsResponse,
    unknown,
    OrderDetailsModel,
    ["orders", "details", number | null]
  >,
  "queryKey" | "queryFn" | "select" | "enabled"
>

export const useOrderDetailsQuery = (
  orderId: number | null,
  settings?: UseOrderDetailsQueryOptions
) =>
  useQuery({
    queryKey: ["orders", "details", orderId],
    enabled: orderId !== null,
    queryFn: () => ordersService.getOrderDetails(orderId as number),
    select: (response) => response.data,
    ...settings
  })
