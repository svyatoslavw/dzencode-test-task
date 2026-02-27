"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { getLocale } from "@/shared/i18n/runtime"
import { m } from "@/shared/i18n/messages"
import { ordersService } from "../services"

type UseRemoveOrderMutationOptions = UseMutationOptions<{ ok: true }, unknown, number, unknown>

export const useRemoveOrderMutation = (settings?: UseRemoveOrderMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["order-remove"],
    mutationFn: (orderId: number) => ordersService.removeOrder(orderId),
    onSuccess: () => {
      const locale = getLocale()
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", "details"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(m.orders_delete_success({}, { locale }))
    },
    onError: () => toast.error(m.orders_delete_error({}, { locale: getLocale() })),
    ...settings
  })
}
