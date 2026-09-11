"use client";

import { CircleCheckBig } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "./Button";
import Modal from "./Modal";

interface StatusModalProps {
  open: boolean;
  title?: string;
  description: string;
  buttonText?: string;
  onClose: () => void;
}

export default function StatusModal({
  open,
  title,
  description,
  buttonText,
  onClose,
}: StatusModalProps) {
  const t = useTranslations("common");

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center rounded-2xl px-6 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-tag text-primary">
          <CircleCheckBig size={32} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-foreground">
          {title ?? t("success")}
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-foreground/60 md:text-base">
          {description}
        </p>

        <Button
          type="button"
          onClick={onClose}
          background="bg-background"
          color="text-primary"
          className="mt-6 border border-primary"
        >
          {buttonText ?? t("close")}
        </Button>
      </div>
    </Modal>
  );
}
