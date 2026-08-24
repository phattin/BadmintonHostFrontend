import Sidebar from "@/app/dashboard/Sidebar";
import Content from "@/app/dashboard/Content"

export default function Dashboard() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar/>
            <main className="flex-1 overflow-y-auto">
                <Content/>
            </main>
        </div>
    );
}