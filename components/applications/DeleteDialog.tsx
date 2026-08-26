'use client'

import React from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  companyName: string
  isDeleting?: boolean
}

export function DeleteDialog({ isOpen, onClose, onConfirm, companyName, isDeleting }: DeleteDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete application?">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500">
          Are you sure you want to delete your application for <span className="font-semibold text-neutral-900">{companyName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-neutral-100">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
