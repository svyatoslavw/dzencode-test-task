"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiRequest } from "@/shared/api/request"

export const useRemoveOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) =>
      apiRequest<{ ok: true }>(`/api/orders/${orderId}`, {
        method: "DELETE"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", "details"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })
}
