"use client"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

import type { UserModel } from "@/entities/user/model/types"
import { authService, type CurrentUserResponse } from "@/shared/api/services/auth.service"

type CurrentUserQueryOptions = Omit<
  UseQueryOptions<CurrentUserResponse, unknown, UserModel, ["current-user"]>,
  "queryKey" | "queryFn" | "select"
>

export const useCurrentUserQuery = (settings?: CurrentUserQueryOptions) => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => authService.me(),
    select: (response) => response.user,
    ...settings
  })
}
