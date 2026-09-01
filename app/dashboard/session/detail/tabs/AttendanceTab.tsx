"use client";

import { Check, Users, X } from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";

import { SessionPlayer } from "../types";

interface AttendanceTabProps {
  players: SessionPlayer[];
  onUpdatePlayer: (
    playerId: number,
    data: Partial<SessionPlayer>,
  ) => void;
}

export default function AttendanceTab({
  players,
  onUpdatePlayer,
}: AttendanceTabProps) {
  const checkedInCount = players.filter(
    (player) => player.checkedIn,
  ).length;

  return (
    <WhiteCard className="flex-col items-stretch">
      <div>
        <h3 className="text-xl font-semibold text-text">
          Attendance
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {checkedInCount}/{players.length} checked in
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-placeholder font-semibold text-text">
                {player.name.charAt(0)}
              </div>

              <div>
                <p className="font-semibold">
                  {player.name}
                </p>

                <p className="text-xs text-gray-500">
                  {player.level}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdatePlayer(player.id, {
                  checkedIn: !player.checkedIn,
                })
              }
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                player.checkedIn
                  ? "bg-main3 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {player.checkedIn ? (
                <>
                  <Check size={15} />
                  Present
                </>
              ) : (
                <>
                  <X size={15} />
                  Absent
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </WhiteCard>
  );
}