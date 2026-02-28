"use client"

import { AddProduct } from "@/features/product"
import { PAGE_LIMIT, type ProductsListResponse } from "@/shared/api/contracts"
import { useOrderDetailsQuery, useProductsQuery } from "@/shared/api/hooks"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import { useEffect, useMemo, useRef } from "react"
import { OrderDetailsHeader } from "./OrderDetailsHeader"
import { OrderDetailsProductsTable } from "./OrderDetailsProductsTable"
import { OrderDetailsStats } from "./OrderDetailsStats"

interface OrderDetailsProps {
  locale: Locale
  selectedOrderId: number | null
  onClose: () => void
}

export const OrderDetails = ({ locale, selectedOrderId, onClose }: OrderDetailsProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, isError, error } = useOrderDetailsQuery(selectedOrderId)
  const initialProductsPage = useMemo<ProductsListResponse | undefined>(() => {
    if (!data) {
      return undefined
    }

    const hasMore = data.productsCount > data.products.length

    return {
      data: data.products,
      pagination: {
        page: 1,
        limit: PAGE_LIMIT,
        total: data.productsCount,
        hasMore,
        nextPage: hasMore ? 2 : null
      }
    }
  }, [data])

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useProductsQuery({
    orderId: selectedOrderId ?? undefined,
    initialPage: initialProductsPage,
    settings: {
      enabled: selectedOrderId !== null && Boolean(initialProductsPage)
    }
  })
  const products = useMemo(
    () => productsData?.pages.flatMap((page) => page.data) ?? [],
    [productsData]
  )

  useEffect(() => {
    if (!selectedOrderId || !containerRef.current) return

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, selectedOrderId])

  if (!selectedOrderId) return null

  return (
    <div className="col-12 col-xxl-6">
      <section className="card border-0 shadow-sm max-h-75">
        <div className="card-body d-flex flex-column gap-3 p-3">
          <OrderDetailsHeader
            locale={locale}
            title={data?.title}
            description={data?.description}
            onClose={onClose}
          />

          {isLoading && (
            <div className="alert alert-info mb-0">{m.orders_details_loading({}, { locale })}</div>
          )}

          {isError && (
            <div className="alert alert-danger mb-0">
              {m.common_error_with_message({ message: (error as Error).message }, { locale })}
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              <OrderDetailsStats
                locale={locale}
                productsCount={data.productsCount}
                totalUSD={data.totalUSD}
                totalUAH={data.totalUAH}
              />

              <div className="d-flex justify-content-between align-items-center">
                <h3 className="h6 mb-0">{m.orders_details_column_product({}, { locale })}</h3>
                <AddProduct locale={locale} orderId={selectedOrderId} />
              </div>

              {isProductsLoading && (
                <div className="alert alert-info mb-0">{m.products_loading({}, { locale })}</div>
              )}

              {isProductsError && (
                <div className="alert alert-danger mb-0">
                  {m.common_error_with_message(
                    { message: (productsError as Error).message },
                    { locale }
                  )}
                </div>
              )}

              {!isProductsLoading && !isProductsError && (
                <OrderDetailsProductsTable
                  locale={locale}
                  products={products}
                  hasNextPage={Boolean(hasNextPage)}
                  isFetchingNextPage={isFetchingNextPage}
                  containerRef={containerRef}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
