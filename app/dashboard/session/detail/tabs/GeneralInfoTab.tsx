"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

import {
  Check,
  CircleDollarSign,
  DoorOpen,
  Flag,
  Lock,
  Play,
} from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";

import { SessionDetail, SessionStatus } from "../types";

interface GeneralInfoTabProps {
  session: SessionDetail;
  onStatusChange: (status: SessionStatus) => void;
}

interface StatusItem {
  status: SessionStatus;
  label: string;
  icon: ReactNode;
}

const statuses: StatusItem[] = [
  {
    status: "DRAFT",
    label: "DRAFT",
    icon: <Flag size={17} />,
  },
  {
    status: "OPEN",
    label: "OPEN",
    icon: <DoorOpen size={17} />,
  },
  {
    status: "IN_PROGRESS",
    label: "IN PROGRESS",
    icon: <Play size={17} />,
  },
  {
    status: "FINISHED",
    label: "FINISHED",
    icon: <Check size={17} />,
  },
  {
    status: "SETTLED",
    label: "SETTLED",
    icon: <CircleDollarSign size={17} />,
  },
  {
    status: "CLOSED",
    label: "CLOSED",
    icon: <Lock size={17} />,
  },
];

const nextStatus: Record<SessionStatus, SessionStatus | null> = {
  DRAFT: "OPEN",
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "FINISHED",
  FINISHED: "SETTLED",
  SETTLED: "CLOSED",
  CLOSED: null,
};

const buttonLabel: Record<SessionStatus, string> = {
  DRAFT: "Open Session",
  OPEN: "Start Session",
  IN_PROGRESS: "Mark as Finished",
  FINISHED: "Settle Session",
  SETTLED: "Close Session",
  CLOSED: "Session Closed",
};

export default function GeneralInfoTab({
  session,
  onStatusChange,
}: GeneralInfoTabProps) {
  const t = useTranslations("sessionDetail");
  const currentIndex = statuses.findIndex(
    (item) => item.status === session.status,
  );

  const next = nextStatus[session.status];

  const handleNextStatus = () => {
    if (!next) return;

    onStatusChange(next);
  };

  return (
    <WhiteCard className="flex-col items-stretch gap-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-xl font-semibold text-primary">
            {t("sessionStatus")}
          </h3>

          <p className="mt-1 text-sm text-foreground/60">
            {t("manageLifecycle")}
          </p>
        </div>

        <Button
          type="button"
          disabled={!next}
          onClick={handleNextStatus}
          className="sm:w-fit sm:px-6"
          background={next ? "bg-primary" : "bg-foreground/15"}
          color={next ? "text-surface" : "text-foreground/40"}
        >
          {t(
            session.status === "DRAFT"
              ? "openSession"
              : session.status === "OPEN"
                ? "startSession"
                : session.status === "IN_PROGRESS"
                  ? "finishSession"
                  : session.status === "FINISHED"
                    ? "settleSession"
                    : session.status === "SETTLED"
                      ? "closeSession"
                      : "sessionClosed",
          )}
        </Button>
      </div>

      {/* STATUS PROGRESS */}
      <div className="overflow-x-auto px-2 py-5">
        <div className="relative flex min-w-180 items-start justify-between">
          {/* BACKGROUND LINE */}
          <div className="absolute top-5 right-12 left-12 h-0.5 bg-foreground/15" />

          {/* COMPLETED LINE */}
          {currentIndex > 0 && (
            <div
              className="absolute top-5 left-12 h-0.5 bg-primary transition-all duration-500"
              style={{
                width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
                maxWidth: "calc(100% - 6rem)",
              }}
            />
          )}

          {statuses.map((item, index) => {
            const completed = index < currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={item.status}
                className="relative z-10 flex min-w-24 flex-col items-center"
              >
                {/* STATUS ICON */}
                <div className="relative flex size-10 items-center justify-center">
                  {/* WATER RIPPLE */}
                  {current && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-primary/25 animate-ping" />

                      <span
                        className="absolute -inset-2 rounded-full border border-primary/30 animate-ping"
                        style={{
                          animationDuration: "2s",
                        }}
                      />
                    </>
                  )}

                  {/* CIRCLE */}
                  <div
                    className={`relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      current
                        ? "scale-110 border-primary bg-primary text-surface shadow-md shadow-primary/25"
                        : completed
                          ? "border-primary bg-tag text-primary"
                          : "border-foreground/15 bg-surface text-foreground/35"
                    }`}
                  >
                    {completed ? (
                      <Check size={17} strokeWidth={2.5} />
                    ) : (
                      item.icon
                    )}
                  </div>
                </div>

                {/* LABEL */}
                <span
                  className={`mt-3 text-center text-xs font-semibold transition-colors ${
                    current
                      ? "text-primary"
                      : completed
                        ? "text-foreground/70"
                        : "text-foreground/35"
                  }`}
                >
                  {item.label}
                </span>

                {/* CURRENT LABEL */}
                {current && (
                  <span className="mt-1 rounded-full bg-tag px-2 py-0.5 text-[9px] font-semibold text-primary">
                    {t("current")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </WhiteCard>
  );
}
