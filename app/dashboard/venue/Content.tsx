"use client";

import { useState, useMemo } from "react";
import ListToolbar from "@/app/components/ListToolbar";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import StatusModal from "@/app/components/ui/StatusModal";
import WhiteCard from "@/app/components/WhiteCard";
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
  const [venues, setVenues] = useState<Venue[]>(initialVenues);

  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<VenueFormData | null>(
    null,
  );
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

    setVenues((prev) =>
      prev.filter((venue) => venue.id !== venueToDelete.id),
    );

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

  const handleAddCourt = (
    venueId: number,
    data: CourtFormData,
  ) => {
    setCourts((prev) => [
      ...prev,
      {
        id: Date.now(),
        venueId,
        ...data,
      },
    ]);
  };

  const handleUpdateCourt = (
    courtId: number,
    data: CourtFormData,
  ) => {
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
    setCourts((prev) =>
      prev.filter((court) => court.id !== courtId),
    );
  };
  return (
    <div className="flex min-h-full w-full flex-col gap-5 bg-bg p-5 pb-24 md:gap-8 md:p-8 md:pb-26 lg:pb-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1>Venues Management</h1>

          <p className="mt-1 text-sm text-gray-600 md:text-base">
            Manage your locations and their respective courts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddVenue}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-text px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <MapPin size={17} />
          Add New Venue
        </button>
      </div>
      {/* SEARCH */}
      <WhiteCard className="items-stretch p-0!">
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder="Search venues..."
          onSearchChange={setSearchInput}
          onSearch={() => setSearchQuery(searchInput)}
        />
      </WhiteCard>
      {/* VENUES */}
      <WhiteCard className="flex-col items-stretch p-0!">
        {/* DESKTOP / TABLET */}
        <div className="hidden overflow-hidden md:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.4fr_1.6fr_0.8fr_1fr_0.7fr] bg-main0 px-5 py-4 text-sm font-semibold text-gray-700">
            <span>Name</span>
            <span>Address</span>
            <span>Price</span>
            <span>Note</span>
            <span className="text-center">Actions</span>
          </div>

          {/* TABLE BODY */}
          {filteredVenues.length > 0 ? (
             filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="grid grid-cols-[1.4fr_1.6fr_0.8fr_1fr_0.7fr] items-center border-b border-gray-100 px-5 py-6 last:border-b-0"
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
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg text-text">
                      <MapPin size={18} />
                    </div>
                  )}

                  <span className="truncate font-semibold text-gray-900">
                    {venue.name}
                  </span>
                </div>

                {/* ADDRESS */}
                <p className="max-w-52 text-sm leading-5 text-gray-600">
                  {venue.address}
                </p>

                {/* PRICE */}
                <span className="text-sm font-semibold text-text">
                  {Number(venue.price).toLocaleString("vi-VN")} VNĐ
                </span>

                {/* NOTE */}
                <span className="text-sm text-gray-600">
                  {venue.note || "—"}
                </span>

                {/* ACTIONS */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`View ${venue.name}`}
                    onClick={() => setViewingVenue(venue)}
                    className="cursor-pointer text-text transition hover:opacity-60"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Edit ${venue.name}`}
                    onClick={() => handleOpenEditVenue(venue)}
                    className="cursor-pointer text-gray-600 transition hover:text-text"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${venue.name}`}
                    onClick={() => setVenueToDelete(venue)}
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
                <MapPin size={24} />
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                {searchQuery ? "No venues found" : "No venues yet"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try another search keyword."
                  : "Add your first venue to get started."}
              </p>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-3 p-3 md:hidden">
          {filteredVenues.length > 0 ? (
             filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="rounded-xl border border-gray-100 bg-white p-4"
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
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-bg text-text">
                        <MapPin size={19} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{venue.name}</h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {venue.address}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`View ${venue.name}`}
                    onClick={() => setViewingVenue(venue)}
                    className="shrink-0 cursor-pointer text-text transition hover:opacity-60"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {/* MOBILE INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {Number(venue.price).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Note</p>

                    <p className="mt-1 text-sm font-medium">
                      {venue.note || "—"}
                    </p>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditVenue(venue)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-bg"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setVenueToDelete(venue)}
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
                <MapPin size={24} />
              </div>
              <p className="mt-3 font-semibold text-gray-700">
                {searchQuery ? "No venues found" : "No venues yet"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try another search keyword."
                  : "Add your first venue to get started."}
              </p>
            </div>
          )}
        </div>
      </WhiteCard>

      {/* VENUE DETAIL */}
      <VenueDetailModal
        open={viewingVenue !== null}
        venue={viewingVenue}
        courts={courts}
        onClose={() => setViewingVenue(null)}
        onAddCourt={handleAddCourt}
        onUpdateCourt={handleUpdateCourt}
        onDeleteCourt={handleDeleteCourt}
      />

      {/* ADD / EDIT VENUE */}
      <VenueFormModal
        open={isVenueModalOpen}
        mode={editingVenueId !== null ? "edit" : "add"}
        initialData={editingVenue ?? undefined}
        onClose={handleCloseVenueForm}
        onSubmit={handleSubmitVenue}
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        open={venueToDelete !== null}
        title="Confirm deletion?"
        description={`Are you sure you want to delete venue "${
          venueToDelete?.name ?? ""
        }"? This action cannot be undone.`}
        onClose={() => setVenueToDelete(null)}
        onConfirm={handleDeleteVenue}
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