import type { UserModel } from "@/entities/user/model/types"

import { apiRequest } from "@/shared/api/request"

export interface CurrentUserResponse {
  user: UserModel
}

class AuthService {
  me() {
    return apiRequest<CurrentUserResponse>("/api/auth/me")
  }

  logout() {
    return apiRequest<{ ok: true }>("/api/auth/logout", {
      method: "POST"
    })
  }
}

export const authService = new AuthService()
