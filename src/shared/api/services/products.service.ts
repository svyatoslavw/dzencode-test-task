import { PAGE_LIMIT, type ProductsListResponse } from "@/shared/api/contracts"
import { apiRequest } from "@/shared/api/request"
import type { CreateProductInput } from "@/shared/api/shemas"

export interface ProductTypesResponse {
  data: string[]
}

class ProductsService {
  getPaginatedProducts({
    page,
    type,
    orderId,
    limit = PAGE_LIMIT
  }: {
    page: number
    type?: string
    orderId?: number
    limit?: number
  }) {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))

    if (type) {
      params.set("type", type)
    }

    if (orderId) {
      params.set("orderId", String(orderId))
    }

    return apiRequest<ProductsListResponse>(`/api/products?${params.toString()}`)
  }

  getProductTypes() {
    return apiRequest<ProductTypesResponse>("/api/products/types")
  }

  removeProduct(productId: number) {
    return apiRequest<{ ok: true }>(`/api/products/${productId}`, {
      method: "DELETE"
    })
  }

  createProduct(payload: CreateProductInput) {
    return apiRequest<{ ok: true; id: number }>("/api/products", {
      method: "POST",
      data: payload
    })
  }
}

export const productsService = new ProductsService()
