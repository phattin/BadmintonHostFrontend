"use client";

import { useMemo, useState } from "react";

import { ChevronDown, Pencil, Phone, Trash2, UserPlus, Users } from "lucide-react";

import ListToolbar from "@/app/components/ListToolbar";
import WhiteCard from "@/app/components/WhiteCard";
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

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);

  const [participantToDelete, setParticipantToDelete] =
    useState<Participant | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredParticipants = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return participants.filter((participant) => {
      const matchesSearch =
        !keyword ||
        participant.name.toLowerCase().includes(keyword) ||
        participant.phone?.toLowerCase().includes(keyword);

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
      prev.filter(
        (participant) => participant.id !== participantToDelete.id,
      ),
    );

    setParticipantToDelete(null);
    setSuccessMessage("Participant deleted successfully.");
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-5 bg-bg p-5 pb-24 md:gap-8 md:p-8 md:pb-26 lg:pb-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1>Participant Management</h1>

          <p className="mt-1 text-sm text-gray-600 md:text-base">
            Manage players participating in your sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-text px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <UserPlus size={17} />
          Add Participant
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <WhiteCard padding="p-0">
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder="Search name or phone..."
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
              className="w-full cursor-pointer appearance-none rounded-lg border border-placeholder bg-white py-3 pr-10 pl-3 text-sm text-text outline-none focus:border-button focus:ring-2 focus:ring-button/20"
            >
              <option value="ALL">All Genders</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
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
              className="w-full cursor-pointer appearance-none rounded-lg border border-placeholder bg-white py-3 pr-10 pl-3 text-sm text-text outline-none focus:border-button focus:ring-2 focus:ring-button/20"
            >
              <option value="ALL">All Levels</option>
  
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
      </WhiteCard>

      {/* PARTICIPANT LIST */}
      <WhiteCard padding="p-0" className="flex-col items-stretch">
        {/* DESKTOP / TABLET */}
        <div className="hidden overflow-hidden md:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.5fr_1.2fr_0.8fr_0.8fr_0.6fr] bg-main0 px-5 py-4 text-sm font-semibold text-gray-700">
            <span>Name</span>
            <span>Phone</span>
            <span>Gender</span>
            <span>Level</span>
            <span className="text-center">Actions</span>
          </div>

          {/* TABLE BODY */}
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="grid grid-cols-[1.5fr_1.2fr_0.8fr_0.8fr_0.6fr] items-center border-b border-gray-100 px-5 py-6 last:border-b-0"
              >
                {/* NAME */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-placeholder font-semibold text-text">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="truncate font-semibold text-gray-900">
                    {participant.name}
                  </span>
                </div>

                {/* PHONE */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {participant.phone ? (
                    <>
                      <Phone size={14} />
                      <span>{participant.phone}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>

                {/* GENDER */}
                <span className="text-sm text-gray-600">
                  {genderLabel[participant.gender]}
                </span>

                {/* LEVEL */}
                <div>
                  <span className="rounded-full bg-bg px-3 py-1.5 text-xs font-semibold text-text">
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
                    className="cursor-pointer text-gray-600 transition hover:text-text"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${participant.name}`}
                    onClick={() => setParticipantToDelete(participant)}
                    className="cursor-pointer text-red-500 transition hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-16">
              <div className="flex size-14 items-center justify-center rounded-full bg-bg text-text">
                <Users size={24} />
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                {hasActiveFilter
                  ? "No participants found"
                  : "No participants yet"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {hasActiveFilter
                  ? "Try changing your search or filters."
                  : "Add your first participant to this session."}
              </p>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-3 p-3 md:hidden">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="rounded-xl border border-gray-100 bg-white p-4"
              >
                {/* HEADER */}
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-placeholder text-lg font-semibold text-text">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {participant.name}
                    </h3>

                    {participant.phone ? (
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <Phone size={13} />
                        {participant.phone}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        No phone number
                      </p>
                    )}
                  </div>
                </div>

                {/* INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>

                    <p className="mt-1 text-sm font-semibold">
                      {genderLabel[participant.gender]}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Level</p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {participant.level === "NEWBIE"
                        ? "Newbie"
                        : participant.level}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(participant)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-bg"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setParticipantToDelete(participant)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex size-14 items-center justify-center rounded-full bg-bg text-text">
                <Users size={24} />
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                {hasActiveFilter
                  ? "No participants found"
                  : "No participants yet"}
              </p>

              <p className="mt-1 text-center text-sm text-gray-500">
                {hasActiveFilter
                  ? "Try changing your search or filters."
                  : "Add your first participant to get started."}
              </p>
            </div>
          )}
        </div>
      </WhiteCard>

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

      {/* DELETE */}
      <ConfirmModal
        open={participantToDelete !== null}
        title="Confirm deletion?"
        description={`Are you sure you want to delete participant "${
          participantToDelete?.name ?? ""
        }"? This action cannot be undone.`}
        onClose={() => setParticipantToDelete(null)}
        onConfirm={handleDelete}
      />

      {/* SUCCESS */}
      <StatusModal
        open={successMessage !== null}
        description={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
    </div>
  );
}