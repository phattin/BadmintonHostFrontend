"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { Check, CircleDollarSign, Pencil, Sparkles, X } from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";

import { SessionDetail, SessionPlayer } from "../types";

interface SettlementTabProps {
  session: SessionDetail;
  players: SessionPlayer[];

  actualShuttleCock: number;

  onActualShuttleCockChange: (value: number) => void;

  onPriceChange: (priceMale: number, priceFemale: number) => void;
}

export default function SettlementTab({
  session,
  players,
  actualShuttleCock,
  onActualShuttleCockChange,
  onPriceChange,
}: SettlementTabProps) {
  const t = useTranslations("sessionDetail");
  const format = useFormatter();

  const formatMoney = (value: number) =>
    `${format.number(Math.round(value))} ${t("currencyVnd")}`;

  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const [draftPriceMale, setDraftPriceMale] = useState(
    String(session.priceMale),
  );

  const [draftPriceFemale, setDraftPriceFemale] = useState(
    String(session.priceFemale),
  );

  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    if (isEditingPrice) return;

    setDraftPriceMale(String(session.priceMale));

    setDraftPriceFemale(String(session.priceFemale));
  }, [session.priceMale, session.priceFemale, isEditingPrice]);

  const settlement = useMemo(() => {
    const checkedInPlayers = players.filter((player) => player.checkedIn);

    const maleCount = checkedInPlayers.filter(
      (player) => player.gender === "MALE",
    ).length;

    const femaleCount = checkedInPlayers.filter(
      (player) => player.gender === "FEMALE",
    ).length;

    const otherCount = checkedInPlayers.filter(
      (player) => player.gender === "OTHER",
    ).length;

    /*
     * OTHER hiện tại tính theo giá Nam.
     */
    const malePriceCount = maleCount + otherCount;

    const totalPlayerCount = malePriceCount + femaleCount;

    /*
     * Chi phí cầu thực tế.
     */
    const shuttleCost = actualShuttleCock * session.pricePerShuttleCock;

    /*
     * Tổng chi phí session.
     */
    const totalCost = session.totalCourtPrice + shuttleCost;

    /*
     * Giữ chênh lệch giá Nam/Nữ
     * lúc tạo Session.
     */
    const priceDifference = session.priceMale - session.priceFemale;

    /*
     * M - F = D
     *
     * malePriceCount * M
     * + femaleCount * F
     * = totalCost
     */
    let suggestedMale = 0;
    let suggestedFemale = 0;
    let canSuggestPrice = false;

    if (totalPlayerCount > 0) {
      suggestedFemale =
        (totalCost - malePriceCount * priceDifference) / totalPlayerCount;

      suggestedMale = suggestedFemale + priceDifference;

      canSuggestPrice = suggestedMale >= 0 && suggestedFemale >= 0;
    }

    /*
     * Khi Edit:
     * preview Revenue và Profit/Loss
     * theo giá đang nhập.
     */
    const currentPriceMale = isEditingPrice
      ? Number(draftPriceMale) || 0
      : session.priceMale;

    const currentPriceFemale = isEditingPrice
      ? Number(draftPriceFemale) || 0
      : session.priceFemale;

    const revenue =
      malePriceCount * currentPriceMale + femaleCount * currentPriceFemale;

    const profit = revenue - totalCost;

    return {
      checkedInCount: checkedInPlayers.length,

      maleCount,
      femaleCount,
      otherCount,

      malePriceCount,
      totalPlayerCount,

      shuttleCost,
      totalCost,

      priceDifference,

      suggestedMale,
      suggestedFemale,
      canSuggestPrice,

      currentPriceMale,
      currentPriceFemale,

      revenue,
      profit,
    };
  }, [
    players,
    actualShuttleCock,
    session,
    isEditingPrice,
    draftPriceMale,
    draftPriceFemale,
  ]);

  const handleStartEdit = () => {
    setDraftPriceMale(String(session.priceMale));

    setDraftPriceFemale(String(session.priceFemale));

    setPriceError("");
    setIsEditingPrice(true);
  };

  const handleCancelEdit = () => {
    setDraftPriceMale(String(session.priceMale));

    setDraftPriceFemale(String(session.priceFemale));

    setPriceError("");
    setIsEditingPrice(false);
  };

  const handleSavePrice = () => {
    const priceMale = Number(draftPriceMale);

    const priceFemale = Number(draftPriceFemale);

    if (
      !Number.isFinite(priceMale) ||
      !Number.isFinite(priceFemale) ||
      priceMale < 0 ||
      priceFemale < 0
    ) {
      setPriceError(t("invalidPrices"));

      return;
    }

    onPriceChange(priceMale, priceFemale);

    setPriceError("");
    setIsEditingPrice(false);
  };

  const handleUseSuggestedPrice = () => {
    if (!settlement.canSuggestPrice) {
      return;
    }

    setDraftPriceMale(
      String(Math.ceil(settlement.suggestedMale / 1000) * 1000),
    );

    setDraftPriceFemale(
      String(Math.ceil(settlement.suggestedFemale / 1000) * 1000),
    );

    setPriceError("");
  };

  const handleActualShuttleChange = (value: string) => {
    const numberValue = Number(value);

    onActualShuttleCockChange(
      Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* SETTLEMENT */}
      <WhiteCard className="flex-col items-stretch">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {t("settlement")}
            </h3>

            <p className="mt-1 text-sm text-foreground/60">
              {t("settlementDescription")}
            </p>
          </div>

          {!isEditingPrice ? (
            <Button
              type="button"
              onClick={handleStartEdit}
              background="bg-surface"
              color="text-primary"
              className="border border-placeholder sm:w-fit sm:px-5"
            >
              <Pencil size={15} />
              {t("editPrice")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCancelEdit}
                background="bg-surface"
                color="text-foreground/70"
                className="border border-foreground/20 sm:w-fit sm:px-4"
              >
                <X size={15} />
                {t("cancel")}
              </Button>

              <Button
                type="button"
                onClick={handleSavePrice}
                className="sm:w-fit sm:px-4"
              >
                <Check size={15} />
                {t("save")}
              </Button>
            </div>
          )}
        </div>

        {/* ACTUAL SHUTTLECOCK */}
        <div className="mt-4">
          <Input
            id="actual-shuttle"
            label={t("actualShuttleUsed")}
            type="number"
            min={0}
            value={actualShuttleCock}
            onChange={(event) => handleActualShuttleChange(event.target.value)}
          />

          <p className="mt-2 text-xs text-foreground/60">
            {t("expectedUnitPrice", {
              count: session.expectedShuttleCock,
              price: formatMoney(session.pricePerShuttleCock),
            })}
          </p>
        </div>

        {/* PLAYER INFORMATION */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InformationCard
            label={t("checkedIn")}
            value={t("playersCountOnly", { count: settlement.checkedInCount })}
          />

          <InformationCard
            label={t("male")}
            value={t("playersCountOnly", { count: settlement.maleCount })}
          />

          <InformationCard
            label={t("female")}
            value={t("playersCountOnly", { count: settlement.femaleCount })}
          />

          <InformationCard
            label={t("other")}
            value={t("playersCountOnly", { count: settlement.otherCount })}
          />
        </div>

        {/* PRICE */}
        <div className="mt-6 border-t border-foreground/20 pt-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-semibold text-primary">{t("playerPrice")}</h4>

              <p className="mt-1 text-xs text-foreground/60">
                {t("originalDifference")}{" "}
                {formatMoney(settlement.priceDifference)}
              </p>
            </div>

            {isEditingPrice && settlement.canSuggestPrice && (
              <button
                type="button"
                onClick={handleUseSuggestedPrice}
                className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-tag px-3 py-2 text-sm font-semibold text-primary transition hover:opacity-80"
              >
                <Sparkles size={15} />
                {t("useSuggestedPrice")}
              </button>
            )}
          </div>

          <div className="grid gap-0 md:grid-cols-2 md:gap-4">
            {/* MALE PRICE */}
            <div>
              <Input
                id="settlement-male"
                label={t("priceMale")}
                type="number"
                min={0}
                value={draftPriceMale}
                readOnly={!isEditingPrice}
                onChange={(event) => setDraftPriceMale(event.target.value)}
                className={
                  !isEditingPrice
                    ? "cursor-not-allowed bg-tag text-foreground/60"
                    : ""
                }
              />

              <PriceSuggestion
                price={settlement.suggestedMale}
                canSuggest={settlement.canSuggestPrice}
                formatMoney={formatMoney}
              />
            </div>

            {/* FEMALE PRICE */}
            <div>
              <Input
                id="settlement-female"
                label={t("priceFemale")}
                type="number"
                min={0}
                value={draftPriceFemale}
                readOnly={!isEditingPrice}
                onChange={(event) => setDraftPriceFemale(event.target.value)}
                className={
                  !isEditingPrice
                    ? "cursor-not-allowed bg-tag text-foreground/60"
                    : ""
                }
              />

              <PriceSuggestion
                price={settlement.suggestedFemale}
                canSuggest={settlement.canSuggestPrice}
                formatMoney={formatMoney}
              />
            </div>
          </div>

          {/* ERROR */}
          {priceError && (
            <div className="mt-4 rounded-xl border border-colorWrong/30 bg-colorWrong/10 p-4">
              <p className="text-sm font-medium text-colorWrong">
                {priceError}
              </p>
            </div>
          )}

          {/* PREVIEW MODE */}
          {isEditingPrice && (
            <div className="mt-4 rounded-xl border border-placeholder bg-tag p-4">
              <div className="flex items-center gap-2 text-primary">
                <Pencil size={16} />

                <p className="text-sm font-semibold">{t("previewMode")}</p>
              </div>

              <p className="mt-1 text-xs leading-5 text-foreground/60">
                {t("previewDescription")}
              </p>
            </div>
          )}
        </div>

        {/* SUGGESTED PRICE */}
        {settlement.canSuggestPrice ? (
          <div className="mt-5 rounded-xl border border-placeholder bg-tag p-4">
            <div className="flex items-center gap-2 text-primary">
              <CircleDollarSign size={18} />

              <p className="font-semibold">{t("suggestedBreakEven")}</p>
            </div>

            <p className="mt-2 text-sm leading-6 text-foreground/70">
              {t("suggestedPriceDescription")}
            </p>

            <div className="mt-4 grid gap-2 rounded-lg bg-surface/60 p-3 text-sm text-foreground/70">
              <p>{t("actualCostFormula")}</p>

              <p>
                {t("priceDifferenceFormula")}{" "}
                <span className="font-semibold text-primary">
                  {formatMoney(settlement.priceDifference)}
                </span>
              </p>

              <p>{t("suggestedRevenueFormula")}</p>
            </div>

            {settlement.otherCount > 0 && (
              <p className="mt-3 text-xs text-foreground/60">
                {t("otherPriceNote", { count: settlement.otherCount })}
              </p>
            )}
          </div>
        ) : (
          settlement.totalPlayerCount > 0 && (
            <div className="mt-5 rounded-xl border border-colorWrong/30 bg-colorWrong/10 p-4">
              <p className="text-sm font-semibold text-colorWrong">
                {t("invalidSuggestedPrice")}
              </p>

              <p className="mt-1 text-xs leading-5 text-colorWrong/80">
                {t("invalidSuggestedPriceDescription")}
              </p>
            </div>
          )
        )}
      </WhiteCard>

      {/* COST SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label={t("courtCost")}
          value={session.totalCourtPrice}
          formatMoney={formatMoney}
        />

        <SummaryCard
          label={t("actualShuttleCost")}
          value={settlement.shuttleCost}
          formatMoney={formatMoney}
        />

        <SummaryCard
          label={t("totalCost")}
          value={settlement.totalCost}
          formatMoney={formatMoney}
        />

        <SummaryCard
          label={isEditingPrice ? t("previewRevenue") : t("revenue")}
          value={settlement.revenue}
          formatMoney={formatMoney}
        />

        <SummaryCard
          label={isEditingPrice ? t("previewProfitLoss") : t("profitLoss")}
          value={settlement.profit}
          formatMoney={formatMoney}
          highlight
        />
      </div>

      {/* REVENUE BREAKDOWN */}
      <WhiteCard className="flex-col items-stretch">
        <div>
          <h3 className="font-semibold text-primary">
            {t("revenueBreakdown")}
          </h3>

          <p className="mt-1 text-sm text-foreground/60">
            {t("revenueFromCheckedIn")}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <BreakdownRow
            label={t("breakdownMale", { count: settlement.maleCount })}
            value={settlement.maleCount * settlement.currentPriceMale}
            formatMoney={formatMoney}
          />

          {settlement.otherCount > 0 && (
            <BreakdownRow
              label={t("breakdownOther", { count: settlement.otherCount })}
              value={settlement.otherCount * settlement.currentPriceMale}
              formatMoney={formatMoney}
            />
          )}

          <BreakdownRow
            label={t("breakdownFemale", { count: settlement.femaleCount })}
            value={settlement.femaleCount * settlement.currentPriceFemale}
            formatMoney={formatMoney}
          />

          <div className="border-t border-foreground/20 pt-3">
            <BreakdownRow
              label={t("totalRevenue")}
              value={settlement.revenue}
              formatMoney={formatMoney}
              bold
            />
          </div>
        </div>
      </WhiteCard>
    </div>
  );
}

interface InformationCardProps {
  label: string;
  value: string;
}

function InformationCard({ label, value }: InformationCardProps) {
  return (
    <div className="rounded-xl bg-tag p-4">
      <p className="text-xs text-foreground/60">{label}</p>

      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

interface PriceSuggestionProps {
  price: number;
  canSuggest: boolean;
  formatMoney: (value: number) => string;
}

function PriceSuggestion({
  price,
  canSuggest,
  formatMoney,
}: PriceSuggestionProps) {
  const t = useTranslations("sessionDetail");

  if (!canSuggest) {
    return (
      <p className="mt-2 text-xs text-foreground/40">
        {t("suggestedUnavailable")}
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-foreground/60">
      {t("suggestedBreakEvenShort")}{" "}
      <span className="font-semibold text-primary">
        {formatMoney(Math.round(price))}
      </span>
    </p>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  formatMoney: (value: number) => string;
  highlight?: boolean;
}

function SummaryCard({
  label,
  value,
  formatMoney,
  highlight = false,
}: SummaryCardProps) {
  const t = useTranslations("sessionDetail");
  const valueStyle = highlight
    ? value > 0
      ? "text-primary"
      : value < 0
        ? "text-colorWrong"
        : "text-foreground/60"
    : "text-foreground";

  return (
    <WhiteCard
      className={`flex-col items-start border ${
        highlight
          ? value < 0
            ? "border-colorWrong/30"
            : value > 0
              ? "border-primary/30"
              : "border-foreground/10"
          : "border-foreground/10"
      }`}
    >
      <p className="text-sm text-foreground/60">{label}</p>

      <p className={`mt-2 text-xl font-bold ${valueStyle}`}>
        {formatMoney(value)}
      </p>

      {highlight && (
        <div
          className={`mt-2 rounded-full px-2.5 py-1 text-xs font-semibold ${
            value > 0
              ? "bg-tag text-primary"
              : value < 0
                ? "bg-colorWrong/10 text-colorWrong"
                : "bg-foreground/10 text-foreground/60"
          }`}
        >
          {value > 0 ? t("profit") : value < 0 ? t("loss") : t("breakEven")}
        </div>
      )}
    </WhiteCard>
  );
}

interface BreakdownRowProps {
  label: string;
  value: number;
  formatMoney: (value: number) => string;
  bold?: boolean;
}

function BreakdownRow({
  label,
  value,
  formatMoney,
  bold = false,
}: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          bold ? "font-semibold text-foreground" : "text-sm text-foreground/70"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold text-primary"
            : "text-sm font-semibold text-foreground"
        }
      >
        {formatMoney(value)}
      </span>
    </div>
  );
}

