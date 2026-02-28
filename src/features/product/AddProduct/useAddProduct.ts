"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { getErrorMessage, useCreateProductMutation } from "@/shared/api"
import { createProductSchema, PRODUCT_TYPES, type CreateProductInput } from "@/shared/api/shemas"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { getToday } from "@/shared/lib"
import { useRouter } from "next/navigation"

const addOneYear = (date: string) => {
  const parsed = new Date(date)
  parsed.setFullYear(parsed.getFullYear() + 1)
  return parsed.toISOString().slice(0, 10)
}

const createInitialValues = (orderId: number): CreateProductInput => {
  const today = getToday()

  return {
    imageUrl: "https://picsum.photos/seed/120/120",
    title: "",
    type: PRODUCT_TYPES[0],
    quality: "new",
    stock: true,
    guaranteeStart: today,
    guaranteeEnd: addOneYear(today),
    seller: "",
    date: today,
    price: 100,
    currency: "USD",
    orderId
  }
}

export const useAddProduct = ({ locale, orderId }: { locale: Locale; orderId: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: createInitialValues(orderId)
  })

  const mutation = useCreateProductMutation({
    onSuccess: () => {
      toast.success(m.product_add_success({}, { locale }))
      setIsOpen(false)
      form.reset(createInitialValues(orderId))
      router.refresh()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || m.product_add_error({}, { locale }))
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
    form.reset(createInitialValues(orderId))
  }

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      ...values,
      orderId
    })
  })

  return {
    form,
    onSubmit,
    isOpen,
    isPending: mutation.isPending,
    productTypes: PRODUCT_TYPES,
    handleOpen,
    handleClose
  }
}
