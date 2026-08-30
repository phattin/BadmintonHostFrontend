"use client";

import { CircleDollarSign } from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";

import {
  PaymentMethod,
  SessionPlayer,
} from "../types";

interface PaymentsTabProps {
  players: SessionPlayer[];
  priceMale: number;
  priceFemale: number;

  onUpdatePlayer: (
    playerId: number,
    data: Partial<SessionPlayer>,
  ) => void;
}

const paymentLabel: Record<
  PaymentMethod,
  string
> = {
  UNPAID: "Chưa thanh toán",
  CASH: "Tiền mặt",
  TRANSFER: "Chuyển khoản",
};

export default function PaymentsTab({
  players,
  priceMale,
  priceFemale,
  onUpdatePlayer,
}: PaymentsTabProps) {
  const checkedInPlayers = players.filter(
    (player) => player.checkedIn,
  );

  const paidCount = checkedInPlayers.filter(
    (player) =>
      player.paymentMethod !== "UNPAID",
  ).length;

  return (
    <WhiteCard className="flex-col items-stretch p-0!">
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="text-xl font-semibold text-text">
            Payments
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {paidCount}/{checkedInPlayers.length} paid
          </p>
        </div>

        <CircleDollarSign
          size={25}
          className="text-text"
        />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_1fr] bg-main0 px-5 py-4 text-sm font-semibold">
          <span>Player</span>
          <span>Gender</span>
          <span>Amount</span>
          <span>Payment</span>
        </div>

        {checkedInPlayers.map((player) => {
          const amount =
            player.gender === "FEMALE"
              ? priceFemale
              : priceMale;

          return (
            <div
              key={player.id}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr_1fr] items-center border-b border-gray-100 px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="font-semibold">
                  {player.name}
                </p>

                <p className="text-xs text-gray-500">
                  {player.level}
                </p>
              </div>

              <span className="text-sm">
                {player.gender === "MALE"
                  ? "Nam"
                  : player.gender === "FEMALE"
                    ? "Nữ"
                    : "Khác"}
              </span>

              <span className="font-semibold text-text">
                {amount.toLocaleString("vi-VN")} VNĐ
              </span>

              <select
                value={player.paymentMethod}
                onChange={(event) =>
                  onUpdatePlayer(player.id, {
                    paymentMethod:
                      event.target
                        .value as PaymentMethod,
                  })
                }
                className="cursor-pointer rounded-lg border border-placeholder bg-white px-3 py-2.5 text-sm text-text outline-none"
              >
                <option value="UNPAID">
                  Chưa thanh toán
                </option>

                <option value="CASH">
                  Tiền mặt
                </option>

                <option value="TRANSFER">
                  Chuyển khoản
                </option>
              </select>
            </div>
          );
        })}
      </div>

      {/* MOBILE */}
      <div className="flex flex-col gap-3 p-3 md:hidden">
        {checkedInPlayers.map((player) => {
          const amount =
            player.gender === "FEMALE"
              ? priceFemale
              : priceMale;

          return (
            <div
              key={player.id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {player.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {paymentLabel[player.paymentMethod]}
                  </p>
                </div>

                <p className="font-bold text-text">
                  {amount.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>

              <select
                value={player.paymentMethod}
                onChange={(event) =>
                  onUpdatePlayer(player.id, {
                    paymentMethod:
                      event.target
                        .value as PaymentMethod,
                  })
                }
                className="mt-4 w-full rounded-lg border border-placeholder bg-white px-3 py-3 text-sm text-text outline-none"
              >
                <option value="UNPAID">
                  Chưa thanh toán
                </option>

                <option value="CASH">
                  Tiền mặt
                </option>

                <option value="TRANSFER">
                  Chuyển khoản
                </option>
              </select>
            </div>
          );
        })}
      </div>
    </WhiteCard>
  );
}