import { PAGE_LIMIT, type ProductsListResponse } from "@/shared/api/contracts"
import { apiRequest } from "@/shared/api/request"

export interface ProductTypesResponse {
  data: string[]
}

class ProductsService {
  getPaginatedProducts(page: number, type?: string, limit = PAGE_LIMIT) {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))

    if (type) {
      params.set("type", type)
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
}

export const productsService = new ProductsService()
