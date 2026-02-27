"use client"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

import type { ProductTypesResponse } from "@/shared/api/services/products.service"
import { productsService } from "@/shared/api/services/products.service"

type UseProductTypesQueryOptions = Omit<
  UseQueryOptions<ProductTypesResponse, unknown, string[], ["product-types"]>,
  "queryKey" | "queryFn" | "select"
>

export const useProductTypesQuery = (settings?: UseProductTypesQueryOptions) =>
  useQuery({
    queryKey: ["product-types"],
    queryFn: () => productsService.getProductTypes(),
    select: (response) => response.data,
    ...settings
  })
