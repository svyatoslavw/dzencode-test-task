"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import type { AuthMode, UserModel } from "@/entities/user"
import { getErrorMessage } from "@/shared/api"
import { apiRequest } from "@/shared/api/request"

interface AuthResponse {
  user: UserModel
}

const authSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").optional(),
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов")
})

export type AuthFormValues = z.infer<typeof authSchema>

export const useAuthForm = ({ mode }: { mode: AuthMode }) => {
  const router = useRouter()

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues:
      mode === "register"
        ? { name: "", email: "", password: "" }
        : { name: undefined, email: "", password: "" }
  })

  const mutation = useMutation<AuthResponse, unknown, AuthFormValues>({
    mutationFn: async (values) => {
      if (mode === "register") {
        return apiRequest<AuthResponse>("/api/auth/register", {
          method: "POST",
          data: {
            name: values.name,
            email: values.email,
            password: values.password
          }
        })
      }

      return apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        data: {
          email: values.email,
          password: values.password
        }
      })
    },
    onSuccess: () => {
      router.push("/orders")
      router.refresh()
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (mode === "register" && !values.name) {
      form.setError("name", { message: "Введите имя" })
      return
    }

    mutation.mutate(values)
    toast.success(mode === "register" ? "Регистрация успешна!" : "Вход выполнен!")
  })

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    serverError: mutation.isError ? getErrorMessage(mutation.error) : null
  }
}
