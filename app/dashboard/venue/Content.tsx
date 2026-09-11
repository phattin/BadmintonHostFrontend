"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Button from "@/app/components/ui/Button";
import ListToolbar from "@/app/components/ListToolbar";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import StatusModal from "@/app/components/ui/StatusModal";
import ManagementListCard from "@/app/components/ManagementListCard";
import ManagementPage from "@/app/components/ManagementPage";
import EmptyListState from "@/app/components/EmptyListState";
import VenueDetailModal, {
  CourtFormData,
} from "@/app/dashboard/venue/VenueDetailModal";
import VenueFormModal, {
  VenueFormData,
} from "@/app/dashboard/venue/VenueFormModal";
import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";

interface Venue {
  id: number;
  name: string;
  address: string;
  price: string;
  note: string;
  image: string | null;
}

const initialVenues: Venue[] = [
  {
    id: 1,
    name: "Downtown Arena",
    address: "123 Main St, District 1",
    price: "150000",
    note: "Premium lighting",
    image: "/img_login.webp",
  },
  {
    id: 2,
    name: "Westside Park",
    address: "45 Park Ave, District 3",
    price: "120000",
    note: "Outdoor clay",
    image: null,
  },
];

const initialCourts = [
  {
    id: 1,
    venueId: 1,
    code: "A1",
    name: "Court Alpha",
    status: "AVAILABLE",
  },
  {
    id: 2,
    venueId: 1,
    code: "B2",
    name: "Court Beta",
    status: "MAINTENANCE",
  },
  {
    id: 3,
    venueId: 2,
    code: "A1",
    name: "Court West",
    status: "AVAILABLE",
  },
];

export default function Content() {
  const t = useTranslations("venues");
  const tDialog = useTranslations("dialog");
  const [venues, setVenues] = useState<Venue[]>(initialVenues);

  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<VenueFormData | null>(null);
  const [editingVenueId, setEditingVenueId] = useState<number | null>(null);

  const [viewingVenue, setViewingVenue] = useState<Venue | null>(null);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVenues = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return venues;
    }

    return venues.filter((venue) => {
      return (
        venue.name.toLowerCase().includes(keyword) ||
        venue.address.toLowerCase().includes(keyword) ||
        venue.note.toLowerCase().includes(keyword)
      );
    });
  }, [venues, searchQuery]);

  const handleOpenAddVenue = () => {
    setEditingVenue(null);
    setEditingVenueId(null);
    setIsVenueModalOpen(true);
  };

  const handleOpenEditVenue = (venue: Venue) => {
    setEditingVenueId(venue.id);

    setEditingVenue({
      name: venue.name,
      address: venue.address,
      price: venue.price,
      note: venue.note,
    });

    setIsVenueModalOpen(true);
  };

  const handleCloseVenueForm = () => {
    setIsVenueModalOpen(false);
    setEditingVenue(null);
    setEditingVenueId(null);
  };

  const handleSubmitVenue = (data: VenueFormData) => {
    if (editingVenueId !== null) {
      setVenues((prev) =>
        prev.map((venue) =>
          venue.id === editingVenueId
            ? {
                ...venue,
                ...data,
              }
            : venue,
        ),
      );

      setSuccessMessage("Venue updated successfully.");
    } else {
      const newVenue: Venue = {
        id: Date.now(),
        name: data.name,
        address: data.address,
        price: data.price,
        note: data.note,
        image: null,
      };

      setVenues((prev) => [...prev, newVenue]);
      setSuccessMessage("Venue added successfully to the system.");
    }

    handleCloseVenueForm();
  };

  const handleDeleteVenue = () => {
    if (!venueToDelete) return;

    setVenues((prev) => prev.filter((venue) => venue.id !== venueToDelete.id));

    setCourts((prev) =>
      prev.filter((court) => court.venueId !== venueToDelete.id),
    );

    if (viewingVenue?.id === venueToDelete.id) {
      setViewingVenue(null);
    }

    setVenueToDelete(null);
    setSuccessMessage("Venue deleted successfully.");
  };

  const [courts, setCourts] = useState(initialCourts);

  const handleAddCourt = (venueId: number, data: CourtFormData) => {
    setCourts((prev) => [
      ...prev,
      {
        id: Date.now(),
        venueId,
        ...data,
      },
    ]);
  };

  const handleUpdateCourt = (courtId: number, data: CourtFormData) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === courtId
          ? {
              ...court,
              ...data,
            }
          : court,
      ),
    );
  };

  const handleDeleteCourt = (courtId: number) => {
    setCourts((prev) => prev.filter((court) => court.id !== courtId));
  };
  return (
    <ManagementPage
      title={t("title")}
      description={t("description")}
      action={
        <Button type="button" onClick={handleOpenAddVenue}>
          {t("add")}
        </Button>
      }
      toolbar={
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder={t("search")}
          onSearchChange={setSearchInput}
          onSearch={() => setSearchQuery(searchInput)}
        />
      }
    >
      <ManagementListCard>
        {/* DESKTOP / TABLET */}
        <div className="hidden overflow-hidden md:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.4fr_1.6fr_0.8fr_1fr_0.7fr] bg-tag px-5 py-4 text-sm font-semibold">
            <span>{t("name")}</span>
            <span>{t("address")}</span>
            <span>{t("price")}</span>
            <span>{t("note")}</span>
            <span className="text-center">{t("actions")}</span>
          </div>

          {/* TABLE BODY */}
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="grid grid-cols-[1.4fr_1.6fr_0.8fr_1fr_0.7fr] items-center border-b border-foreground/20 px-5 py-6 last:border-b-0"
              >
                {/* NAME */}
                <div className="flex min-w-0 items-center gap-3">
                  {venue.image ? (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="size-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tag">
                      <MapPin size={18} />
                    </div>
                  )}

                  <span className="truncate font-semibold">{venue.name}</span>
                </div>

                {/* ADDRESS */}
                <p className="max-w-52 text-sm leading-5 text-foreground/70">
                  {venue.address}
                </p>

                {/* PRICE */}
                <span className="text-sm font-semibold">
                  {Number(venue.price).toLocaleString("vi-VN")} VNĐ
                </span>

                {/* NOTE */}
                <span className="text-sm text-foreground/70">
                  {venue.note || "—"}
                </span>

                {/* ACTIONS */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`View ${venue.name}`}
                    onClick={() => setViewingVenue(venue)}
                    className="cursor-pointer text-foreground transition hover:opacity-60"
                  >
                    <Eye size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Edit ${venue.name}`}
                    onClick={() => handleOpenEditVenue(venue)}
                    className="cursor-pointer text-primary transition hover:opacity-60"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${venue.name}`}
                    onClick={() => setVenueToDelete(venue)}
                    className="cursor-pointer text-colorWrong transition hover:opacity-60"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<MapPin size={24} />}
              title={searchQuery ? t("noResults") : t("noItems")}
              description={searchQuery ? t("trySearch") : t("addFirst")}
            />
          )}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-3 p-3 md:hidden">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="rounded-xl border border-foreground/20 bg-surface p-4"
              >
                {/* MOBILE HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {venue.image ? (
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-tag">
                        <MapPin size={19} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{venue.name}</h3>

                      <p className="mt-1 text-sm text-foreground/70">
                        {venue.address}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`View ${venue.name}`}
                    onClick={() => setViewingVenue(venue)}
                    className="shrink-0 cursor-pointer text-foreground transition hover:opacity-60"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {/* INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  <div>
                    <p className="text-xs text-foreground/60">{t("price")}</p>

                    <p className="mt-1 text-sm font-semibold">
                      {Number(venue.price).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-foreground/60">{t("note")}</p>

                    <p className="mt-1 text-sm font-medium">
                      {venue.note || "—"}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditVenue(venue)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-primary transition hover:opacity-60"
                  >
                    <Pencil size={14} />
                    {t("edit")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVenueToDelete(venue)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-colorWrong/30 px-3 py-2 text-sm text-colorWrong transition hover:opacity-70"
                  >
                    <Trash2 size={14} />
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<MapPin size={24} />}
              title={searchQuery ? t("noResults") : t("noItems")}
              description={searchQuery ? t("trySearch") : t("addFirst")}
              className="py-12"
            />
          )}
        </div>
      </ManagementListCard>

      <VenueDetailModal
        open={viewingVenue !== null}
        venue={viewingVenue}
        courts={courts}
        onClose={() => setViewingVenue(null)}
        onAddCourt={handleAddCourt}
        onUpdateCourt={handleUpdateCourt}
        onDeleteCourt={handleDeleteCourt}
      />

      <VenueFormModal
        open={isVenueModalOpen}
        mode={editingVenueId !== null ? "edit" : "add"}
        initialData={editingVenue ?? undefined}
        onClose={handleCloseVenueForm}
        onSubmit={handleSubmitVenue}
      />

      <ConfirmModal
        open={venueToDelete !== null}
        title={tDialog("titleDelete")}
        description={tDialog("venueDescription", {
          name: venueToDelete?.name ?? "",
        })}
        onClose={() => setVenueToDelete(null)}
        onConfirm={handleDeleteVenue}
      />

      <StatusModal
        open={successMessage !== null}
        description={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
    </ManagementPage>
  );
}
