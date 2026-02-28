"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"

import type { CreateOrderInput } from "@/shared/api/shemas"
import { ordersService } from "../services"

type UseCreateOrderMutationOptions = UseMutationOptions<
  { ok: true; id: number },
  unknown,
  CreateOrderInput,
  unknown
>

export const useCreateOrderMutation = (settings?: UseCreateOrderMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["order-create"],
    mutationFn: (payload: CreateOrderInput) => ordersService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    ...settings
  })
}
