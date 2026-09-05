"use client";

import { Check, CircleDollarSign, Users } from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";

import { PaymentMethod, SessionPlayer } from "../types";
import { useTranslations } from "next-intl";

interface PaymentsTabProps {
  players: SessionPlayer[];

  priceMale: number;

  priceFemale: number;

  onUpdatePlayer: (playerId: number, data: Partial<SessionPlayer>) => void;
}

export default function PaymentsTab({
  players,
  priceMale,
  priceFemale,
  onUpdatePlayer,
}: PaymentsTabProps) {
  const t = useTranslations("sessionDetail");
  const getPaymentLabel = (method: PaymentMethod) =>
    method === "UNPAID"
      ? t("unpaid")
      : method === "CASH"
        ? t("cash")
        : t("transfer");
  const checkedInPlayers = players.filter((player) => player.checkedIn);

  const paidCount = checkedInPlayers.filter(
    (player) => player.paymentMethod !== "UNPAID",
  ).length;

  const unpaidCount = checkedInPlayers.length - paidCount;

  const paymentProgress =
    checkedInPlayers.length > 0
      ? (paidCount / checkedInPlayers.length) * 100
      : 0;

  const totalRevenue = checkedInPlayers.reduce((total, player) => {
    const amount = player.gender === "FEMALE" ? priceFemale : priceMale;

    return total + amount;
  }, 0);

  const collectedRevenue = checkedInPlayers.reduce((total, player) => {
    if (player.paymentMethod === "UNPAID") {
      return total;
    }

    const amount = player.gender === "FEMALE" ? priceFemale : priceMale;

    return total + amount;
  }, 0);

  const handlePaymentChange = (
    playerId: number,
    paymentMethod: PaymentMethod,
  ) => {
    onUpdatePlayer(playerId, {
      paymentMethod,
    });
  };

  const getPlayerAmount = (player: SessionPlayer) => {
    return player.gender === "FEMALE" ? priceFemale : priceMale;
  };

  const getGenderLabel = (gender: SessionPlayer["gender"]) => {
    if (gender === "MALE") {
      return t("male");
    }

    if (gender === "FEMALE") {
      return t("female");
    }

    return t("other");
  };

  return (
    <WhiteCard padding="p-0" className="flex-col items-stretch">
      {/* HEADER */}
      <div className="border-b border-foreground/20 p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {t("payments")}
            </h3>

            <p className="mt-1 text-sm text-foreground/60">
              {t("paymentsDescription")}
            </p>
          </div>

          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-tag text-primary">
            <CircleDollarSign size={22} />
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        {checkedInPlayers.length > 0 && (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <PaymentSummaryCard
                label={t("paid")}
                value={`${paidCount}/${checkedInPlayers.length}`}
                positive
              />

              <PaymentSummaryCard
                label={t("unpaid")}
                value={`${unpaidCount}`}
                danger={unpaidCount > 0}
              />

              <PaymentSummaryCard
                label={t("collected")}
                value={formatMoney(collectedRevenue)}
              />
            </div>

            {/* PROGRESS */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs text-foreground/60">
                  {t("paymentProgress")}
                </span>

                <span className="text-xs font-semibold text-primary">
                  {Math.round(paymentProgress)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${paymentProgress}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {checkedInPlayers.length > 0 ? (
        <>
          {/* DESKTOP */}
          <div className="hidden md:block">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr] bg-tag px-5 py-4 text-sm font-semibold">
              <span>{t("name")}</span>
              <span>{t("gender")}</span>
              <span>{t("amount")}</span>
              <span>{t("payment")}</span>
            </div>

            {/* TABLE BODY */}
            {checkedInPlayers.map((player) => {
              const amount = getPlayerAmount(player);

              const isPaid = player.paymentMethod !== "UNPAID";

              return (
                <div
                  key={player.id}
                  className="grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr] items-center border-b border-foreground/20 px-5 py-4 last:border-b-0"
                >
                  {/* PLAYER */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                        isPaid
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

                      <p className="mt-1 text-xs text-foreground/60">
                        {player.level === "NEWBIE" ? "Newbie" : player.level}
                      </p>
                    </div>
                  </div>

                  {/* GENDER */}
                  <span className="text-sm text-foreground/70">
                    {getGenderLabel(player.gender)}
                  </span>

                  {/* AMOUNT */}
                  <span className="font-semibold text-primary">
                    {formatMoney(amount)}
                  </span>

                  {/* PAYMENT */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        isPaid ? "bg-primary" : "bg-colorWrong"
                      }`}
                    />

                    <select
                      value={player.paymentMethod}
                      onChange={(event) =>
                        handlePaymentChange(
                          player.id,
                          event.target.value as PaymentMethod,
                        )
                      }
                      className={`w-full cursor-pointer rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                        isPaid
                          ? "border-primary/30 text-primary focus:border-primary focus:ring-primary/20"
                          : "border-colorWrong/30 text-colorWrong focus:border-colorWrong focus:ring-colorWrong/20"
                      }`}
                    >
                      <option value="UNPAID">{t("unpaid")}</option>

                      <option value="CASH">{t("cash")}</option>

                      <option value="TRANSFER">{t("transfer")}</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOBILE */}
          <div className="flex flex-col gap-3 p-3 md:hidden">
            {checkedInPlayers.map((player) => {
              const amount = getPlayerAmount(player);

              const isPaid = player.paymentMethod !== "UNPAID";

              return (
                <div
                  key={player.id}
                  className={`rounded-xl border p-4 transition ${
                    isPaid
                      ? "border-primary/30 bg-tag/40"
                      : "border-foreground/20 bg-surface"
                  }`}
                >
                  {/* PLAYER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-full font-semibold ${
                          isPaid
                            ? "bg-primary text-surface"
                            : "bg-tag text-primary"
                        }`}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">{player.name}</p>

                        <p className="mt-1 text-xs text-foreground/60">
                          {getGenderLabel(player.gender)} •{" "}
                          {player.level === "NEWBIE"
                            ? t("newbie")
                            : player.level}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 font-bold text-primary">
                      {formatMoney(amount)}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                      isPaid
                        ? "bg-tag text-primary"
                        : "bg-colorWrong/10 text-colorWrong"
                    }`}
                  >
                    {isPaid && <Check size={14} />}

                    {getPaymentLabel(player.paymentMethod)}
                  </div>

                  {/* PAYMENT METHOD */}
                  <select
                    value={player.paymentMethod}
                    onChange={(event) =>
                      handlePaymentChange(
                        player.id,
                        event.target.value as PaymentMethod,
                      )
                    }
                    className={`mt-3 w-full cursor-pointer rounded-lg border bg-surface px-3 py-3 text-sm outline-none transition focus:ring-2 ${
                      isPaid
                        ? "border-primary/30 text-primary focus:border-primary focus:ring-primary/20"
                        : "border-colorWrong/30 text-colorWrong focus:border-colorWrong focus:ring-colorWrong/20"
                    }`}
                  >
                    <option value="UNPAID">{t("unpaid")}</option>

                    <option value="CASH">{t("cash")}</option>

                    <option value="TRANSFER">{t("transfer")}</option>
                  </select>
                </div>
              );
            })}
          </div>

          {/* TOTAL */}
          <div className="border-t border-foreground/20 p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-foreground/60">
                  {t("expectedRevenue")}
                </p>

                <p className="mt-1 font-semibold text-foreground">
                  {formatMoney(totalRevenue)}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-foreground/60">
                  {t("collectedRevenue")}
                </p>

                <p className="mt-1 text-lg font-bold text-primary">
                  {formatMoney(collectedRevenue)}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center px-5 py-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-tag text-primary">
            <Users size={24} />
          </div>

          <p className="mt-3 font-semibold text-foreground">{t("noPlayers")}</p>

          <p className="mt-1 max-w-sm text-center text-sm text-foreground/60">
            {t("checkInFirst")}
          </p>
        </div>
      )}
    </WhiteCard>
  );
}

interface PaymentSummaryCardProps {
  label: string;
  value: string;
  positive?: boolean;
  danger?: boolean;
}

function PaymentSummaryCard({
  label,
  value,
  positive = false,
  danger = false,
}: PaymentSummaryCardProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        danger
          ? "border-colorWrong/20 bg-colorWrong/10"
          : positive
            ? "border-primary/20 bg-tag"
            : "border-foreground/10 bg-surface"
      }`}
    >
      <p className="text-xs text-foreground/60">{label}</p>

      <p
        className={`mt-1 font-bold ${
          danger
            ? "text-colorWrong"
            : positive
              ? "text-primary"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")} VNĐ`;
}
