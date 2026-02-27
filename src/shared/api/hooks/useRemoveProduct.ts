"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { m } from "@/shared/i18n/messages"
import { getLocale } from "@/shared/i18n/runtime"

import { productsService } from "../services"

type UseRemoveProductMutationOptions = UseMutationOptions<{ ok: true }, unknown, number, unknown>

export const useRemoveProductMutation = (settings?: UseRemoveProductMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["product-remove"],
    mutationFn: (productId: number) => productsService.removeProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: () => toast.error(m.products_delete_error({}, { locale: getLocale() })),
    ...settings
  })
}
