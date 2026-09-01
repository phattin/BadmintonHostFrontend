"use client";

import {
  Dispatch,
  SetStateAction,
} from "react";

import { Trophy } from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";

import { Match } from "../types";

interface MatchTrackingTabProps {
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
}

export default function MatchTrackingTab({
  matches,
  setMatches,
}: MatchTrackingTabProps) {
  const finishMatch = (matchId: number) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,
              status: "FINISHED",
            }
          : match,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold text-text">
          Match Tracking
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Track matches currently being played.
        </p>
      </div>

      {matches.map((match) => (
        <WhiteCard
          key={match.id}
          className="flex-col items-stretch"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-text">
                {match.courtName}
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  match.status === "PLAYING"
                    ? "bg-red-100 text-red-600"
                    : "bg-main1 text-text"
                }`}
              >
                {match.status}
              </span>
            </div>

            <Trophy
              size={22}
              className="text-text"
            />
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div>
              <p className="font-semibold">
                {match.teamA.join(" / ")}
              </p>
            </div>

            <div className="text-2xl font-bold text-text">
              {match.scoreA} - {match.scoreB}
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {match.teamB.join(" / ")}
              </p>
            </div>
          </div>

          {match.status === "PLAYING" && (
            <Button
              type="button"
              onClick={() => finishMatch(match.id)}
              className="mt-5 md:w-fit"
            >
              Finish Match
            </Button>
          )}
        </WhiteCard>
      ))}
    </div>
  );
}