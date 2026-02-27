"use client"

import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions
} from "@tanstack/react-query"

import type { OrdersListResponse } from "@/shared/api/contracts"
import { ordersService } from "@/shared/api/services/orders.service"

interface UseOrdersParams {
  initialPage?: OrdersListResponse
  settings?: UseOrdersQueryOptions
}

type UseOrdersQueryOptions = Omit<
  UseInfiniteQueryOptions<
    OrdersListResponse,
    unknown,
    InfiniteData<OrdersListResponse, number>,
    ["orders", "list"],
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam" | "initialData"
>

export const useOrdersQuery = ({ initialPage, settings }: UseOrdersParams = {}) =>
  useInfiniteQuery({
    queryKey: ["orders", "list"],
    queryFn: ({ pageParam }) => ordersService.getPaginatedOrders(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    initialData: initialPage
      ? {
          pages: [initialPage],
          pageParams: [1]
        }
      : undefined,
    ...settings
  })
