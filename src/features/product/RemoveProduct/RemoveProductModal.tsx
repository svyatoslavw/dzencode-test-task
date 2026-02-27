"use client"

import { useRemoveProductMutation } from "@/shared/api"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle
} from "@/shared/ui"

interface RemoveProductModalProps {
  productIdToDelete: number | null
  onClose: () => void
  onSuccess: () => void
}

const RemoveProductModal = ({ productIdToDelete, onClose, onSuccess }: RemoveProductModalProps) => {
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
        <ModalTitle>Удаление продукта</ModalTitle>
        <ModalCloseButton onClick={handleCloseModal} disabled={isPending} />
      </ModalHeader>

      <ModalBody>
        <p className="mb-0">Вы действительно хотите удалить продукт?</p>
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
          disabled={isPending || !productIdToDelete}
        >
          {isPending ? "Удаление..." : "Удалить"}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export { RemoveProductModal }
