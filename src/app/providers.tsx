"use client"

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"

import { BaseResponse, DEFAULT_ERROR } from "@/shared/api"
import toast, { Toaster } from "react-hot-toast"

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  const onError = (cause: unknown) => {
    const { response } = cause as AxiosError<BaseResponse>
    console.log(response)
    toast.error(response?.data?.message ?? DEFAULT_ERROR)
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
