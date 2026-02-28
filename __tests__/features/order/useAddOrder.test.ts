import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useAddOrder } from "@/features/order/AddOrder/useAddOrder"
import { m } from "@/shared/i18n/messages"

const {
  mutateMock,
  refreshMock,
  toastSuccessMock,
  toastErrorMock,
  useRouterMock,
  useCreateOrderMutationMock,
  getErrorMessageMock
} = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  refreshMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  useRouterMock: vi.fn(),
  useCreateOrderMutationMock: vi.fn(),
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
  useCreateOrderMutation: (...args: unknown[]) => useCreateOrderMutationMock(...args),
  getErrorMessage: (...args: unknown[]) => getErrorMessageMock(...args)
}))

describe("useAddOrder", () => {
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
    useCreateOrderMutationMock.mockReset()
    getErrorMessageMock.mockReset()

    useRouterMock.mockReturnValue({ refresh: refreshMock })
    useCreateOrderMutationMock.mockImplementation((settings) => {
      mutationSettings = settings as typeof mutationSettings

      return {
        mutate: mutateMock,
        isPending: false
      }
    })
  })

  it("opens/closes modal and submits valid values", async () => {
    const { result } = renderHook(() => useAddOrder({ locale: "en" as never }))

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.handleOpen()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.form.setValue("title", "Order #1")
      result.current.form.setValue("description", "Order description")
      result.current.form.setValue("date", "2026-02-28")
    })

    await act(async () => {
      await result.current.onSubmit()
    })

    expect(mutateMock).toHaveBeenCalledWith({
      title: "Order #1",
      description: "Order description",
      date: "2026-02-28"
    })

    act(() => {
      result.current.handleClose()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it("handles success and error callbacks from mutation", () => {
    getErrorMessageMock.mockReturnValue("Backend failed")
    renderHook(() => useAddOrder({ locale: "en" as never }))

    act(() => {
      mutationSettings.onSuccess?.()
    })

    expect(toastSuccessMock).toHaveBeenCalledWith(m.order_add_success({}, { locale: "en" }))
    expect(refreshMock).toHaveBeenCalledTimes(1)

    act(() => {
      mutationSettings.onError?.(new Error("boom"))
    })

    expect(toastErrorMock).toHaveBeenCalledWith("Backend failed")
  })
})
