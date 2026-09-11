"use client";

import { useState } from "react";

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
import { useTranslations } from "next-intl";

import { usePathname } from "@/i18n/navigation";

import SettingsPopup from "./SettingsPopup";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const pathname = usePathname();

  const t = useTranslations("navigation");

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const handleToggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={15} />,
      label: t("dashboard"),
      href: "/dashboard",
    },
    {
      icon: <MapPin size={15} />,
      label: t("venues"),
      href: "/dashboard/venue",
    },
    {
      icon: <CalendarClock size={15} />,
      label: t("sessions"),
      href: "/dashboard/session",
    },
    {
      icon: <Users size={15} />,
      label: t("participants"),
      href: "/dashboard/participant",
    },
    {
      icon: <Package size={15} />,
      label: t("shuttlecock"),
      href: "/dashboard/shuttlecock",
    },
    {
      icon: <ChartNoAxesCombined size={15} />,
      label: t("statistics"),
      href: "/dashboard/statistics",
    },
  ];

  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden h-full w-55 flex-col bg-surface p-5 lg:flex">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo_badminton.webp"
            alt="Logo"
            width={72}
            height={72}
            className="size-12"
          />

          <div>
            <h2>Host Badminton</h2>

            <span className="text-sm text-foreground/60">
              {t("admin")}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
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

        {/* BOTTOM */}
        <div className="mt-auto">
          {/* SETTINGS */}
          <div className="relative">
            <SettingsPopup
              open={isSettingsOpen}
            />

            <button
              type="button"
              onClick={handleToggleSettings}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium transition ${
                isSettingsOpen
                  ? "bg-tag text-primary"
                  : "text-foreground hover:bg-background"
              }`}
            >
              <Settings size={15} />
              {t("settings")}
            </button>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm font-medium text-colorWrong transition hover:bg-bgWrong"
          >
            <LogOut size={15} />
            {t("logout")}
          </button>
        </div>
      </div>

      {/* MOBILE / TABLET */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex justify-around border-t border-foreground/20 bg-surface py-3 lg:hidden">
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