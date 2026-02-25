"use client"

import { useQuery } from "@tanstack/react-query"

import type { ProductModel } from "@/entities/product/model/types"
import { apiRequest } from "@/shared/api/request"

interface ProductsResponse {
  data: ProductModel[]
}

interface ProductTypesResponse {
  data: string[]
}

export const useProducts = (type?: string) => {
  return useQuery({
    queryKey: ["products", type ?? "all"],
    queryFn: () =>
      apiRequest<ProductsResponse>(
        `/api/products${type ? `?type=${encodeURIComponent(type)}` : ""}`
      ),
    select: (response) => response.data
  })
}

export const useProductTypes = () => {
  return useQuery({
    queryKey: ["product-types"],
    queryFn: () => apiRequest<ProductTypesResponse>("/api/products/types"),
    select: (response) => response.data
  })
}
