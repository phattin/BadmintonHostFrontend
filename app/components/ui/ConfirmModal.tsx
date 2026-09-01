"use client";

import { TriangleAlert } from "lucide-react";

import Button from "./Button";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirm deletion?",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="overflow-hidden rounded-2xl border-t-4 border-red-600 bg-main0">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <TriangleAlert size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-foreground">{title}</h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 md:text-base">
            {description}
          </p>
        </div>

        <div className="flex gap-3 bg-white px-5 py-5">
          <Button
            type="button"
            onClick={onClose}
            background="bg-white"
            color="text-foreground"
            className="border border-gray-400"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            background="bg-red-600"
            color="text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}