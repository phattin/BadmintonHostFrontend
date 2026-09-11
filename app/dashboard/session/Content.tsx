"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  CalendarClock,
  ChevronDown,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import EmptyListState from "@/app/components/EmptyListState";
import ListToolbar from "@/app/components/ListToolbar";
import ManagementListCard from "@/app/components/ManagementListCard";
import ManagementPage from "@/app/components/ManagementPage";
import Button from "@/app/components/ui/Button";
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

const statusStyle: Record<SessionStatus, string> = {
  DRAFT: "bg-foreground/10 text-foreground/70",
  OPEN: "bg-placeholder text-primary",
  IN_PROGRESS: "bg-primary text-surface",
  FINISHED: "bg-primary/15 text-primary",
  SETTLED: "bg-tag text-primary",
  CLOSED: "bg-foreground/15 text-foreground/60",
};

export default function Content() {
  const router = useRouter();
  const t = useTranslations("sessions");
  const tDialog = useTranslations("dialog");
  const getStatusLabel = (status: SessionStatus) =>
    t(
      status === "DRAFT"
        ? "draft"
        : status === "OPEN"
          ? "open"
          : status === "IN_PROGRESS"
            ? "inProgress"
            : status === "FINISHED"
              ? "finished"
              : status === "SETTLED"
                ? "settled"
                : "closed",
    );

  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  /* SEARCH INPUT */
  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] = useState<StatusFilter>("ALL");

  /* APPLIED FILTER */
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesSearch =
        !keyword ||
        session.venueName.toLowerCase().includes(keyword) ||
        session.address.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const hasActiveFilter = searchQuery.trim() !== "" || statusFilter !== "ALL";

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setStatusFilter(statusInput);
  };

  const handleOpenCreateSession = () => {
    router.push("/dashboard/session/new");
  };

  const handleViewSession = (sessionId: number) => {
    router.push(`/dashboard/session/${sessionId}`);
  };

  const handleEditSession = (sessionId: number) => {
    router.push(`/dashboard/session/${sessionId}/edit`);
  };

  const handleDeleteSession = () => {
    if (!sessionToDelete) return;

    setSessions((prev) =>
      prev.filter((session) => session.id !== sessionToDelete.id),
    );

    setSessionToDelete(null);
    setSuccessMessage(t("deleted"));
  };

  const formatPrice = (price: number) => {
    if (!price) return "—";

    return `${price.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <ManagementPage
      title={t("title")}
      description={t("description")}
      action={
        <Button
          type="button"
          onClick={handleOpenCreateSession}
          className="md:w-fit md:px-6"
        >
          <Plus size={17} />
          {t("plan")}
        </Button>
      }
      toolbar={
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder={t("search")}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
        >
          {/* STATUS FILTER */}
          <div className="relative w-full sm:w-45">
            <select
              value={statusInput}
              onChange={(event) =>
                setStatusInput(event.target.value as StatusFilter)
              }
              className="w-full cursor-pointer appearance-none rounded-lg border border-placeholder bg-surface py-3 pr-10 pl-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">{t("allStatus")}</option>
              <option value="DRAFT">{t("draft")}</option>
              <option value="OPEN">{t("open")}</option>
              <option value="IN_PROGRESS">{t("inProgress")}</option>
              <option value="FINISHED">{t("finished")}</option>
              <option value="SETTLED">{t("settled")}</option>
              <option value="CLOSED">{t("closed")}</option>
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-placeholder"
            />
          </div>
        </ListToolbar>
      }
    >
      {/* SESSION LIST */}
      <ManagementListCard>
        {/* DESKTOP */}
        <div className="hidden overflow-hidden lg:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.7fr_0.7fr_0.6fr_0.9fr_0.9fr_1.1fr_0.9fr_0.6fr] bg-tag px-5 py-4 text-sm font-semibold">
            <span>{t("addressVenue")}</span>
            <span>{t("slot")}</span>
            <span>{t("courts")}</span>
            <span>{t("priceMale")}</span>
            <span>{t("priceFemale")}</span>
            <span>{t("time")}</span>
            <span>{t("status")}</span>
            <span className="text-center">{t("actions")}</span>
          </div>

          {/* TABLE BODY */}
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="grid grid-cols-[1.7fr_0.7fr_0.6fr_0.9fr_0.9fr_1.1fr_0.9fr_0.6fr] items-center border-b border-foreground/20 px-5 py-5 last:border-b-0"
              >
                {/* VENUE */}
                <div className="min-w-0">
                  <p className="truncate font-semibold">{session.venueName}</p>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground/60">
                    <MapPin size={11} />

                    <span className="truncate">{session.address}</span>
                  </div>
                </div>

                {/* SLOT */}
                <div>
                  <span className="text-sm font-semibold">
                    {session.currentSlots}/{session.maxSlots}
                  </span>
                </div>

                {/* COURT */}
                <span className="text-sm">{session.totalCourt}</span>

                {/* PRICE MALE */}
                <span className="text-sm">
                  {formatPrice(session.priceMale)}
                </span>

                {/* PRICE FEMALE */}
                <span className="text-sm">
                  {formatPrice(session.priceFemale)}
                </span>

                {/* TIME */}
                <div>
                  <p className="text-sm font-semibold">
                    {session.startTime} - {session.endTime}
                  </p>

                  <p className="mt-1 text-xs text-foreground/60">
                    {session.date}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[session.status]}`}
                  >
                    {getStatusLabel(session.status)}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`View ${session.venueName}`}
                    onClick={() => handleViewSession(session.id)}
                    className="cursor-pointer text-foreground transition hover:opacity-60"
                  >
                    <Eye size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Edit ${session.venueName}`}
                    onClick={() => handleEditSession(session.id)}
                    className="cursor-pointer text-primary transition hover:opacity-60"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${session.venueName}`}
                    onClick={() => setSessionToDelete(session)}
                    className="cursor-pointer text-colorWrong transition hover:opacity-60"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<CalendarClock size={24} />}
              title={hasActiveFilter ? t("noResults") : t("noItems")}
              description={hasActiveFilter ? t("trySearch") : t("planFirst")}
            />
          )}
        </div>

        {/* MOBILE / TABLET */}
        <div className="flex flex-col gap-3 p-3 lg:hidden">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-foreground/20 bg-surface p-4"
              >
                {/* MOBILE HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-tag text-primary">
                      <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {session.venueName}
                      </h3>

                      <p className="mt-1 text-sm text-foreground/60">
                        {session.address}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[session.status]}`}
                  >
                    {getStatusLabel(session.status)}
                  </span>
                </div>

                {/* MOBILE INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  {/* SLOT */}
                  <div>
                    <p className="text-xs text-foreground/60">{t("slot")}</p>

                    <p className="mt-1 font-semibold">
                      {session.currentSlots}/{session.maxSlots}
                    </p>
                  </div>

                  {/* COURT */}
                  <div>
                    <p className="text-xs text-foreground/60">{t("courts")}</p>

                    <p className="mt-1 font-semibold text-primary">
                      {session.totalCourt}
                    </p>
                  </div>

                  {/* PRICE MALE */}
                  <div>
                    <p className="text-xs text-foreground/60">
                      {t("priceMale")}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(session.priceMale)}
                    </p>
                  </div>

                  {/* PRICE FEMALE */}
                  <div>
                    <p className="text-xs text-foreground/60">
                      {t("priceFemale")}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(session.priceFemale)}
                    </p>
                  </div>

                  {/* SCHEDULE */}
                  <div className="col-span-2">
                    <p className="text-xs text-foreground/60">
                      {t("schedule")}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold">
                      <CalendarClock size={14} />

                      <span>
                        {session.startTime} - {session.endTime}
                      </span>

                      <span className="font-normal text-foreground/60">
                        {session.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewSession(session.id)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-placeholder px-3 py-2 text-sm text-foreground transition hover:opacity-60"
                  >
                    <Eye size={14} />
                    {t("view")}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditSession(session.id)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-primary transition hover:opacity-60"
                  >
                    <Pencil size={14} />
                    {t("edit")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSessionToDelete(session)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-colorWrong/30 px-3 py-2 text-sm text-colorWrong transition hover:opacity-60"
                  >
                    <Trash2 size={14} />
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<CalendarClock size={24} />}
              title={hasActiveFilter ? t("noResults") : t("noItems")}
              description={hasActiveFilter ? t("trySearch") : t("planFirst")}
            />
          )}
        </div>
      </ManagementListCard>

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        open={sessionToDelete !== null}
        title={tDialog("titleDelete")}
        description={tDialog("sessionDescription")}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleDeleteSession}
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
