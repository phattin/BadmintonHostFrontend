import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/button";
import StatCard from "./StatCard";
import SessionCard from "./SessionCard";
import { Plus, Dumbbell, Bell } from "lucide-react";

export default function Content() {
  const stats = [
    {
      title:"Monthly Revenue",
      value:"$12,450",
      description:"+15% from last month",
      icon:"/revenue.svg"
    },
    {
      title:"Sessions Organized",
      value:"128",
      description:"12 sessions today",
      icon:"/badminton.svg",
      iconBgColor: "bg-main3",
    },
    {
      title:"Total Outstanding",
      value:"$450",
      description:"Pending collection from players",
      icon:"/outstanding.svg",
      iconBgColor: "bg-[#FFDAD6]",
      valueColor: "text-[#BA1A1A]",
      descriptionColor: "text-[#40493E]",
      borderColor: "border-[#FFDAD6]",
    }
  ]
  const sessions = [
    {
      image: "/img_login.png",
      status: "OPEN",
      title: "Weekend Morning Social",
      time: "Tomorrow, 08:00 - 10:00",
      courts: "Courts 3, 4, 5",
      players: 18,
      maxPlayers: 24,
    },
    {
      image: "/img_login.png",
      status: "FULL",
      title: "Pro Training Camp",
      time: "Tomorrow, 14:00 - 17:00",
      courts: "Courts 1, 2",
      players: 12,
      maxPlayers: 12,
    },
  ] as const;
  const summaryData = [
    {
      label: "Total Slots Available",
      value: "64",
    },
    {
      label: "Slots Booked",
      value: "48",
    },
    {
      label: "Occupancy Rate",
      value: "75%",
    },
  ];
  return (
    <div  className="bg-bg w-full p-15 flex flex-col justify-between gap-10">
        <div>
          <WhiteCard>
            <div>
              <h1>Welcome back, Host!</h1>
              <p className="mt-2 text-xl">Here is the overview of your courts today</p>
            </div>
            <div className="flex items-center gap-5">
              <button className="flex size-15 rounded-full bg-placeholder items-center justify-center">
                <Bell size={30}/>
              </button>
              <img src="/logo_badminton.png" alt="avatar" className="size-20 rounded-full border-3 border-main3" />
            </div>
          </WhiteCard>
        </div>
        <div className="flex justify-between gap-10">
          {
          stats.map((stat)=>(
            <StatCard
              key={stat.title}

              title={stat.title}
              value={stat.value}
              description={stat.description}

              icon={
                <img
                  src={stat.icon}
                  className="size-6"
                />
              }

              iconBgColor={stat.iconBgColor}
              valueColor={stat.valueColor}
              descriptionColor={stat.descriptionColor}
              borderColor={stat.borderColor}

            />
          ))
          }
        </div>
        <div className="flex justify-between gap-5">
          <div className="flex flex-col justify-between w-[66%] gap-10">
            <div className="flex flex-col justify-between gap-10">
              <div className="flex justify-between gap-5">
                <h3 className="text-4xl font-semibold">In Progress</h3>
                <a href="" className="text-xl text-text font-semibold">View All</a>
              </div>
              <WhiteCard className="border-l-4 border-main3">
                <div>
                  <div className="flex gap-2">
                    <span className="bg-placeholder text-text px-3 py-1 rounded text-l font-semibold">
                      COURT 1 & 2
                    </span>
                    <span className="bg-red-100  text-red-600 px-3 py-1 rounded text-l font-semibold">
                      ● Live
                    </span>
                  </div>
                  <h3 className="font-bold text-2xl mt-3">
                    Evening Advanced Play
                  </h3>
                  <p className="text-xl">
                    ◷ 18:00 - 20:00
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-bg rounded-xl px-5 py-3 text-center">
                    <p className="text-l font-semibold text-gray-600">
                      Checked In
                    </p>
                    <p className="text-3xl font-bold text-text">
                      14/16
                    </p>
                  </div>
                  <div className="bg-bg rounded-xl px-5 py-3 text-center">
                    <p className="text-l font-semibold text-gray-600">
                      Active Matches
                    </p>
                    <p className="text-3xl font-bold text-text">
                      2
                    </p>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="flex flex-col justify-between gap-10">
              <div className="flex justify-between gap-5">
                <h3 className="text-4xl font-semibold">Upcoming Sessions</h3>
                <a href="" className="text-xl text-text font-semibold">View Schedule</a>
              </div>
              <div className="flex justify-between gap-5">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.title}
                    {...session}
                  />
                ))}

              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between w-[33%] gap-10">
            <WhiteCard className="flex-col gap-6 items-start">
              <h3 className="text-4xl font-semibold">Quick Actions</h3>
              <div className="flex flex-col gap-4 w-full">
                <Button>
                  <Plus size={20}/>
                  Tạo buổi cầu mới
                </Button>
                <Button className="border border-text" background="bg-background" color="text-text">
                  <Dumbbell size={20}/>
                  Thêm sân mới
                </Button>
              </div>
            </WhiteCard>
            <WhiteCard className="flex-col items-start h-full justify-start">
              <h3 className="text-4xl font-semibold">Total Summary</h3>
              <div className="mt-4 w-full">
                {summaryData.map((item) => (
                  <div
                    key={item.label}
                    className="
                      flex
                      justify-between
                      border-b
                      border-gray-200
                      py-4
                      text-xl
                    "
                  >
                    <span className="text-gray-600">
                      {item.label}
                    </span>
                    <span className="font-bold text-text">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </WhiteCard>
          </div>
        </div>
    </div>
  );
}
