"use client";

import { Check, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";

import WhiteCard from "@/app/components/WhiteCard";

import { SessionPlayer } from "../types";

interface AttendanceTabProps {
  players: SessionPlayer[];

  onUpdatePlayer: (playerId: number, data: Partial<SessionPlayer>) => void;
}

export default function AttendanceTab({
  players,
  onUpdatePlayer,
}: AttendanceTabProps) {
  const t = useTranslations("sessionDetail");
  const checkedInCount = players.filter((player) => player.checkedIn).length;

  const absentCount = players.length - checkedInCount;

  const handleToggleAttendance = (player: SessionPlayer) => {
    onUpdatePlayer(player.id, {
      checkedIn: !player.checkedIn,
    });
  };

  return (
    <WhiteCard className="flex-col items-stretch">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-primary">
            {t("attendance")}
          </h3>

          <p className="mt-1 text-sm text-foreground/60">
            {t("attendanceDescription")}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-tag px-3 py-2 text-sm font-semibold text-primary">
            <Check size={15} />
            {checkedInCount} {t("present")}
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-colorWrong/10 px-3 py-2 text-sm font-semibold text-colorWrong">
            <X size={15} />
            {absentCount} {t("absent")}
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      {players.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-foreground/60">{t("checkInProgress")}</span>

            <span className="font-semibold text-primary">
              {checkedInCount}/{players.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${
                  players.length > 0
                    ? (checkedInCount / players.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* PLAYER LIST */}
      <div className="mt-5 flex flex-col gap-3">
        {players.length > 0 ? (
          players.map((player) => (
            <div
              key={player.id}
              className={`flex flex-col justify-between gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center ${
                player.checkedIn
                  ? "border-primary/30 bg-tag/40"
                  : "border-foreground/20 bg-surface"
              }`}
            >
              {/* PLAYER */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                    player.checkedIn
                      ? "bg-primary text-surface"
                      : "bg-tag text-primary"
                  }`}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {player.name}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-foreground/60">
                      {player.level === "NEWBIE" ? "Newbie" : player.level}
                    </span>

                    <span className="size-1 rounded-full bg-foreground/30" />

                    <span className="text-xs text-foreground/60">
                      {player.gender === "MALE"
                        ? "Male"
                        : player.gender === "FEMALE"
                          ? "Female"
                          : "Other"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ATTENDANCE BUTTON */}
              <button
                type="button"
                onClick={() => handleToggleAttendance(player)}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition sm:w-fit ${
                  player.checkedIn
                    ? "border-primary bg-primary text-surface hover:opacity-90"
                    : "border-colorWrong/30 bg-colorWrong/10 text-colorWrong hover:bg-colorWrong/15"
                }`}
              >
                {player.checkedIn ? (
                  <>
                    <Check size={15} />
                    {t("present")}
                  </>
                ) : (
                  <>
                    <X size={15} />
                    {t("absent")}
                  </>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-foreground/20 px-5 py-12">
            <div className="flex size-14 items-center justify-center rounded-full bg-tag text-primary">
              <Users size={24} />
            </div>

            <p className="mt-3 font-semibold text-foreground">
              {t("noPlayers")}
            </p>

            <p className="mt-1 text-center text-sm text-foreground/60">
              {t("addPlayersFirst")}
            </p>
          </div>
        )}
      </div>
    </WhiteCard>
  );
}
