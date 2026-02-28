"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"

import type { CreateProductInput } from "@/shared/api/shemas"
import { productsService } from "../services"

type UseCreateProductMutationOptions = UseMutationOptions<
  { ok: true; id: number },
  unknown,
  CreateProductInput,
  unknown
>

export const useCreateProductMutation = (settings?: UseCreateProductMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["product-create"],
    mutationFn: (payload: CreateProductInput) => productsService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["product-types"] })
    },
    ...settings
  })
}
