"use client"

import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  PlusIcon
} from "@/shared/ui"
import { useAddOrder } from "./useAddOrder"

const AddOrder = ({ locale }: { locale: Locale }) => {
  const {
    form: {
      register,
      formState: { errors }
    },
    onSubmit,
    isOpen,
    isPending,
    handleOpen,
    handleClose
  } = useAddOrder({ locale })

  return (
    <>
      <button
        type="button"
        className="btn btn-primary align-items-center d-flex gap-1"
        onClick={handleOpen}
      >
        <PlusIcon />
        {m.order_add_button({}, { locale })}
      </button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>{m.order_add_modal_title({}, { locale })}</ModalTitle>
          <ModalCloseButton
            ariaLabel={m.common_close({}, { locale })}
            onClick={handleClose}
            disabled={isPending}
          />
        </ModalHeader>

        <form onSubmit={onSubmit}>
          <ModalBody>
            <div className="d-grid gap-3">
              <div>
                <label className="form-label">{m.order_add_field_title({}, { locale })}</label>
                <input
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  {...register("title")}
                />
                {errors.title?.message && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div>
                <label className="form-label">
                  {m.order_add_field_description({}, { locale })}
                </label>
                <textarea
                  rows={4}
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  {...register("description")}
                />
                {errors.description?.message && (
                  <div className="invalid-feedback">{errors.description.message}</div>
                )}
              </div>

              <div>
                <label className="form-label">{m.orders_column_date({}, { locale })}</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  {...register("date")}
                />
                {errors.date?.message && (
                  <div className="invalid-feedback">{errors.date.message}</div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              {m.common_cancel({}, { locale })}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending
                ? m.order_add_submitting({}, { locale })
                : m.order_add_submit({}, { locale })}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  )
}

export { AddOrder }
