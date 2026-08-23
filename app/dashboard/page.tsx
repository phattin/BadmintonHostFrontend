import Sidebar from "@/app/dashboard/Sidebar";
import Content from "@/app/dashboard/Content"

export default function Dashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <Content/>
        </div>
    );
}