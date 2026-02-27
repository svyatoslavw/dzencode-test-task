"use client"

import { useEffect, type HTMLAttributes, type ReactNode } from "react"
import { m } from "@/shared/i18n/messages"
import { getLocale } from "@/shared/i18n/runtime"

interface ModalProps {
  isOpen: boolean
  children: ReactNode
  onClose?: () => void
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  dialogClassName?: string
  contentClassName?: string
}

interface ModalSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

interface ModalCloseButtonProps {
  onClick?: () => void
  ariaLabel?: string
  disabled?: boolean
}

export const Modal = ({
  isOpen,
  children,
  onClose,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  dialogClassName,
  contentClassName
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeOnEscape, isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className="modal show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className={`modal-dialog modal-dialog-centered ${dialogClassName ?? ""}`.trim()}>
          <div className={`modal-content ${contentClassName ?? ""}`.trim()}>{children}</div>
        </div>
      </div>

      <div
        className="modal-backdrop show"
        onClick={() => {
          if (closeOnBackdropClick) {
            onClose?.()
          }
        }}
      />
    </>
  )
}

export const ModalHeader = ({ children, className, ...props }: ModalSectionProps) => {
  return (
    <div className={`modal-header ${className ?? ""}`.trim()} {...props}>
      {children}
    </div>
  )
}

export const ModalTitle = ({ children, className, ...props }: ModalTitleProps) => {
  return (
    <h5 className={`modal-title ${className ?? ""}`.trim()} {...props}>
      {children}
    </h5>
  )
}

export const ModalBody = ({ children, className, ...props }: ModalSectionProps) => {
  return (
    <div className={`modal-body ${className ?? ""}`.trim()} {...props}>
      {children}
    </div>
  )
}

export const ModalFooter = ({ children, className, ...props }: ModalSectionProps) => {
  return (
    <div className={`modal-footer ${className ?? ""}`.trim()} {...props}>
      {children}
    </div>
  )
}

export const ModalCloseButton = ({
  onClick,
  ariaLabel = m.common_close({}, { locale: getLocale() }),
  disabled = false
}: ModalCloseButtonProps) => {
  return (
    <button
      type="button"
      className="btn-close"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    />
  )
}
