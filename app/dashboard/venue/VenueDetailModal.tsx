"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import Button from "@/app/components/ui/Button";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import Input from "@/app/components/ui/Input";
import Modal from "@/app/components/ui/Modal";
import StatusModal from "@/app/components/ui/StatusModal";

export interface VenueDetail {
  id: number;
  name: string;
  address: string;
  price: string;
  note: string;
  image: string | null;
}

export interface Court {
  id: number;
  venueId: number;
  code: string;
  name: string;
  status: string;
}

export interface CourtFormData {
  code: string;
  name: string;
  status: string;
}

interface VenueDetailModalProps {
  open: boolean;
  venue: VenueDetail | null;
  courts: Court[];
  onClose: () => void;
  onAddCourt: (venueId: number, data: CourtFormData) => void;
  onUpdateCourt: (courtId: number, data: CourtFormData) => void;
  onDeleteCourt: (courtId: number) => void;
}

const emptyCourtForm: CourtFormData = {
  code: "",
  name: "",
  status: "AVAILABLE",
};

export default function VenueDetailModal({
  open,
  venue,
  courts,
  onClose,
  onAddCourt,
  onUpdateCourt,
  onDeleteCourt,
}: VenueDetailModalProps) {
  const t = useTranslations("venueDetail");
  const [courtForm, setCourtForm] = useState<CourtFormData>(emptyCourtForm);

  const [editingCourtId, setEditingCourtId] = useState<number | null>(null);

  const [courtToDelete, setCourtToDelete] = useState<Court | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setCourtForm(emptyCourtForm);
    setEditingCourtId(null);
    setCourtToDelete(null);
  }, [open, venue?.id]);

  if (!venue) return null;

  const venueCourts = courts.filter((court) => court.venueId === venue.id);

  const handleCourtChange = (field: keyof CourtFormData, value: string) => {
    setCourtForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetCourtForm = () => {
    setCourtForm(emptyCourtForm);
    setEditingCourtId(null);
  };

  const handleSubmitCourt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!courtForm.code.trim() || !courtForm.name.trim()) {
      return;
    }

    const data: CourtFormData = {
      code: courtForm.code.trim(),
      name: courtForm.name.trim(),
      status: courtForm.status,
    };

    if (editingCourtId !== null) {
      onUpdateCourt(editingCourtId, data);
      setSuccessMessage("Cập nhật sân thành công.");
    } else {
      onAddCourt(venue.id, data);
      setSuccessMessage("Thêm sân thành công.");
    }

    resetCourtForm();
  };

  const handleEditCourt = (court: Court) => {
    setEditingCourtId(court.id);

    setCourtForm({
      code: court.code,
      name: court.name,
      status: court.status,
    });
  };

  const handleDeleteCourt = () => {
    if (!courtToDelete) return;

    onDeleteCourt(courtToDelete.id);

    setCourtToDelete(null);
    setSuccessMessage("Xóa sân thành công.");

    if (editingCourtId === courtToDelete.id) {
      resetCourtForm();
    }
  };

  const handleClose = () => {
    resetCourtForm();
    setCourtToDelete(null);
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} className="max-w-3xl">
        {/* HEADER */}
        <div className="flex items-start bg-background justify-between border-b border-foreground/40 px-5 py-4 md:px-6 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">{t("title")}</h2>

            <p className="mt-1 text-foreground/60 text-sm">
              {t("description")}
            </p>
          </div>

          <button
            type="button"
            aria-label={t("close")}
            onClick={handleClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-primary hover:text-surface"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5 md:px-6">
          {/* VENUE INFORMATION */}
          <div>
            <div className="grid gap-4 rounded-xl sm:grid-cols-2">
              {/* NAME */}
              <div>
                <p className="text-xs font-medium">{t("venueName")}</p>

                <p className="mt-1 font-semibold">{venue.name}</p>
              </div>

              {/* PRICE */}
              <div>
                <p className="text-xs font-medium">{t("referencePrice")}</p>

                <p className="mt-1 font-semibold">
                  {Number(venue.price).toLocaleString("vi-VN")} VNĐ/hour
                </p>
              </div>

              {/* ADDRESS */}
              <div>
                <p className="text-xs font-medium">{t("address")}</p>

                <div className="mt-1 flex items-start gap-2">
                  <p className="text-sm">{venue.address}</p>
                </div>
              </div>

              {/* NOTE */}
              <div>
                <p className="text-xs font-medium">{t("note")}</p>

                <p className="mt-1 text-sm">{venue.note || t("noNotes")}</p>
              </div>
            </div>
          </div>

          {/* COURTS */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{t("courts")}</h3>

                <p className="mt-1 text-sm">{t("courtsDescription")}</p>
              </div>

              <span className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold">
                {venueCourts.length} Courts
              </span>
            </div>

            {/* ADD / EDIT COURT */}
            <form
              onSubmit={handleSubmitCourt}
              className="mt-4 rounded-xl border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {editingCourtId !== null ? t("editCourt") : t("addCourt")}
                </p>

                {editingCourtId !== null && (
                  <Button
                    type="button"
                    onClick={resetCourtForm}
                    className="cursor-pointer text-sm font-medium transition hover:text-foreground"
                  >
                    {t("cancelEdit")}
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-[0.7fr_1.5fr]">
                <Input
                  id="court-code"
                  label={t("courtCode")}
                  placeholder="VD: A1"
                  value={courtForm.code}
                  onChange={(event) =>
                    handleCourtChange("code", event.target.value)
                  }
                  required
                />

                <Input
                  id="court-name"
                  label={t("courtName")}
                  placeholder="VD: Court Alpha"
                  value={courtForm.name}
                  onChange={(event) =>
                    handleCourtChange("name", event.target.value)
                  }
                  required
                />
              </div>

              <div className="mt-5 flex flex-col gap-1">
                <label
                  htmlFor="court-status"
                  className="text-[14px] font-semibold"
                >
                  {t("status")}
                </label>

                <select
                  id="court-status"
                  value={courtForm.status}
                  onChange={(event) =>
                    handleCourtChange("status", event.target.value)
                  }
                  className="w-full cursor-pointer rounded-lg border bg-surface px-3 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="AVAILABLE">{t("available")}</option>
                  <option value="MAINTENANCE">{t("maintenance")}</option>
                  <option value="INACTIVE">{t("inactive")}</option>
                </select>
              </div>

              <Button
                type="submit"
                className="mt-5"
                icon={editingCourtId === null ? <Plus size={16} /> : undefined}
              >
                {editingCourtId !== null ? t("saveChanges") : t("addCourt")}
              </Button>
            </form>

            {/* COURT LIST */}
            <div className="mt-4 flex flex-col gap-3">
              {venueCourts.length > 0 ? (
                venueCourts.map((court) => (
                  <div
                    key={court.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border bg-surface p-3 transition ${
                      editingCourtId === court.id
                        ? "border-foreground"
                        : "border-foreground/30 hover:border-tag"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                        {court.code}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">{court.name}</p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`size-1.5 rounded-full ${
                              court.status === "AVAILABLE"
                                ? "bg-primary"
                                : court.status === "MAINTENANCE"
                                  ? "bg-colorWrong"
                                  : "bg-forground/50"
                            }`}
                          />

                          <span
                            className={`text-[10px] font-semibold ${
                              court.status === "AVAILABLE"
                                ? "text-primary"
                                : court.status === "MAINTENANCE"
                                  ? "text-colorWrong"
                                  : "text-forground/50"
                            }`}
                          >
                            {court.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Edit ${court.name}`}
                        onClick={() => handleEditCourt(court)}
                        className="cursor-pointer text-primary transition hover:opacity-60"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${court.name}`}
                        onClick={() => setCourtToDelete(court)}
                        className="cursor-pointer text-colorWrong transition hover:opacity-60"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-placeholder p-6 text-center">
                  <p className="text-sm">
                    This venue does not have any courts yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleClose}
            background="bg-bg"
            color="text-text"
            className="border border-placeholder"
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* DELETE COURT */}
      <ConfirmModal
        open={courtToDelete !== null}
        title="Xác nhận xóa?"
        description={`Bạn có chắc chắn muốn xóa sân "${
          courtToDelete?.name ?? ""
        }" không? Hành động này không thể hoàn tác.`}
        onClose={() => setCourtToDelete(null)}
        onConfirm={handleDeleteCourt}
      />

      {/* SUCCESS */}
      <StatusModal
        open={successMessage !== null}
        description={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
    </>
  );
}
