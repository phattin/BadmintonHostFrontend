import {CalendarClock, LayoutDashboard, MapPin, ChartNoAxesCombined, LogOut, Package, Settings} from "lucide-react";

import SidebarItem from "./SidebarItem";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div>
      <div className="hidden lg:flex flex-col p-5 w-72 bg-[#d3e4d4] border-r border-r-gray-400 h-full">
        <div className="flex">
          <Image className="size-18" width={72} height={72} src="/logo_badminton.webp" alt="Logo" />
          <div>
            <h2>Host Badminton</h2>
            <span>Admin</span>
          </div>
        </div>
        <div>
          <nav className="mt-10 flex flex-col gap-2">
            <SidebarItem
              active
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              href="/dashboard"
            />
  
            <SidebarItem
              icon={<MapPin size={20} />}
              label="Venues"
              href="/dashboard"
            />
  
            <SidebarItem
              icon={<CalendarClock size={20} />}
              label="Sessions"
              href="/dashboard"
            />
  
            <SidebarItem
              icon={<Package size={20} />}
              label="ShuttleCock"
              href="/dashboard"
            />
  
            <SidebarItem
              icon={<ChartNoAxesCombined size={20} />}
              label="Statistics"
              href="/dashboard"
            />
          </nav>
        </div>
        <div className="mt-auto">
          <button className="flex items-center p-5 gap-3 text-xl text-gray-700 cursor-pointer hover:bg-bg w-full">
            <Settings size={20} />
            Settings
          </button>
  
          <button className="flex items-center p-5 gap-3 text-xl text-red-600 cursor-pointer hover:bg-bg w-full">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
      {/* Mobile and Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 flex lg:hidden justify-around bg-main0 py-3 border-t border-gray-200 z-50">
        <SidebarItem
        active
        icon={<LayoutDashboard/>}
        label="Dashboard"
        href="/dashboard"
        />

        <SidebarItem
        icon={<MapPin/>}
        label="Venues"
        href="/dashboard"
        />

        <SidebarItem
        icon={<CalendarClock/>}
        label="Sessions"
        href="/dashboard"
        />

        <SidebarItem
        icon={<Package/>}
        label="ShuttleCocks"
        href="/dashboard"
        />

        <SidebarItem
        icon={<ChartNoAxesCombined/>}
        label="Statistics"
        href="/dashboard"
        />
      </nav>
    </div>
  );
}
