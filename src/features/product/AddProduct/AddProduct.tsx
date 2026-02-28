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
import { useAddProduct } from "./useAddProduct"

const AddProduct = ({ locale, orderId }: { locale: Locale; orderId: number }) => {
  const {
    form: {
      register,
      formState: { errors }
    },
    onSubmit,
    isOpen,
    isPending,
    productTypes,
    handleOpen,
    handleClose
  } = useAddProduct({ locale, orderId })

  return (
    <>
      <button
        type="button"
        className="btn btn-primary align-items-center d-flex gap-1"
        onClick={handleOpen}
      >
        <PlusIcon />
        {m.product_add_button({}, { locale })}
      </button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>{m.product_add_modal_title({}, { locale })}</ModalTitle>
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
                <label className="form-label">
                  {m.product_add_field_image_url({}, { locale })}
                </label>
                <input
                  className={`form-control ${errors.imageUrl ? "is-invalid" : ""}`}
                  {...register("imageUrl")}
                />
                {errors.imageUrl?.message && (
                  <div className="invalid-feedback">{errors.imageUrl.message}</div>
                )}
              </div>

              <div>
                <label className="form-label">{m.product_add_field_title({}, { locale })}</label>
                <input
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  {...register("title")}
                />
                {errors.title?.message && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div>
                <label className="form-label">{m.product_add_field_type({}, { locale })}</label>
                <select
                  className={`form-select ${errors.type ? "is-invalid" : ""}`}
                  {...register("type")}
                >
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type?.message && (
                  <div className="invalid-feedback">{errors.type.message}</div>
                )}
              </div>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    {m.product_add_field_condition({}, { locale })}
                  </label>
                  <select
                    className={`form-select ${errors.quality ? "is-invalid" : ""}`}
                    {...register("quality")}
                  >
                    <option value="new">{m.products_quality_new({}, { locale })}</option>
                    <option value="used">{m.products_quality_used({}, { locale })}</option>
                  </select>
                  {errors.quality?.message && (
                    <div className="invalid-feedback">{errors.quality.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{m.product_add_field_stock({}, { locale })}</label>
                  <select
                    className={`form-select ${errors.stock ? "is-invalid" : ""}`}
                    {...register("stock", {
                      setValueAs: (value) => value === "true"
                    })}
                  >
                    <option value="true">{m.products_stock_in({}, { locale })}</option>
                    <option value="false">{m.products_stock_out({}, { locale })}</option>
                  </select>
                  {errors.stock?.message && (
                    <div className="invalid-feedback">{errors.stock.message}</div>
                  )}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    {m.product_add_field_guarantee_start({}, { locale })}
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.guaranteeStart ? "is-invalid" : ""}`}
                    {...register("guaranteeStart")}
                  />
                  {errors.guaranteeStart?.message && (
                    <div className="invalid-feedback">{errors.guaranteeStart.message}</div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    {m.product_add_field_guarantee_end({}, { locale })}
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.guaranteeEnd ? "is-invalid" : ""}`}
                    {...register("guaranteeEnd")}
                  />
                  {errors.guaranteeEnd?.message && (
                    <div className="invalid-feedback">{errors.guaranteeEnd.message}</div>
                  )}
                </div>
              </div>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">{m.product_add_field_seller({}, { locale })}</label>
                  <input
                    className={`form-control ${errors.seller ? "is-invalid" : ""}`}
                    {...register("seller")}
                  />
                  {errors.seller?.message && (
                    <div className="invalid-feedback">{errors.seller.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{m.product_add_field_date({}, { locale })}</label>
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

              <div className="row g-2">
                <div className="col-12 col-md-8">
                  <label className="form-label">{m.product_add_field_price({}, { locale })}</label>
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price?.message && (
                    <div className="invalid-feedback">{errors.price.message}</div>
                  )}
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">
                    {m.product_add_field_currency({}, { locale })}
                  </label>
                  <select
                    className={`form-select ${errors.currency ? "is-invalid" : ""}`}
                    {...register("currency")}
                  >
                    <option value="USD">USD</option>
                    <option value="UAH">UAH</option>
                  </select>
                  {errors.currency?.message && (
                    <div className="invalid-feedback">{errors.currency.message}</div>
                  )}
                </div>
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
                ? m.product_add_submitting({}, { locale })
                : m.product_add_submit({}, { locale })}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  )
}

export { AddProduct }
