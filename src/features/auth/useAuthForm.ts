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
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface AuthResponse {
  user: UserModel
}

const getAuthSchema = (locale: Locale) =>
  z.object({
    name: z.string().trim().min(2, m.auth_validation_name_required({}, { locale })).optional(),
    email: z.email(m.auth_validation_email_invalid({}, { locale })),
    password: z.string().min(6, m.auth_validation_password_min({}, { locale }))
  })

export type AuthFormValues = z.infer<ReturnType<typeof getAuthSchema>>

export const useAuthForm = ({ mode, locale }: { mode: AuthMode; locale: Locale }) => {
  const router = useRouter()
  const authSchema = getAuthSchema(locale)

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
      form.setError("name", { message: m.auth_validation_name_required({}, { locale }) })
      return
    }

    mutation.mutate(values)
    toast.success(
      mode === "register"
        ? m.auth_success_register({}, { locale })
        : m.auth_success_login({}, { locale })
    )
  })

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    serverError: mutation.isError ? getErrorMessage(mutation.error) : null
  }
}
