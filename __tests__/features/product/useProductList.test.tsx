import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useProducts } from "@/features/product/Products/useProducts"
import type { ProductsListResponse } from "@/shared/api/contracts"

const replaceMock = vi.fn()
const usePathnameMock = vi.fn()
const useRouterMock = vi.fn()
const useSearchParamsMock = vi.fn()
const useProductTypesQueryMock = vi.fn()
const useProductsQueryMock = vi.fn()

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => useRouterMock(),
  useSearchParams: () => useSearchParamsMock()
}))

vi.mock("@/shared/api", () => ({
  useProductTypesQuery: (...args: unknown[]) => useProductTypesQueryMock(...args),
  useProductsQuery: (...args: unknown[]) => useProductsQueryMock(...args)
}))

const initialPage: ProductsListResponse = {
  data: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
    nextPage: null
  }
}

describe("useProductList", () => {
  let queryString = ""

  beforeEach(() => {
    queryString = ""
    replaceMock.mockReset()
    usePathnameMock.mockReset()
    useRouterMock.mockReset()
    useSearchParamsMock.mockReset()
    useProductTypesQueryMock.mockReset()
    useProductsQueryMock.mockReset()

    usePathnameMock.mockReturnValue("/products")
    useRouterMock.mockReturnValue({ replace: replaceMock })
    useSearchParamsMock.mockImplementation(() => {
      const params = new URLSearchParams(queryString)
      return {
        get: (key: string) => params.get(key),
        toString: () => params.toString()
      }
    })
    useProductTypesQueryMock.mockReturnValue({ data: ["Laptop"] })
    useProductsQueryMock.mockReturnValue({
      data: { pages: [{ data: [] }] },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false
    })
  })

  it("adds type query param on type change", () => {
    queryString = "page=1"
    const { result } = renderHook(() => useProducts({ initialType: "", initialPage }))

    act(() => {
      result.current.handlers.handleTypeChange("Laptop")
    })

    expect(replaceMock).toHaveBeenCalledWith("/products?page=1&type=Laptop")
  })

  it("removes type query param on empty type", () => {
    queryString = "page=1&type=Laptop"
    const { result } = renderHook(() => useProducts({ initialType: "", initialPage }))

    act(() => {
      result.current.handlers.handleTypeChange("")
    })

    expect(replaceMock).toHaveBeenCalledWith("/products?page=1")
  })

  it("passes initial page only when active type equals initial type", () => {
    queryString = ""
    renderHook(() => useProducts({ initialType: "", initialPage }))

    expect(useProductsQueryMock).toHaveBeenLastCalledWith({
      type: "",
      initialPage
    })

    queryString = "type=Monitors"
    renderHook(() => useProducts({ initialType: "", initialPage }))

    expect(useProductsQueryMock).toHaveBeenLastCalledWith({
      type: "Monitors",
      initialPage: undefined
    })
  })
})
