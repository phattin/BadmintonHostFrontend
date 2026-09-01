"use client";

import { FormEvent, useEffect, useState } from "react";

import { MapPin, X } from "lucide-react";

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

  const title = mode === "add" ? "Add venue" : "Edit venue";
  const buttonText = mode === "add" ? "Add venue" : "Save changes";

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-placeholder/40 px-3 py-4 md:px-6">
          <h3 className="text-xl font-bold text-text">{title}</h3>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-600 transition hover:bg-bg hover:text-text"
          >
            <X size={19} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-5 pb-6 md:px-6">
          <Input
            id="venue-name"
            label="Venue name"
            placeholder="e.g. Downtown Badminton Center"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
          />

          <Input
            id="venue-address"
            label="Address"
            placeholder="Enter the full address"
            icon={<MapPin size={16} />}
            value={formData.address}
            onChange={(event) => handleChange("address", event.target.value)}
            required
          />

          <Input
            id="venue-price"
            label="Reference price (VND/hour)"
            type="number"
            min={0}
            placeholder="e.g. 150,000"
            value={formData.price}
            onChange={(event) => handleChange("price", event.target.value)}
          />

          <Textarea
            id="venue-note"
            label="Note"
            placeholder="Additional information (if any)"
            value={formData.note}
            onChange={(event) => handleChange("note", event.target.value)}
          />

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={onClose}
              background="bg-white"
              color="text-text"
              className="border border-placeholder"
            >
              Cancel
            </Button>

            <Button type="submit">{buttonText}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
