"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiRequest } from "@/shared/api/request"

export const useRemoveProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: number) =>
      apiRequest<{ ok: true }>(`/api/products/${productId}`, {
        method: "DELETE"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    }
  })
}
