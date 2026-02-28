import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useAddProduct } from "@/features/product/AddProduct/useAddProduct"
import { m } from "@/shared/i18n/messages"

const {
  mutateMock,
  refreshMock,
  toastSuccessMock,
  toastErrorMock,
  useRouterMock,
  useCreateProductMutationMock,
  getErrorMessageMock
} = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  refreshMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  useRouterMock: vi.fn(),
  useCreateProductMutationMock: vi.fn(),
  getErrorMessageMock: vi.fn()
}))

vi.mock("next/navigation", () => ({
  useRouter: () => useRouterMock()
}))

vi.mock("react-hot-toast", () => ({
  default: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args)
  }
}))

vi.mock("@/shared/api", () => ({
  useCreateProductMutation: (...args: unknown[]) => useCreateProductMutationMock(...args),
  getErrorMessage: (...args: unknown[]) => getErrorMessageMock(...args)
}))

describe("useAddProduct", () => {
  let mutationSettings: {
    onSuccess?: (...args: unknown[]) => void
    onError?: (...args: unknown[]) => void
  }

  beforeEach(() => {
    mutationSettings = {}
    mutateMock.mockReset()
    refreshMock.mockReset()
    toastSuccessMock.mockReset()
    toastErrorMock.mockReset()
    useRouterMock.mockReset()
    useCreateProductMutationMock.mockReset()
    getErrorMessageMock.mockReset()

    useRouterMock.mockReturnValue({ refresh: refreshMock })
    useCreateProductMutationMock.mockImplementation((settings) => {
      mutationSettings = settings as typeof mutationSettings

      return {
        mutate: mutateMock,
        isPending: false
      }
    })
  })

  it("submits valid product values and forces orderId from hook params", async () => {
    const { result } = renderHook(() => useAddProduct({ locale: "en" as never, orderId: 42 }))

    act(() => {
      result.current.handleOpen()
      result.current.form.setValue("imageUrl", "https://picsum.photos/seed/test/120/120")
      result.current.form.setValue("title", "Monitor 24")
      result.current.form.setValue("type", "Monitors")
      result.current.form.setValue("quality", "new")
      result.current.form.setValue("stock", true)
      result.current.form.setValue("guaranteeStart", "2026-01-01")
      result.current.form.setValue("guaranteeEnd", "2027-01-01")
      result.current.form.setValue("seller", "Seller #1")
      result.current.form.setValue("date", "2026-02-28")
      result.current.form.setValue("price", 100)
      result.current.form.setValue("currency", "USD")
      result.current.form.setValue("orderId", 999)
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mutateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Monitor 24",
        seller: "Seller #1",
        orderId: 42
      })
    )
  })

  it("handles mutation success and error callbacks", () => {
    getErrorMessageMock.mockReturnValue("")
    const { result } = renderHook(() => useAddProduct({ locale: "en" as never, orderId: 7 }))

    act(() => {
      result.current.handleOpen()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      mutationSettings.onSuccess?.()
    })

    expect(result.current.isOpen).toBe(false)
    expect(toastSuccessMock).toHaveBeenCalledWith(m.product_add_success({}, { locale: "en" }))
    expect(refreshMock).toHaveBeenCalledTimes(1)

    act(() => {
      mutationSettings.onError?.(new Error("boom"))
    })

    expect(toastErrorMock).toHaveBeenCalledWith(m.product_add_error({}, { locale: "en" }))
  })
})
