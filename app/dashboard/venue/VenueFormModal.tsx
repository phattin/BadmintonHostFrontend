"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { X } from "lucide-react";

import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Modal from "@/app/components/ui/Modal";
import Textarea from "@/app/components/ui/TextArea";

export interface VenueFormData {
  name: string;
  address: string;
  price: string;
  note: string;
}

interface VenueFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: VenueFormData;
  onClose: () => void;
  onSubmit: (data: VenueFormData) => void;
}

const emptyVenue: VenueFormData = {
  name: "",
  address: "",
  price: "",
  note: "",
};

export default function VenueFormModal({
  open,
  mode = "add",
  initialData,
  onClose,
  onSubmit,
}: VenueFormModalProps) {
  const t = useTranslations("venueForm");
  const common = useTranslations("common");
  const [formData, setFormData] = useState<VenueFormData>(emptyVenue);

  useEffect(() => {
    if (!open) return;

    setFormData(initialData ?? emptyVenue);
  }, [open, initialData]);

  const handleChange = (field: keyof VenueFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const title = mode === "add" ? t("addTitle") : t("editTitle");
  const buttonText = mode === "add" ? t("addTitle") : common("saveChanges");

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className="flex items-center bg-background justify-between border-b border-foreground/40 px-3 py-4 md:px-6 sticky top-0 z-10">
          <h3 className="text-xl font-bold">{title}</h3>

          <button
            type="button"
            aria-label={common("close")}
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-600 transition hover:bg-primary hover:text-surface"
          >
            <X size={19} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-5 pb-6 md:px-6">
          <Input
            id="venue-name"
            label={t("name")}
            placeholder={t("namePlaceholder")}
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
          />

          <Input
            id="venue-address"
            label={t("address")}
            placeholder={t("addressPlaceholder")}
            value={formData.address}
            onChange={(event) => handleChange("address", event.target.value)}
            required
          />

          <Input
            id="venue-price"
            label={t("referencePrice")}
            type="number"
            min={0}
            placeholder={t("pricePlaceholder")}
            value={formData.price}
            onChange={(event) => handleChange("price", event.target.value)}
          />

          <Textarea
            id="venue-note"
            label={t("note")}
            placeholder={t("notePlaceholder")}
            value={formData.note}
            onChange={(event) => handleChange("note", event.target.value)}
          />

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={onClose}
              background="bg-surface"
              color="color-foreground"
              className="border border-tag"
            >
              {common("cancel")}
            </Button>

            <Button type="submit">{buttonText}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
