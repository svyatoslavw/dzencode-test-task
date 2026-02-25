import type { ProductModel } from "@/entities/product"

export interface OrderModel {
  id: number
  title: string
  description: string
  date: string
  productsCount: number
  totalUSD: number
  totalUAH: number
}

export interface OrderDetailsModel extends OrderModel {
  products: ProductModel[]
}
