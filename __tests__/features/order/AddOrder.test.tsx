import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AddOrder } from "@/features/order/AddOrder/AddOrder"
import { useAddOrder } from "@/features/order/AddOrder/useAddOrder"
import { m } from "@/shared/i18n/messages"

vi.mock("@/features/order/AddOrder/useAddOrder", () => ({
  useAddOrder: vi.fn()
}))

const mockedUseAddOrder = vi.mocked(useAddOrder)

const createRegisterMock = () =>
  vi.fn((name: string) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn()
  }))

describe("AddOrder", () => {
  beforeEach(() => {
    mockedUseAddOrder.mockReset()
  })

  it("opens modal when main button is clicked", () => {
    const handleOpen = vi.fn()

    mockedUseAddOrder.mockReturnValue({
      form: {
        register: createRegisterMock(),
        formState: { errors: {} }
      },
      onSubmit: vi.fn(),
      isOpen: false,
      isPending: false,
      handleOpen,
      handleClose: vi.fn()
    } as never)

    render(<AddOrder locale={"en" as never} />)

    fireEvent.click(screen.getByRole("button", { name: m.order_add_button({}, { locale: "en" }) }))

    expect(mockedUseAddOrder).toHaveBeenCalledWith({ locale: "en" })
    expect(handleOpen).toHaveBeenCalledTimes(1)
    expect(
      screen.queryByText(m.order_add_modal_title({}, { locale: "en" }))
    ).not.toBeInTheDocument()
  })

  it("renders opened modal and wires submit/close handlers", () => {
    const handleClose = vi.fn()
    const onSubmit = vi.fn((event: Event) => {
      event.preventDefault()
    })
    const register = createRegisterMock()

    mockedUseAddOrder.mockReturnValue({
      form: {
        register,
        formState: { errors: {} }
      },
      onSubmit,
      isOpen: true,
      isPending: false,
      handleOpen: vi.fn(),
      handleClose
    } as never)

    render(<AddOrder locale={"en" as never} />)

    expect(screen.getByText(m.order_add_modal_title({}, { locale: "en" }))).toBeInTheDocument()
    const dialog = screen.getByRole("dialog")
    expect(dialog.querySelector('input[name="title"]')).toBeInTheDocument()
    expect(dialog.querySelector('textarea[name="description"]')).toBeInTheDocument()
    expect(dialog.querySelector('input[name="date"]')).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: m.common_cancel({}, { locale: "en" }) }))
    fireEvent.click(screen.getByRole("button", { name: m.common_close({}, { locale: "en" }) }))
    fireEvent.click(screen.getByRole("button", { name: m.order_add_submit({}, { locale: "en" }) }))

    expect(handleClose).toHaveBeenCalledTimes(2)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(register).toHaveBeenCalledWith("title")
    expect(register).toHaveBeenCalledWith("description")
    expect(register).toHaveBeenCalledWith("date")
  })
})
