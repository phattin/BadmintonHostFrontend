"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ArrowLeft, CalendarClock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import AttendanceTab from "./tabs/AttendanceTab";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import MatchTrackingTab from "./tabs/MatchTrackingTab";
import PaymentsTab from "./tabs/PaymentsTab";
import PlayersTab from "./tabs/PlayersTab";
import SettlementTab from "./tabs/SettlementTab";
import { Match, SessionDetail, SessionPlayer } from "./types";

type Tab =
  | "GENERAL"
  | "PLAYERS"
  | "ATTENDANCE"
  | "MATCHES"
  | "SETTLEMENT"
  | "PAYMENTS";

const initialSession: SessionDetail = {
  id: 1,
  title: "Sunday Morning Smash",
  venueName: "Downtown Arena",
  address: "123 Main St, District 1",

  courts: ["Court 1", "Court 2"],

  startTime: "2026-08-31T09:00",
  endTime: "2026-08-31T12:00",

  status: "IN_PROGRESS",

  maxSlot: 16,

  totalCourtPrice: 600000,

  shuttleCockName: "Yonex Aerosensa 30",
  pricePerShuttleCock: 35000,
  expectedShuttleCock: 20,

  priceMale: 150000,
  priceFemale: 120000,
};

const initialPlayers: SessionPlayer[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0901234567",
    gender: "MALE",
    level: "TBY",
    checkedIn: true,
    paymentMethod: "UNPAID",
  },
  {
    id: 2,
    name: "Trần Minh Anh",
    phone: "0987654321",
    gender: "FEMALE",
    level: "Y+",
    checkedIn: true,
    paymentMethod: "TRANSFER",
  },
  {
    id: 3,
    name: "Lê Hoàng Nam",
    phone: null,
    gender: "MALE",
    level: "TB-",
    checkedIn: false,
    paymentMethod: "UNPAID",
  },
];

const initialMatches: Match[] = [
  {
    id: 1,
    courtName: "Court 1",
    teamA: ["Nguyễn Văn An", "Lê Hoàng Nam"],
    teamB: ["Trần Minh Anh", "Player 4"],
    scoreA: 15,
    scoreB: 12,
    status: "PLAYING",
  },
];

const tabs: {
  id: Tab;
  label: string;
}[] = [
  {
    id: "GENERAL",
    label: "General Info",
  },
  {
    id: "PLAYERS",
    label: "Players",
  },
  {
    id: "ATTENDANCE",
    label: "Attendance",
  },
  {
    id: "MATCHES",
    label: "Match Tracking",
  },
  {
    id: "SETTLEMENT",
    label: "Settlement",
  },
  {
    id: "PAYMENTS",
    label: "Payments",
  },
];

export default function SessionDetailContent() {
  const router = useRouter();
  const t = useTranslations("sessionDetail");

  const [activeTab, setActiveTab] = useState<Tab>("GENERAL");

  const [session, setSession] = useState<SessionDetail>(initialSession);

  const [players, setPlayers] = useState<SessionPlayer[]>(initialPlayers);

  const [matches, setMatches] = useState<Match[]>(initialMatches);

  const [actualShuttleCock, setActualShuttleCock] = useState(
    initialSession.expectedShuttleCock,
  );

  const handleUpdatePlayer = (
    playerId: number,
    data: Partial<SessionPlayer>,
  ) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? {
              ...player,
              ...data,
            }
          : player,
      ),
    );
  };

  return (
    <div className="min-h-full w-full pb-24 lg:pb-8">
      {/* HEADER */}
      <div className="border-b border-tag/30 bg-main0 px-5 py-5 md:px-8">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/session")}
            className="mt-1 cursor-pointer transition hover:opacity-60"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1>{session.title}</h1>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <CalendarClock size={14} />

                <span>
                  {new Date(session.startTime).toLocaleString("vi-VN")} -{" "}
                  {new Date(session.endTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin size={14} />

                <span>{session.venueName}</span>
              </div>

              <span>•</span>

              <span>{session.courts.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-max gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-text"
                    : "border-transparent text-foreground/60 hover:text-primary"
                }`}
              >
                {t(
                  tab.id === "GENERAL"
                    ? "generalInfo"
                    : tab.id === "PLAYERS"
                      ? "players"
                      : tab.id === "ATTENDANCE"
                        ? "attendance"
                        : tab.id === "MATCHES"
                          ? "matchTracking"
                          : tab.id === "SETTLEMENT"
                            ? "settlement"
                            : "payments",
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="p-5 md:p-8">
        {activeTab === "GENERAL" && (
          <GeneralInfoTab
            session={session}
            onStatusChange={(status) =>
              setSession((prev) => ({
                ...prev,
                status,
              }))
            }
          />
        )}

        {activeTab === "PLAYERS" && (
          <PlayersTab
            players={players}
            setPlayers={setPlayers}
            maxSlot={session.maxSlot}
          />
        )}

        {activeTab === "ATTENDANCE" && (
          <AttendanceTab
            players={players}
            onUpdatePlayer={handleUpdatePlayer}
          />
        )}

        {activeTab === "MATCHES" && (
          <MatchTrackingTab matches={matches} setMatches={setMatches} />
        )}

        {activeTab === "SETTLEMENT" && (
          <SettlementTab
            session={session}
            players={players}
            actualShuttleCock={actualShuttleCock}
            onActualShuttleCockChange={setActualShuttleCock}
            onPriceChange={(priceMale, priceFemale) =>
              setSession((prev) => ({
                ...prev,
                priceMale,
                priceFemale,
              }))
            }
          />
        )}

        {activeTab === "PAYMENTS" && (
          <PaymentsTab
            players={players}
            priceMale={session.priceMale}
            priceFemale={session.priceFemale}
            onUpdatePlayer={handleUpdatePlayer}
          />
        )}
      </div>
    </div>
  );
}
