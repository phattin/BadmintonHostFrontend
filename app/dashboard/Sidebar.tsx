import {CalendarDays, LayoutDashboard, MapPin, Wallet, LogOut, Plus, Settings} from "lucide-react";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <div className="flex flex-col p-5 w-120 bg-[#d3e4d4] border-r border-r-gray-400 h-full">
      <div className="flex">
        <img className="size-18" src="/logo_badminton.png" alt="Logo" />
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
          />

          <SidebarItem
            icon={<MapPin size={20} />}
            label="Courts"
          />

          <SidebarItem
            icon={<CalendarDays size={20} />}
            label="Bookings"
          />

          <SidebarItem
            icon={<Wallet size={20} />}
            label="Earnings"
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
  );
}
