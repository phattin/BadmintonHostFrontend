"use client";

import {
  CalendarClock,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={15} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <MapPin size={15} />,
      label: "Venues",
      href: "/dashboard/venue",
    },
    {
      icon: <CalendarClock size={15} />,
      label: "Sessions",
      href: "/dashboard/session",
    },
    {
      icon: <Users size={15} />,
      label: "Participants",
      href: "/dashboard/participant",
    },
    {
      icon: <Package size={15} />,
      label: "ShuttleCock",
      href: "/dashboard/shuttlecock",
    },
    {
      icon: <ChartNoAxesCombined size={15} />,
      label: "Statistics",
      href: "/dashboard/statistics",
    },
  ];

  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden h-full w-55 flex-col bg-[#c5dec7ea] p-5 lg:flex">
        <div className="flex">
          <Image
            src="/logo_badminton.webp"
            alt="Logo"
            width={72}
            height={72}
            className="size-12"
          />

          <div>
            <h2>Host Badminton</h2>
            <span>Admin</span>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        <div className="mt-auto">
          <button className="flex w-full cursor-pointer items-center gap-3 p-3 text-l text-gray-700 hover:bg-bg">
            <Settings size={15} />
            Settings
          </button>

          <button className="flex w-full cursor-pointer items-center gap-3 p-3 text-l text-red-600 hover:bg-bg">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      {/* MOBILE AND TABLET */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex justify-around border-t border-gray-200 bg-main0 py-3 lg:hidden">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={isActive(item.href)}
          />
        ))}
      </nav>
    </div>
  );
}