"use client"

import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { UserModel } from "@/entities/user/model/types"
import { apiRequest, BaseResponse, DEFAULT_ERROR } from "@/shared/api/request"

export type AuthMode = "login" | "register"

const authSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").optional(),
  email: z.email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов")
})

export type AuthFormValues = z.infer<typeof authSchema>

interface AuthResponse {
  user: UserModel
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (error as AxiosError<BaseResponse>).response?.data?.message ?? DEFAULT_ERROR
  }

  if (error instanceof Error) {
    return error.message
  }

  return DEFAULT_ERROR
}

export const useAuthForm = (mode: AuthMode) => {
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
      form.setError("name", {
        message: "Введите имя"
      })
      return
    }

    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    serverError: mutation.isError ? getErrorMessage(mutation.error) : null
  }
}
