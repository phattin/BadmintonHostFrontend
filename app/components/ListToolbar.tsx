"use client";

import { FormEvent, ReactNode } from "react";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/app/components/ui/Button";

interface ListToolbarProps {
  searchValue: string;
  searchPlaceholder?: string;
  children?: ReactNode;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export default function ListToolbar({
  searchValue,
  searchPlaceholder = "Search...",
  children,
  onSearchChange,
  onSearch,
}: ListToolbarProps) {
  const t = useTranslations("common");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full gap-3 p-4 md:flex-row md:items-center md:justify-between"
    >
      <div className="relative w-full">
        <Search
          size={17}
          className="absolute top-1/2 left-3 -translate-y-1/2"
        />

        <input
          type="text"
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-lg border border-primary bg-surface py-3 pr-3 pl-10 text-sm outline-none placeholder:text-tag focus:border-button focus:ring-2 focus:ring-button/20"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
        {children}

        <Button type="submit" className="md:w-fit md:px-6">
          <Search size={16} />
          {t("search")}
        </Button>
      </div>
    </form>
  );
}
