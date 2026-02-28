"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { getErrorMessage, useCreateOrderMutation } from "@/shared/api"
import { createOrderSchema, type CreateOrderInput } from "@/shared/api/shemas"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

export type AddOrderFormValues = CreateOrderInput
const getToday = () => new Date().toISOString().slice(0, 10)

const createInitialValues = (): AddOrderFormValues => ({
  title: "",
  description: "",
  date: getToday()
})

export const useAddOrder = ({ locale }: { locale: Locale }) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<AddOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: createInitialValues()
  })

  const mutation = useCreateOrderMutation({
    onSuccess: () => {
      toast.success(m.order_add_success({}, { locale }))
      setIsOpen(false)
      form.reset(createInitialValues())
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || m.order_add_error({}, { locale }))
    }
  })

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (mutation.isPending) {
      return
    }

    setIsOpen(false)
    form.reset(createInitialValues())
  }

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isOpen,
    isPending: mutation.isPending,
    handleOpen,
    handleClose
  }
}
