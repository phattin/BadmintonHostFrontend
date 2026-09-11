"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Package, Pencil, Plus, Trash2 } from "lucide-react";

import EmptyListState from "@/app/components/EmptyListState";
import ListToolbar from "@/app/components/ListToolbar";
import ManagementListCard from "@/app/components/ManagementListCard";
import ManagementPage from "@/app/components/ManagementPage";
import Button from "@/app/components/ui/Button";
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
  const t = useTranslations("shuttlecocks");
  const tDialog = useTranslations("dialog");
  const [shuttleCocks, setShuttleCocks] =
    useState<ShuttleCock[]>(initialShuttleCocks);

  /* SEARCH */
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  /* FORM */
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingShuttleCock, setEditingShuttleCock] =
    useState<ShuttleCock | null>(null);

  const [shuttleCockToDelete, setShuttleCockToDelete] =
    useState<ShuttleCock | null>(null);

  /* STATUS */
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
    setIsFormOpen(false);
  };

  const handleSubmit = (data: ShuttleCockFormData) => {
    const quantity = Number(data.quantity);
    const pricePerTube = Number(data.pricePerTube);
    const shuttlecocksPerTube = Number(data.shuttlecocksPerTube);

    const pricePerShuttlecock =
      shuttlecocksPerTube > 0 ? pricePerTube / shuttlecocksPerTube : 0;

    if (editingShuttleCock) {
      setShuttleCocks((prev) =>
        prev.map((shuttleCock) =>
          shuttleCock.id === editingShuttleCock.id
            ? {
                ...shuttleCock,
                name: data.name,
                quantity,
                pricePerTube,
                shuttlecocksPerTube,
                pricePerShuttlecock,
              }
            : shuttleCock,
        ),
      );

      setSuccessMessage(t("updated"));
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

      setSuccessMessage(t("added"));
    }

    handleCloseForm();
  };

  const handleDelete = () => {
    if (!shuttleCockToDelete) return;

    setShuttleCocks((prev) =>
      prev.filter((shuttleCock) => shuttleCock.id !== shuttleCockToDelete.id),
    );

    setShuttleCockToDelete(null);

    setSuccessMessage(t("deleted"));
  };

  const formatPrice = (price: number) => {
    return `${Math.round(price).toLocaleString("vi-VN")} VNĐ`;
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
          <Plus size={17} />
          {t("add")}
        </Button>
      }
      toolbar={
        <ListToolbar
          searchValue={searchInput}
          searchPlaceholder={t("search")}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
        />
      }
    >
      {/* SHUTTLECOCK LIST */}
      <ManagementListCard>
        {/* DESKTOP / TABLET */}
        <div className="hidden overflow-hidden md:block">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr_1fr_0.6fr] bg-tag px-5 py-4 text-sm font-semibold">
            <span>{t("name")}</span>
            <span>{t("quantity")}</span>
            <span>{t("shuttlePerTube")}</span>
            <span>{t("pricePerTube")}</span>
            <span>{t("pricePerShuttle")}</span>
            <span className="text-center">{t("actions")}</span>
          </div>

          {/* TABLE BODY */}
          {filteredShuttleCocks.length > 0 ? (
            filteredShuttleCocks.map((shuttleCock) => (
              <div
                key={shuttleCock.id}
                className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr_1fr_0.6fr] items-center border-b border-foreground/20 px-5 py-6 last:border-b-0"
              >
                {/* NAME */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tag text-primary">
                    <Package size={18} />
                  </div>

                  <span className="truncate font-semibold">
                    {shuttleCock.name}
                  </span>
                </div>

                {/* QUANTITY */}
                <div>
                  <span className="font-semibold">{shuttleCock.quantity}</span>

                  <span className="ml-1 text-sm text-foreground/60">
                    {t("tubes")}
                  </span>
                </div>

                {/* SHUTTLE / TUBE */}
                <span className="text-sm text-foreground/70">
                  {shuttleCock.shuttlecocksPerTube}
                </span>

                {/* PRICE / TUBE */}
                <span className="text-sm font-medium">
                  {formatPrice(shuttleCock.pricePerTube)}
                </span>

                {/* PRICE / SHUTTLE */}
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(shuttleCock.pricePerShuttlecock)}
                </span>

                {/* ACTIONS */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label={`Edit ${shuttleCock.name}`}
                    onClick={() => handleOpenEdit(shuttleCock)}
                    className="cursor-pointer text-primary transition hover:opacity-60"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${shuttleCock.name}`}
                    onClick={() => setShuttleCockToDelete(shuttleCock)}
                    className="cursor-pointer text-colorWrong transition hover:opacity-60"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyListState
              icon={<Package size={24} />}
              title={searchQuery ? t("noResults") : t("noItems")}
              description={searchQuery ? t("trySearch") : t("addFirst")}
            />
          )}
        </div>

        {/* MOBILE */}
        <div className="flex flex-col gap-3 p-3 md:hidden">
          {filteredShuttleCocks.length > 0 ? (
            filteredShuttleCocks.map((shuttleCock) => (
              <div
                key={shuttleCock.id}
                className="rounded-xl border border-foreground/20 bg-surface p-4"
              >
                {/* MOBILE HEADER */}
                <div className="flex items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-tag text-primary">
                    <Package size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {shuttleCock.name}
                    </h3>

                    <p className="mt-1 text-sm text-foreground/60">
                      {shuttleCock.quantity} tubes available
                    </p>
                  </div>
                </div>

                {/* INFORMATION */}
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-bg p-3">
                  {/* SHUTTLE / TUBE */}
                  <div>
                    <p className="text-xs text-foreground/60">Shuttle / Tube</p>

                    <p className="mt-1 text-sm font-semibold">
                      {shuttleCock.shuttlecocksPerTube}
                    </p>
                  </div>

                  {/* QUANTITY */}
                  <div>
                    <p className="text-xs text-foreground/60">Quantity</p>

                    <p className="mt-1 text-sm font-semibold">
                      {shuttleCock.quantity} tubes
                    </p>
                  </div>

                  {/* PRICE / TUBE */}
                  <div>
                    <p className="text-xs text-foreground/60">Price / Tube</p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(shuttleCock.pricePerTube)}
                    </p>
                  </div>

                  {/* PRICE / SHUTTLE */}
                  <div>
                    <p className="text-xs text-foreground/60">
                      Price / Shuttle
                    </p>

                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatPrice(shuttleCock.pricePerShuttlecock)}
                    </p>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(shuttleCock)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-primary transition hover:opacity-60"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setShuttleCockToDelete(shuttleCock)}
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
              icon={<Package size={24} />}
              title={searchQuery ? t("noResults") : t("noItems")}
              description={searchQuery ? t("trySearch") : t("addFirst")}
              className="py-12"
            />
          )}
        </div>
      </ManagementListCard>

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

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        open={shuttleCockToDelete !== null}
        title={tDialog("titleDelete")}
        description={tDialog("shuttlecockDescription", {
          name: shuttleCockToDelete?.name ?? "",
        })}
        onClose={() => setShuttleCockToDelete(null)}
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
