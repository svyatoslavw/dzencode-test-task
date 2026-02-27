"use client"

import { useRemoveProductMutation } from "@/shared/api"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@/shared/ui"

interface RemoveProductModalProps {
  locale: Locale
  productIdToDelete: number | null
  onClose: () => void
  onSuccess: () => void
}

const RemoveProductModal = ({
  locale,
  productIdToDelete,
  onClose,
  onSuccess
}: RemoveProductModalProps) => {
  const { mutate, isPending } = useRemoveProductMutation({
    onSuccess
  })

  const handleCloseModal = () => {
    if (!isPending) {
      onClose()
    }
  }

  const handleConfirmDelete = () => {
    if (!productIdToDelete) return

    mutate(productIdToDelete)
  }

  return (
    <Modal isOpen={!!productIdToDelete} onClose={handleCloseModal}>
      <ModalHeader>
        <ModalTitle>{m.products_delete_modal_title({}, { locale })}</ModalTitle>
        <ModalCloseButton
          ariaLabel={m.common_close({}, { locale })}
          onClick={handleCloseModal}
          disabled={isPending}
        />
      </ModalHeader>

      <ModalBody>
        <p className="mb-0">{m.products_delete_modal_text({}, { locale })}</p>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
          disabled={isPending}
        >
          {m.common_cancel({}, { locale })}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleConfirmDelete}
          disabled={isPending || !productIdToDelete}
        >
          {isPending ? m.common_deleting({}, { locale }) : m.common_delete({}, { locale })}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export { RemoveProductModal }
