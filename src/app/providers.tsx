"use client"

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"

import { BaseResponse } from "@/shared/api"
import { m } from "@/shared/i18n/messages"
import { getLocale } from "@/shared/i18n/runtime"
import toast, { Toaster } from "react-hot-toast"

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  const onError = (cause: unknown) => {
    const { response } = cause as AxiosError<BaseResponse>
    const message = response?.data?.message ?? m.common_default_error({}, { locale: getLocale() })
    const toastId = response?.status === 401 ? "api-error-401" : `api-error-${message}`

    toast.error(message, { id: toastId })
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError }),
        mutationCache: new MutationCache({ onError }),
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false
          },
          mutations: {
            retry: 0
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
  )
}
