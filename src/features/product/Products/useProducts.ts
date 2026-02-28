"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef } from "react"

import { useProductTypesQuery, useProductsQuery, type ProductsListResponse } from "@/shared/api"

interface UseProductsProps {
  initialType?: string
  initialPage: ProductsListResponse
}

export const useProducts = ({ initialType = "", initialPage }: UseProductsProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const type = searchParams.get("type")?.trim() ?? initialType

  const { data: types } = useProductTypesQuery()
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsQuery({
      type,
      initialPage: type === initialType ? initialPage : undefined
    })

  const productTypes = useMemo(() => types ?? [], [types])
  const products = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handleTypeChange = (nextType: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextType) {
      params.set("type", nextType)
    } else {
      params.delete("type")
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  const state = {
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    error,
    products,
    productTypes,
    type,
    containerRef
  }

  const handlers = { handleTypeChange }

  return { state, handlers }
}
