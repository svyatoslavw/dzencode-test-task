"use client"

import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { authService } from "@/shared/api/services/auth.service"

type UseLogoutMutationOptions = UseMutationOptions<{ ok: true }, unknown, void, unknown>

export const useLogoutMutation = (settings?: UseLogoutMutationOptions) => {
  const router = useRouter()

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push("/login")
      router.refresh()
    },
    ...settings
  })
}
