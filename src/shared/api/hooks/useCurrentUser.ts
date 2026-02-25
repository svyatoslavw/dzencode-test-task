"use client"

import { useQuery } from "@tanstack/react-query"

import type { UserModel } from "@/entities/user/model/types"
import { apiRequest } from "@/shared/api/request"

interface CurrentUserResponse {
  user: UserModel
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => apiRequest<CurrentUserResponse>("/api/auth/me"),
    select: (response) => response.user
  })
}
