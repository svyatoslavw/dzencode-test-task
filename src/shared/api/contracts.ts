import type { OrderModel } from "@/entities/order/model/types"
import type { ProductModel } from "@/entities/product/model/types"

export const PAGE_LIMIT = 20
export const MAX_PAGE_LIMIT = 100

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
  nextPage: number | null
}

export interface PaginatedResponse<TData> {
  data: TData[]
  pagination: PaginationMeta
}

export type OrdersListResponse = PaginatedResponse<OrderModel>
export type ProductsListResponse = PaginatedResponse<ProductModel>
