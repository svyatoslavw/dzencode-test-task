"use client"

import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions
} from "@tanstack/react-query"

import type { ProductsListResponse } from "@/shared/api/contracts"
import { productsService } from "@/shared/api/services/products.service"

interface UseProductsParams {
  type?: string
  orderId?: number
  initialPage?: ProductsListResponse
  settings?: UseProductsQueryOptions
}

type ProductsQueryKey = ["products", "list", string, number | "all"]

type UseProductsQueryOptions = Omit<
  UseInfiniteQueryOptions<
    ProductsListResponse,
    unknown,
    InfiniteData<ProductsListResponse, number>,
    ProductsQueryKey,
    number
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam" | "initialData"
>

export const useProductsQuery = ({
  type,
  orderId,
  initialPage,
  settings
}: UseProductsParams = {}) =>
  useInfiniteQuery({
    queryKey: ["products", "list", type ?? "all", orderId ?? "all"],
    queryFn: ({ pageParam }) =>
      productsService.getPaginatedProducts({
        page: pageParam,
        type,
        orderId
      }),
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
