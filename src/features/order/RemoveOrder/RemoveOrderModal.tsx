"use client"

import { useRemoveOrderMutation } from "@/shared/api"
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

interface RemoveOrderModalProps {
  locale: Locale
  orderIdToDelete: number | null
  onClose: () => void
  onSuccess: () => void
}

const RemoveOrderModal = ({
  locale,
  onClose,
  orderIdToDelete,
  onSuccess
}: RemoveOrderModalProps) => {
  const { mutate, isPending } = useRemoveOrderMutation({
    onSuccess
  })

  const handleCloseModal = () => {
    if (!isPending) {
      onClose()
    }
  }

  const handleConfirmDelete = () => {
    if (!orderIdToDelete) return

    mutate(orderIdToDelete)
  }

  return (
    <Modal isOpen={!!orderIdToDelete} onClose={handleCloseModal}>
      <ModalHeader>
        <ModalTitle>{m.orders_delete_modal_title({}, { locale })}</ModalTitle>
        <ModalCloseButton
          ariaLabel={m.common_close({}, { locale })}
          onClick={handleCloseModal}
          disabled={isPending}
        />
      </ModalHeader>

      <ModalBody>
        <p className="mb-0">{m.orders_delete_modal_text({}, { locale })}</p>
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
          disabled={isPending || !orderIdToDelete}
        >
          {isPending ? m.common_deleting({}, { locale }) : m.common_delete({}, { locale })}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export { RemoveOrderModal }
