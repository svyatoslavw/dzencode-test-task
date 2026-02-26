export interface UserModel {
  id: number
  email: string
  name: string
  createdAt: string
}

export type AuthMode = "login" | "register"
