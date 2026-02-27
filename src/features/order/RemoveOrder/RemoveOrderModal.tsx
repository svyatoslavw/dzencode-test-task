"use client"

import { useRemoveOrderMutation } from "@/shared/api"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@/shared/ui"

interface RemoveOrderModalProps {
  orderIdToDelete: number | null
  onClose: () => void
  onSuccess: () => void
}

const RemoveOrderModal = ({ onClose, orderIdToDelete, onSuccess }: RemoveOrderModalProps) => {
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
        <ModalTitle>Удаление прихода</ModalTitle>
        <ModalCloseButton onClick={handleCloseModal} disabled={isPending} />
      </ModalHeader>

      <ModalBody>
        <p className="mb-0">Вы действительно хотите удалить приход?</p>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
          disabled={isPending}
        >
          Отмена
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleConfirmDelete}
          disabled={isPending || !orderIdToDelete}
        >
          {isPending ? "Удаление..." : "Удалить"}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export { RemoveOrderModal }
