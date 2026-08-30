"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import ListToolbar from "@/app/components/ListToolbar";
import WhiteCard from "@/app/components/WhiteCard";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import StatusModal from "@/app/components/ui/StatusModal";

type SessionStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "FINISHED"
  | "SETTLED"
  | "CLOSED";

interface Session {
  id: number;
  venueName: string;
  address: string;
  currentSlots: number;
  maxSlots: number;
  totalCourt: number;
  priceMale: number;
  priceFemale: number;
  startTime: string;
  endTime: string;
  date: string;
  status: SessionStatus;
}

type StatusFilter = SessionStatus | "ALL";

const initialSessions: Session[] = [
  {
    id: 1,
    venueName: "Smash Arena",
    address: "123 Sports Blvd, District 1",
    currentSlots: 8,
    maxSlots: 12,
    totalCourt: 3,
    priceMale: 150000,
    priceFemale: 120000,
    startTime: "18:00",
    endTime: "20:00",
    date: "2026-08-31",
    status: "OPEN",
  },
  {
    id: 2,
    venueName: "Pro Court Center",
    address: "45 Racket Lane, Northside",
    currentSlots: 16,
    maxSlots: 16,
    totalCourt: 4,
    priceMale: 180000,
    priceFemale: 150000,
    startTime: "16:00",
    endTime: "18:00",
    date: "2026-08-31",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    venueName: "Downtown Shuttles",
    address: "88 City Square, Downtown",
    currentSlots: 0,
    maxSlots: 10,
    totalCourt: 2,
    priceMale: 0,
    priceFemale: 0,
    startTime: "20:00",
    endTime: "22:00",
    date: "2026-09-01",
    status: "DRAFT",
  },
  {
    id: 4,
    venueName: "Eastside Athletics",
    address: "22 East Ave, Industrial Park",
    currentSlots: 18,
    maxSlots: 20,
    totalCourt: 5,
    priceMale: 120000,
    priceFemale: 100000,
    startTime: "10:00",
    endTime: "12:00",
    date: "2026-08-30",
    status: "FINISHED",
  },
];

const statusLabel: Record<SessionStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  FINISHED: "Finished",
  SETTLED: "Settled",
  CLOSED: "Closed",
};

const statusStyle: Record<SessionStatus, string> = {
  DRAFT: "bg-gray-200 text-gray-600",
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-main2 text-text",
  FINISHED: "bg-[#D8EFD9] text-[#49644B]",
  SETTLED: "bg-gray-200 text-gray-600",
  CLOSED: "bg-gray-300 text-gray-600",
};

export default function Content() {
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] =
    useState<StatusFilter>("ALL");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [sessionToDelete, setSessionToDelete] =
    useState<Session | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !keyword ||
        session.venueName.toLowerCase().includes(keyword) ||
        session.address.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const hasActiveFilter =
    searchQuery.trim() !== "" || statusFilter !== "ALL";

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setStatusFilter(statusInput);
  };

  const handleDelete = () => {
    if (!sessionToDelete) return;

    setSessions((prev) =>
      prev.filter(
        (session) => session.id !== sessionToDelete.id,
      ),
    );

    setSessionToDelete(null);
    setSuccessMessage("Session deleted successfully.");
  };

  const formatPrice = (price: number) => {
    if (!price) return "—";

    return `${price.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-5 bg-bg p-5 pb-24 md:gap-8 md:p-8 md:pb-26 lg:pb-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1>Session Management</h1>

          <p className="mt-1 text-sm text-gray-600 md:text-base">
            Manage badminton sessions, schedules and participants.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/session/new")}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-text px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={17} />
          Plan Session
        </button>
      </div>

      {/* SEARCH */}
      <WhiteCard padding="p-0">
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder="Search venue or address..."
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
        >
          <div className="relative w-full sm:w-45">
            <select
              value={statusInput}
              onChange={(event) =>
                setStatusInput(
                  event.target.value as StatusFilter,
                )
              }
              className="w-full cursor-pointer appearance-none rounded-lg border border-placeholder bg-white py-3 pr-10 pl-3 text-sm text-text outline-none focus:border-button focus:ring-2 focus:ring-button/20"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="FINISHED">Finished</option>
              <option value="SETTLED">Settled</option>
              <option value="CLOSED">Closed</option>
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-placeholder"
            />
          </div>
        </ListToolbar>
      </WhiteCard>

      {/* SESSION LIST */}
      <WhiteCard padding="p-0" className="flex-col items-stretch">
        {/* DESKTOP */}
        <div className="hidden overflow-hidden lg:block">
          <div className="grid grid-cols-[1.7fr_0.7fr_0.6fr_0.9fr_0.9fr_1.1fr_0.9fr_0.6fr] bg-main0 px-5 py-4 text-sm font-semibold text-gray-700">
            <span>Address / Venue</span>
            <span>Slot</span>
            <span>Courts</span>
            <span>Price Male</span>
            <span>Price Female</span>
            <span>Time</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="grid grid-cols-[1.7fr_0.7fr_0.6fr_0.9fr_0.9fr_1.1fr_0.9fr_0.6fr] items-center border-b border-gray-100 px-5 py-5 last:border-b-0"
              >
                {/* VENUE */}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {session.venueName}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={11} />
                    <span className="truncate">
                      {session.address}
                    </span>
                  </div>
                </div>

                {/* SLOT */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {session.currentSlots}/{session.maxSlots}
                    </span>
                  </div>
                </div>

                {/* COURT */}
                <span className="text-sm">
                  {session.totalCourt}
                </span>

                {/* PRICE */}
                <span className="text-sm">
                  {formatPrice(session.priceMale)}
                </span>

                <span className="text-sm">
                  {formatPrice(session.priceFemale)}
                </span>

                {/* TIME */}
                <div>
                  <p className="text-sm font-semibold">
                    {session.startTime} - {session.endTime}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {session.date}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[session.status]}`}
                  >
                    {statusLabel[session.status]}
                  </span>
                </div>

                {/* ACTION */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`View ${session.venueName}`}
                    onClick={() =>
                      router.push(
                        `/dashboard/session/${session.id}`,
                      )
                    }
                    className="cursor-pointer text-text transition hover:opacity-60"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Edit ${session.venueName}`}
                    onClick={() =>
                      router.push(
                        `/dashboard/session/${session.id}/edit`,
                      )
                    }
                    className="cursor-pointer text-gray-600 transition hover:text-text"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${session.venueName}`}
                    onClick={() =>
                      setSessionToDelete(session)
                    }
                    className="cursor-pointer text-red-500 transition hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptySession
              filtered={hasActiveFilter}
            />
          )}
        </div>

        {/* MOBILE / TABLET */}
        <div className="flex flex-col gap-3 p-3 lg:hidden">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-gray-100 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {session.venueName}
                    </h3>

                    <div className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">
                      <MapPin
                        size={13}
                        className="mt-0.5 shrink-0"
                      />
                      <span>{session.address}</span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[session.status]}`}
                  >
                    {statusLabel[session.status]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  <div>
                    <p className="text-xs text-gray-500">
                      Slots
                    </p>
                    <p className="mt-1 font-semibold">
                      {session.currentSlots}/{session.maxSlots}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Courts
                    </p>
                    <p className="mt-1 font-semibold text-text">
                      {session.totalCourt}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Male
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(session.priceMale)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Female
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(session.priceFemale)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">
                      Schedule
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock size={14} />
                      {session.startTime} - {session.endTime}
                      <span className="font-normal text-gray-500">
                        {session.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/session/${session.id}`,
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-placeholder px-3 py-2 text-sm text-text"
                  >
                    <Eye size={14} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/dashboard/session/${session.id}/edit`,
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSessionToDelete(session)
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptySession filtered={hasActiveFilter} />
          )}
        </div>
      </WhiteCard>

      <ConfirmModal
        open={sessionToDelete !== null}
        title="Confirm deletion?"
        description={`Are you sure you want to delete the session at "${
          sessionToDelete?.venueName ?? ""
        }"? This action cannot be undone.`}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDelete}
      />

      <StatusModal
        open={successMessage !== null}
        description={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
    </div>
  );
}

function EmptySession({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16">
      <div className="flex size-14 items-center justify-center rounded-full bg-bg text-text">
        <CalendarClock size={24} />
      </div>

      <p className="mt-3 font-semibold text-gray-700">
        {filtered ? "No sessions found" : "No sessions yet"}
      </p>

      <p className="mt-1 text-center text-sm text-gray-500">
        {filtered
          ? "Try changing your search or filters."
          : "Plan your first badminton session."}
      </p>
    </div>
  );
}