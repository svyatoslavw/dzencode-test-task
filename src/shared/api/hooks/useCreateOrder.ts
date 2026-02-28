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
  const { onSuccess, ...restSettings } = settings ?? {}

  return useMutation({
    mutationKey: ["order-create"],
    mutationFn: (payload: CreateOrderInput) => ordersService.createOrder(payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["orders", "details"] })
      ])

      onSuccess?.(data, variables, onMutateResult, context)
    },
    ...restSettings
  })
}
