import type { OrderDetailsModel } from "@/entities/order/model/types"

import { PAGE_LIMIT, type OrdersListResponse } from "@/shared/api/contracts"
import { apiRequest } from "@/shared/api/request"

export interface OrderDetailsResponse {
  data: OrderDetailsModel
}

class OrdersService {
  getPaginatedOrders(page: number, limit = PAGE_LIMIT) {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))

    return apiRequest<OrdersListResponse>(`/api/orders?${params.toString()}`)
  }

  getOrderDetails(orderId: number) {
    return apiRequest<OrderDetailsResponse>(`/api/orders/${orderId}`)
  }

  removeOrder(orderId: number) {
    return apiRequest<{ ok: true }>(`/api/orders/${orderId}`, {
      method: "DELETE"
    })
  }
}

export const ordersService = new OrdersService()
