"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { apiRequest } from "@/shared/api/request"

export const useLogout = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: () =>
      apiRequest<{ ok: true }>("/api/auth/logout", {
        method: "POST"
      }),
    onSuccess: () => {
      router.push("/login")
      router.refresh()
    }
  })
}
