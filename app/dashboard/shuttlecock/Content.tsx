"use client";

import { useMemo, useState } from "react";

import { Package, Pencil, Plus, Trash2 } from "lucide-react";

import ListToolbar from "@/app/components/ListToolbar";
import WhiteCard from "@/app/components/WhiteCard";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import StatusModal from "@/app/components/ui/StatusModal";

import ShuttleCockFormModal, {
  ShuttleCockFormData,
} from "./ShuttleCockFormModal";

interface ShuttleCock {
  id: number;
  name: string;
  quantity: number;
  pricePerTube: number;
  shuttlecocksPerTube: number;
  pricePerShuttlecock: number;
}

const initialShuttleCocks: ShuttleCock[] = [
  {
    id: 1,
    name: "Yonex Aerosensa 30",
    quantity: 10,
    pricePerTube: 420000,
    shuttlecocksPerTube: 12,
    pricePerShuttlecock: 35000,
  },
  {
    id: 2,
    name: "Victor Master No. 3",
    quantity: 8,
    pricePerTube: 360000,
    shuttlecocksPerTube: 12,
    pricePerShuttlecock: 30000,
  },
  {
    id: 3,
    name: "Lining A+ 60",
    quantity: 5,
    pricePerTube: 300000,
    shuttlecocksPerTube: 12,
    pricePerShuttlecock: 25000,
  },
];

export default function Content() {
  const [shuttleCocks, setShuttleCocks] =
    useState<ShuttleCock[]>(initialShuttleCocks);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingShuttleCock, setEditingShuttleCock] =
    useState<ShuttleCock | null>(null);

  const [shuttleCockToDelete, setShuttleCockToDelete] =
    useState<ShuttleCock | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredShuttleCocks = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return shuttleCocks;
    }

    return shuttleCocks.filter((shuttleCock) =>
      shuttleCock.name.toLowerCase().includes(keyword),
    );
  }, [shuttleCocks, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleOpenAdd = () => {
    setEditingShuttleCock(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (shuttleCock: ShuttleCock) => {
    setEditingShuttleCock(shuttleCock);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingShuttleCock(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (data: ShuttleCockFormData) => {
    const quantity = Number(data.quantity);
    const pricePerTube = Number(data.pricePerTube);
    const shuttlecocksPerTube = Number(data.shuttlecocksPerTube);
    const pricePerShuttlecock = pricePerTube / shuttlecocksPerTube;

    if (editingShuttleCock) {
      setShuttleCocks((prev) =>
        prev.map((shuttleCock) => {
          if (shuttleCock.id === editingShuttleCock.id) {
            return {
              ...shuttleCock,
              name: data.name,
              quantity,
              pricePerTube,
              shuttlecocksPerTube,
              pricePerShuttlecock,
            };
          }

          return shuttleCock;
        }),
      );

      setSuccessMessage("Shuttlecock information updated successfully.");
    } else {
      const newShuttleCock: ShuttleCock = {
        id: Date.now(),
        name: data.name,
        quantity,
        pricePerTube,
        shuttlecocksPerTube,
        pricePerShuttlecock,
      };

      setShuttleCocks((prev) => [...prev, newShuttleCock]);
      setSuccessMessage("New shuttlecock added successfully.");
    }

    handleCloseForm();
  };

  const handleDelete = () => {
    if (!shuttleCockToDelete) return;

    setShuttleCocks((prev) =>
      prev.filter(
        (shuttleCock) => shuttleCock.id !== shuttleCockToDelete.id,
      ),
    );

    setShuttleCockToDelete(null);
    setSuccessMessage("Shuttlecock deleted successfully.");
  };

  return (
    <div className="flex min-h-full w-full flex-col gap-5 bg-bg p-5 pb-24 md:gap-8 md:p-8 md:pb-26 lg:pb-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1>ShuttleCock Management</h1>

          <p className="mt-1 text-sm text-gray-600 md:text-base">
            Manage shuttlecock inventory and pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-text px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={17} />
          Add ShuttleCock
        </button>
      </div>
      {/* SEARCH */}
      <WhiteCard padding="p-0">
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder="Search shuttlecocks..."
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
        />
      </WhiteCard>
      {/* SHUTTLECOCK LIST */}
      <WhiteCard padding="p-0" className="flex-col items-stretch">
        {/* DESKTOP / TABLET */}
        <div className="hidden overflow-hidden md:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr_1fr_0.6fr] bg-main0 px-5 py-4 text-sm font-semibold text-gray-700">
            <span>Name</span>
            <span>Quantity</span>
            <span>Shuttle / Tube</span>
            <span>Price / Tube</span>
            <span>Price / Shuttle</span>
            <span className="text-center">Actions</span>
          </div>

          {/* TABLE BODY */}
          {filteredShuttleCocks.length > 0 ? (
            filteredShuttleCocks.map((shuttleCock) => (
              <div
                key={shuttleCock.id}
                className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr_1fr_0.6fr] items-center border-b border-gray-100 px-5 py-6 last:border-b-0"
              >
                {/* NAME */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-placeholder text-text">
                    <Package size={18} />
                  </div>

                  <span className="truncate font-semibold text-gray-900">
                    {shuttleCock.name}
                  </span>
                </div>

                {/* QUANTITY */}
                <div>
                  <span className="font-semibold">{shuttleCock.quantity}</span>
                  <span className="ml-1 text-sm text-gray-500">tubes</span>
                </div>

                {/* SHUTTLE / TUBE */}
                <span className="text-sm text-gray-600">
                  {shuttleCock.shuttlecocksPerTube}
                </span>

                {/* PRICE / TUBE */}
                <span className="text-sm font-medium">
                  {shuttleCock.pricePerTube.toLocaleString("vi-VN")} VNĐ
                </span>

                {/* PRICE / SHUTTLE */}
                <span className="text-sm font-semibold text-text">
                  {Math.round(
                    shuttleCock.pricePerShuttlecock,
                  ).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </span>

                {/* ACTIONS */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`Edit ${shuttleCock.name}`}
                    onClick={() => handleOpenEdit(shuttleCock)}
                    className="cursor-pointer text-gray-600 transition hover:text-text"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${shuttleCock.name}`}
                    onClick={() => setShuttleCockToDelete(shuttleCock)}
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
                <Package size={24} />
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                {searchQuery ? "No shuttlecocks found" : "No shuttlecocks yet"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try another search keyword."
                  : "Add your first shuttlecock to start managing inventory."}
              </p>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-3 p-3 md:hidden">
          {filteredShuttleCocks.length > 0 ? (
            filteredShuttleCocks.map((shuttleCock) => (
              <div
                key={shuttleCock.id}
                className="rounded-xl border border-gray-100 bg-white p-4"
              >
                {/* HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-placeholder text-text">
                      <Package size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {shuttleCock.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {shuttleCock.quantity} tubes available
                      </p>
                    </div>
                  </div>
                </div>

                {/* INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  <div>
                    <p className="text-xs text-gray-500">Shuttle / Tube</p>

                    <p className="mt-1 text-sm font-semibold">
                      {shuttleCock.shuttlecocksPerTube}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Price / Tube</p>

                    <p className="mt-1 text-sm font-semibold">
                      {shuttleCock.pricePerTube.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Price / Shuttle</p>

                    <p className="mt-1 text-base font-bold text-text">
                      {Math.round(
                        shuttleCock.pricePerShuttlecock,
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(shuttleCock)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-bg"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setShuttleCockToDelete(shuttleCock)}
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
                <Package size={24} />
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                {searchQuery ? "No shuttlecocks found" : "No shuttlecocks yet"}
              </p>

              <p className="mt-1 text-center text-sm text-gray-500">
                {searchQuery
                  ? "Try another search keyword."
                  : "Add your first shuttlecock to get started."}
              </p>
            </div>
          )}
        </div>
      </WhiteCard>

      {/* ADD / EDIT */}
      <ShuttleCockFormModal
        open={isFormOpen}
        mode={editingShuttleCock ? "edit" : "add"}
        initialData={
          editingShuttleCock
            ? {
                name: editingShuttleCock.name,
                quantity: String(editingShuttleCock.quantity),
                pricePerTube: String(editingShuttleCock.pricePerTube),
                shuttlecocksPerTube: String(
                  editingShuttleCock.shuttlecocksPerTube,
                ),
              }
            : undefined
        }
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      {/* DELETE */}
      <ConfirmModal
        open={shuttleCockToDelete !== null}
        title="Confirm deletion?"
        description={`Are you sure you want to delete "${
          shuttleCockToDelete?.name ?? ""
        }"? This action cannot be undone.`}
        onClose={() => setShuttleCockToDelete(null)}
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