"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  ChevronDown,
  Pencil,
  Phone,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import EmptyListState from "@/app/components/EmptyListState";
import ListToolbar from "@/app/components/ListToolbar";
import ManagementListCard from "@/app/components/ManagementListCard";
import ManagementPage from "@/app/components/ManagementPage";
import Button from "@/app/components/ui/Button";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import StatusModal from "@/app/components/ui/StatusModal";

import ParticipantFormModal, {
  Gender,
  ParticipantFormData,
  PlayerLevel,
} from "./ParticipantFormModal";

interface Participant {
  id: number;
  sessionId: number;
  name: string;
  phone: string | null;
  gender: Gender;
  level: PlayerLevel;
}

type GenderFilter = Gender | "ALL";
type LevelFilter = PlayerLevel | "ALL";

const initialParticipants: Participant[] = [
  {
    id: 1,
    sessionId: 1,
    name: "Nguyễn Văn An",
    phone: "0901234567",
    gender: "MALE",
    level: "TBY",
  },
  {
    id: 2,
    sessionId: 1,
    name: "Trần Minh Anh",
    phone: "0987654321",
    gender: "FEMALE",
    level: "Y+",
  },
  {
    id: 3,
    sessionId: 1,
    name: "Lê Hoàng Nam",
    phone: null,
    gender: "MALE",
    level: "TB-",
  },
];

const genderLabel: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const levelOptions: PlayerLevel[] = [
  "NEWBIE",
  "Y-",
  "Y",
  "Y+",
  "TBY-",
  "TBY",
  "TBY+",
  "TB-",
  "TB",
  "TB+",
  "TBK",
];

export default function Content() {
  const t = useTranslations("participants");
  const tDialog = useTranslations("dialog");
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);

  /* SEARCH INPUT */
  const [searchInput, setSearchInput] = useState("");
  const [genderInput, setGenderInput] = useState<GenderFilter>("ALL");
  const [levelInput, setLevelInput] = useState<LevelFilter>("ALL");

  /* APPLIED FILTER */
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("ALL");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("ALL");

  /* FORM */
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);

  /* DELETE */
  const [participantToDelete, setParticipantToDelete] =
    useState<Participant | null>(null);

  /* STATUS */
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredParticipants = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return participants.filter((participant) => {
      const matchesSearch =
        !keyword ||
        participant.name.toLowerCase().includes(keyword) ||
        (participant.phone?.toLowerCase().includes(keyword) ?? false);

      const matchesGender =
        genderFilter === "ALL" || participant.gender === genderFilter;

      const matchesLevel =
        levelFilter === "ALL" || participant.level === levelFilter;

      return matchesSearch && matchesGender && matchesLevel;
    });
  }, [participants, searchQuery, genderFilter, levelFilter]);

  const hasActiveFilter =
    searchQuery.trim() !== "" ||
    genderFilter !== "ALL" ||
    levelFilter !== "ALL";

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setGenderFilter(genderInput);
    setLevelFilter(levelInput);
  };

  const handleOpenAdd = () => {
    setEditingParticipant(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingParticipant(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (data: ParticipantFormData) => {
    const phone = data.phone.trim() || null;

    if (editingParticipant) {
      setParticipants((prev) =>
        prev.map((participant) =>
          participant.id === editingParticipant.id
            ? {
                ...participant,
                name: data.name,
                phone,
                gender: data.gender,
                level: data.level,
              }
            : participant,
        ),
      );

      setSuccessMessage("Participant updated successfully.");
    } else {
      const newParticipant: Participant = {
        id: Date.now(),
        sessionId: 1,
        name: data.name,
        phone,
        gender: data.gender,
        level: data.level,
      };

      setParticipants((prev) => [...prev, newParticipant]);

      setSuccessMessage("Participant added successfully.");
    }

    handleCloseForm();
  };

  const handleDelete = () => {
    if (!participantToDelete) return;

    setParticipants((prev) =>
      prev.filter((participant) => participant.id !== participantToDelete.id),
    );

    setParticipantToDelete(null);

    setSuccessMessage("Participant deleted successfully.");
  };

  return (
    <ManagementPage
      title={t("title")}
      description={t("description")}
      action={
        <Button
          type="button"
          onClick={handleOpenAdd}
          className="md:w-fit md:px-6"
        >
          <UserPlus size={17} />
          {t("add")}
        </Button>
      }
      toolbar={
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder={t("search")}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
        >
          {/* GENDER FILTER */}
          <div className="relative w-full sm:w-40">
            <select
              value={genderInput}
              onChange={(event) =>
                setGenderInput(event.target.value as GenderFilter)
              }
              className="w-full cursor-pointer appearance-none rounded-lg border border-placeholder bg-surface py-3 pr-10 pl-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">{t("gender")}</option>

              <option value="MALE">{t("gender")}</option>

              <option value="FEMALE">{t("gender")}</option>

              <option value="OTHER">{t("gender")}</option>
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-placeholder"
            />
          </div>

          {/* LEVEL FILTER */}
          <div className="relative w-full sm:w-40">
            <select
              value={levelInput}
              onChange={(event) =>
                setLevelInput(event.target.value as LevelFilter)
              }
              className="w-full cursor-pointer appearance-none rounded-lg border border-placeholder bg-surface py-3 pr-10 pl-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">{t("level")}</option>

              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level === "NEWBIE" ? "Newbie" : level}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-placeholder"
            />
          </div>
        </ListToolbar>
      }
    >
      {/* PARTICIPANT LIST */}
      <ManagementListCard>
        {/* DESKTOP / TABLET */}
        <div className="hidden overflow-hidden md:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.5fr_1.2fr_0.8fr_0.8fr_0.6fr] bg-tag px-5 py-4 text-sm font-semibold">
            <span>{t("name")}</span>
            <span>{t("phone")}</span>
            <span>{t("gender")}</span>
            <span>{t("level")}</span>
            <span className="text-center">{t("actions")}</span>
          </div>

          {/* TABLE BODY */}
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="grid grid-cols-[1.5fr_1.2fr_0.8fr_0.8fr_0.6fr] items-center border-b border-foreground/20 px-5 py-6 last:border-b-0"
              >
                {/* NAME */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tag font-semibold text-primary">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="truncate font-semibold">
                    {participant.name}
                  </span>
                </div>

                {/* PHONE */}
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  {participant.phone ? (
                    <>
                      <Phone size={14} />

                      <span>{participant.phone}</span>
                    </>
                  ) : (
                    <span className="text-foreground/40">—</span>
                  )}
                </div>

                {/* GENDER */}
                <span className="text-sm text-foreground/70">
                  {genderLabel[participant.gender]}
                </span>

                {/* LEVEL */}
                <div>
                  <span className="inline-flex rounded-full bg-tag px-3 py-1.5 text-xs font-semibold text-primary">
                    {participant.level === "NEWBIE"
                      ? "Newbie"
                      : participant.level}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`Edit ${participant.name}`}
                    onClick={() => handleOpenEdit(participant)}
                    className="cursor-pointer text-primary transition hover:opacity-60"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${participant.name}`}
                    onClick={() => setParticipantToDelete(participant)}
                    className="cursor-pointer text-colorWrong transition hover:opacity-60"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<Users size={24} />}
              title={
                hasActiveFilter
                  ? "No participants found"
                  : "No participants yet"
              }
              description={
                hasActiveFilter
                  ? "Try changing your search or filters."
                  : "Add your first participant to get started."
              }
            />
          )}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-3 p-3 md:hidden">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="rounded-xl border border-foreground/20 bg-surface p-4"
              >
                {/* MOBILE HEADER */}
                <div className="flex items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-tag text-lg font-semibold text-primary">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {participant.name}
                    </h3>

                    {participant.phone ? (
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground/60">
                        <Phone size={13} />

                        <span>{participant.phone}</span>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-foreground/40">
                        No phone number
                      </p>
                    )}
                  </div>
                </div>

                {/* INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  {/* GENDER */}
                  <div>
                    <p className="text-xs text-foreground/60">Gender</p>

                    <p className="mt-1 text-sm font-semibold">
                      {genderLabel[participant.gender]}
                    </p>
                  </div>

                  {/* LEVEL */}
                  <div>
                    <p className="text-xs text-foreground/60">Level</p>

                    <p className="mt-1 text-sm font-semibold text-primary">
                      {participant.level === "NEWBIE"
                        ? "Newbie"
                        : participant.level}
                    </p>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(participant)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-primary transition hover:opacity-60"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setParticipantToDelete(participant)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-colorWrong/30 px-3 py-2 text-sm text-colorWrong transition hover:opacity-60"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<Users size={24} />}
              title={
                hasActiveFilter
                  ? "No participants found"
                  : "No participants yet"
              }
              description={
                hasActiveFilter
                  ? "Try changing your search or filters."
                  : "Add your first participant to get started."
              }
              className="py-12"
            />
          )}
        </div>
      </ManagementListCard>

      {/* ADD / EDIT */}
      <ParticipantFormModal
        open={isFormOpen}
        mode={editingParticipant ? "edit" : "add"}
        initialData={
          editingParticipant
            ? {
                name: editingParticipant.name,
                phone: editingParticipant.phone ?? "",
                gender: editingParticipant.gender,
                level: editingParticipant.level,
              }
            : undefined
        }
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        open={participantToDelete !== null}
        title={tDialog("titleDelete")}
        description={tDialog("participantDescription", {
          name: participantToDelete?.name ?? "",
        })}
        onClose={() => setParticipantToDelete(null)}
        onConfirm={handleDelete}
      />

      {/* SUCCESS */}
      <StatusModal
        open={successMessage !== null}
        description={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
    </ManagementPage>
  );
}
