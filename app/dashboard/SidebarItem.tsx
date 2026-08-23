import type { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export default function SidebarItem({
  icon,
  label,
  active = false,
}: SidebarItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-xl font-medium ${
        active
          ? "bg-placeholder text-text"
          : "text-gray-700 hover:bg-bg"
      }`}
    >
      {icon}

      <span>{label}</span>
    </div>
  );
}