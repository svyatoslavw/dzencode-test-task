import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AddProduct } from "@/features/product/AddProduct/AddProduct"
import { useAddProduct } from "@/features/product/AddProduct/useAddProduct"
import { m } from "@/shared/i18n/messages"

vi.mock("@/features/product/AddProduct/useAddProduct", () => ({
  useAddProduct: vi.fn()
}))

const mockedUseAddProduct = vi.mocked(useAddProduct)

const createRegisterMock = () =>
  vi.fn((name: string) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn()
  }))

describe("AddProduct", () => {
  beforeEach(() => {
    mockedUseAddProduct.mockReset()
  })

  it("calls hook with order id and opens modal by button click", () => {
    const handleOpen = vi.fn()

    mockedUseAddProduct.mockReturnValue({
      form: {
        register: createRegisterMock(),
        formState: { errors: {} }
      },
      onSubmit: vi.fn(),
      isOpen: false,
      isPending: false,
      productTypes: ["Monitors", "Phones"],
      handleOpen,
      handleClose: vi.fn()
    } as never)

    render(<AddProduct locale={"en" as never} orderId={15} />)

    fireEvent.click(
      screen.getByRole("button", { name: m.product_add_button({}, { locale: "en" }) })
    )

    expect(mockedUseAddProduct).toHaveBeenCalledWith({ locale: "en", orderId: 15 })
    expect(handleOpen).toHaveBeenCalledTimes(1)
  })

  it("renders opened modal, shows type options and wires handlers", () => {
    const handleClose = vi.fn()
    const onSubmit = vi.fn((event: Event) => {
      event.preventDefault()
    })
    const register = createRegisterMock()

    mockedUseAddProduct.mockReturnValue({
      form: {
        register,
        formState: { errors: {} }
      },
      onSubmit,
      isOpen: true,
      isPending: false,
      productTypes: ["Monitors", "Phones", "Audio"],
      handleOpen: vi.fn(),
      handleClose
    } as never)

    render(<AddProduct locale={"en" as never} orderId={3} />)

    expect(screen.getByText(m.product_add_modal_title({}, { locale: "en" }))).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Monitors" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Phones" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Audio" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: m.common_cancel({}, { locale: "en" }) }))
    fireEvent.click(screen.getByRole("button", { name: m.common_close({}, { locale: "en" }) }))
    fireEvent.click(
      screen.getByRole("button", { name: m.product_add_submit({}, { locale: "en" }) })
    )

    expect(handleClose).toHaveBeenCalledTimes(2)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(register).toHaveBeenCalledWith("imageUrl")
    expect(register).toHaveBeenCalledWith("title")
    expect(register).toHaveBeenCalledWith("type")
  })
})
