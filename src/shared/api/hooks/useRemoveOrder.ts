"use client"

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { ordersService } from "../services"

type UseRemoveOrderMutationOptions = UseMutationOptions<{ ok: true }, unknown, number, unknown>

export const useRemoveOrderMutation = (settings?: UseRemoveOrderMutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["order-remove"],
    mutationFn: (orderId: number) => ordersService.removeOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", "details"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Заказ удалён")
    },
    onError: () => toast.error("Не удалось удалить заказ"),
    ...settings
  })
}
