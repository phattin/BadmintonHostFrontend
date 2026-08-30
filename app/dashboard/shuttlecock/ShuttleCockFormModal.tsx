"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Package, X } from "lucide-react";

import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Modal from "@/app/components/ui/Modal";

export interface ShuttleCockFormData {
  name: string;
  quantity: string;
  pricePerTube: string;
  shuttlecocksPerTube: string;
}

interface ShuttleCockFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: ShuttleCockFormData;
  onClose: () => void;
  onSubmit: (data: ShuttleCockFormData) => void;
}

const emptyForm: ShuttleCockFormData = {
  name: "",
  quantity: "",
  pricePerTube: "",
  shuttlecocksPerTube: "12",
};

export default function ShuttleCockFormModal({
  open,
  mode = "add",
  initialData,
  onClose,
  onSubmit,
}: ShuttleCockFormModalProps) {
  const [formData, setFormData] =
    useState<ShuttleCockFormData>(emptyForm);

  useEffect(() => {
    if (!open) return;

    setFormData(initialData ?? emptyForm);
  }, [open, initialData]);

  const pricePerShuttlecock = useMemo(() => {
    const pricePerTube = Number(formData.pricePerTube);
    const shuttlecocksPerTube = Number(formData.shuttlecocksPerTube);

    if (pricePerTube <= 0 || shuttlecocksPerTube <= 0) {
      return 0;
    }

    return pricePerTube / shuttlecocksPerTube;
  }, [formData.pricePerTube, formData.shuttlecocksPerTube]);

  const handleChange = (
    field: keyof ShuttleCockFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(formData);
  };

  const title = mode === "add" ? "Add shuttlecock" : "Edit shuttlecock";
  const buttonText = mode === "add" ? "Add shuttlecock" : "Save changes";

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg">
      <form onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-placeholder/40 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold text-text md:text-2xl">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage shuttlecock information and pricing.
            </p>
          </div>

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
            id="shuttlecock-name"
            label="Shuttlecock name"
            placeholder="e.g. Yonex Aerosensa 30"
            icon={<Package size={16} />}
            value={formData.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
            required
          />

          <Input
            id="shuttlecock-quantity"
            label="Quantity received"
            type="number"
            min={1}
            placeholder="e.g. 10"
            value={formData.quantity}
            onChange={(event) =>
              handleChange("quantity", event.target.value)
            }
            required
          />

          <Input
            id="shuttlecock-price"
            label="Price per tube (VND)"
            type="number"
            min={0}
            placeholder="e.g. 360000"
            value={formData.pricePerTube}
            onChange={(event) =>
              handleChange("pricePerTube", event.target.value)
            }
            required
          />

          <Input
            id="shuttlecock-per-tube"
            label="Shuttlecocks per tube"
            type="number"
            min={1}
            value={formData.shuttlecocksPerTube}
            onChange={(event) =>
              handleChange(
                "shuttlecocksPerTube",
                event.target.value,
              )
            }
            required
          />

          {/* CALCULATED PRICE */}
          <div className="mt-5 rounded-xl border border-placeholder bg-bg p-4">
            <p className="text-sm text-gray-500">
              Auto-calculated price per shuttlecock
            </p>

            <p className="mt-1 text-xl font-bold text-text">
              {Math.round(pricePerShuttlecock).toLocaleString("vi-VN")} VNĐ
            </p>

            {pricePerShuttlecock > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {Number(formData.pricePerTube).toLocaleString("vi-VN")} ÷{" "}
                {formData.shuttlecocksPerTube} shuttlecocks
              </p>
            )}
          </div>

          {/* BUTTONS */}
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