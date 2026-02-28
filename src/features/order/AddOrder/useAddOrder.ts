"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { getErrorMessage, useCreateOrderMutation } from "@/shared/api"
import { createOrderSchema, type CreateOrderInput } from "@/shared/api/shemas"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { getToday } from "@/shared/lib"
import { useRouter } from "next/navigation"

const createInitialValues = (): CreateOrderInput => ({
  title: "",
  description: "",
  date: getToday()
})

export const useAddOrder = ({ locale }: { locale: Locale }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: createInitialValues()
  })

  const { mutate, isPending } = useCreateOrderMutation({
    onSuccess: () => {
      toast.success(m.order_add_success({}, { locale }))
      setIsOpen(false)
      form.reset(createInitialValues())
      router.refresh()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || m.order_add_error({}, { locale }))
    }
  })

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isPending) return

    setIsOpen(false)
    form.reset(createInitialValues())
  }

  const onSubmit = form.handleSubmit((values) => mutate(values))

  return {
    form,
    onSubmit,
    isOpen,
    isPending,
    handleOpen,
    handleClose
  }
}
