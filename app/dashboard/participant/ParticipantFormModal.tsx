"use client";

import { FormEvent, useEffect, useState } from "react";

import { Phone, User, X } from "lucide-react";

import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Modal from "@/app/components/ui/Modal";
import Select from "@/app/components/ui/Select";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type PlayerLevel =
  | "NEWBIE"
  | "Y-"
  | "Y"
  | "Y+"
  | "TBY-"
  | "TBY"
  | "TBY+"
  | "TB-"
  | "TB"
  | "TB+"
  | "TBK";

export interface ParticipantFormData {
  name: string;
  phone: string;
  gender: Gender;
  level: PlayerLevel;
}

interface ParticipantFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: ParticipantFormData;
  onClose: () => void;
  onSubmit: (data: ParticipantFormData) => void;
}

const emptyForm: ParticipantFormData = {
  name: "",
  phone: "",
  gender: "MALE",
  level: "NEWBIE",
};

export default function ParticipantFormModal({
  open,
  mode = "add",
  initialData,
  onClose,
  onSubmit,
}: ParticipantFormModalProps) {
  const [formData, setFormData] =
    useState<ParticipantFormData>(emptyForm);

  useEffect(() => {
    if (!open) return;

    setFormData(initialData ?? emptyForm);
  }, [open, initialData]);

  const handleChange = (
    field: keyof ParticipantFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    });
  };

  const title =
    mode === "add" ? "Add participant" : "Edit participant";

  const buttonText =
    mode === "add" ? "Add participant" : "Save changes";

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
              Manage participant information.
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
            id="participant-name"
            label="Participant name"
            placeholder="e.g. John Smith"
            icon={<User size={16} />}
            value={formData.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
            required
          />

          <Input
            id="participant-phone"
            label="Phone number"
            type="tel"
            placeholder="e.g. 0901234567"
            icon={<Phone size={16} />}
            value={formData.phone}
            onChange={(event) =>
              handleChange("phone", event.target.value)
            }
          />

          <div className="grid gap-0 sm:grid-cols-2 sm:gap-4">
            <Select
              id="participant-gender"
              label="Gender"
              value={formData.gender}
              onChange={(event) =>
                handleChange("gender", event.target.value)
              }
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>

            <Select
              id="participant-level"
              label="Level"
              value={formData.level}
              onChange={(event) =>
                handleChange("level", event.target.value)
              }
            >
              <option value="NEWBIE">Newbie</option>
              <option value="Y-">Y-</option>
              <option value="Y">Y</option>
              <option value="Y+">Y+</option>
              <option value="TBY-">TBY-</option>
              <option value="TBY">TBY</option>
              <option value="TBY+">TBY+</option>
              <option value="TB-">TB-</option>
              <option value="TB">TB</option>
              <option value="TB+">TB+</option>
              <option value="TBK">TBK</option>
            </Select>
          </div>

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