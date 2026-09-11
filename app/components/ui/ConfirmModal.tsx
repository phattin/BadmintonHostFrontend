"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

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
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const t = useTranslations("common");

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="overflow-hidden rounded-2xl border-t-4 border-colorWrong">
        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-bgWrong text-colorWrong">
            <TriangleAlert size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-foreground">
            {title ?? t("confirmDeletion")}
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-foreground/60 md:text-base">
            {description}
          </p>
        </div>

        <div className="flex gap-3 bg-surface px-5 py-5">
          <Button
            type="button"
            onClick={onClose}
            background="bg-surface"
            color="text-foreground"
            className="border border-foreground/30"
          >
            {cancelText ?? t("cancel")}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            background="bg-colorWrong"
            color="text-bgWrong"
          >
            {confirmText ?? t("delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
