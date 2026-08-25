"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  href: string;
}

export default function SidebarItem({
  icon,
  label,
  active = false,
  href,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col lg:flex-row cursor-pointer items-center lg:gap-3 rounded-full lg:rounded-lg p-2 md:p-3 text-sm md:text-l font-medium ${
        active ? "bg-placeholder text-text" : "text-gray-700 hover:bg-bg"
      }`}
    >
      {icon}

      <span>{label}</span>
    </Link>
  );
}
