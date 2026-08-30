"use client";

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

import {
  SessionDetail,
  SessionStatus,
} from "../types";

interface GeneralInfoTabProps {
  session: SessionDetail;
  onStatusChange: (status: SessionStatus) => void;
}

const statuses: {
  status: SessionStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
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

const nextStatus: Record<
  SessionStatus,
  SessionStatus | null
> = {
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
  const currentIndex = statuses.findIndex(
    (item) => item.status === session.status,
  );

  const next = nextStatus[session.status];

  return (
    <WhiteCard className="flex-col items-stretch gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-xl font-semibold text-text">
            Session Status
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage the lifecycle of this session.
          </p>
        </div>

        <Button
          type="button"
          disabled={!next}
          onClick={() => {
            if (next) {
              onStatusChange(next);
            }
          }}
          className="sm:w-fit sm:px-6"
          background={next ? "bg-main3" : "bg-gray-300"}
        >
          {buttonLabel[session.status]}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-180 items-start justify-between">
          {statuses.map((item, index) => {
            const completed = index < currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={item.status}
                className="flex min-w-24 flex-col items-center"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full ${
                    current
                      ? "bg-text text-white"
                      : completed
                        ? "bg-main3 text-text"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`mt-2 text-xs font-semibold ${
                    current
                      ? "text-text"
                      : completed
                        ? "text-gray-700"
                        : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </WhiteCard>
  );
}