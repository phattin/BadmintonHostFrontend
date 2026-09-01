"use client";

import { CircleCheckBig } from "lucide-react";

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
  title = "Success!",
  description,
  buttonText = "Close",
  onClose,
}: StatusModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center rounded-2xl bg-main0 px-6 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-main3 text-text">
          <CircleCheckBig size={32} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-foreground">{title}</h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 md:text-base">
          {description}
        </p>

        <Button
          type="button"
          onClick={onClose}
          background="bg-bg"
          color="text-foreground"
          className="mt-6 border border-placeholder"
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}