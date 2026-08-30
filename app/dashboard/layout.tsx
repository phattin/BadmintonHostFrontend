import Sidebar from "@/app/dashboard/Sidebar";
import Content from "@/app/dashboard/Content"
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar/>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}