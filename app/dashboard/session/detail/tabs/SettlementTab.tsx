"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Check,
  CircleDollarSign,
  Pencil,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";

import { SessionDetail, SessionPlayer } from "../types";

interface SettlementTabProps {
  session: SessionDetail;
  players: SessionPlayer[];

  actualShuttleCock: number;

  onActualShuttleCockChange: (value: number) => void;

  onPriceChange: (
    priceMale: number,
    priceFemale: number,
  ) => void;
}

export default function SettlementTab({
  session,
  players,
  actualShuttleCock,
  onActualShuttleCockChange,
  onPriceChange,
}: SettlementTabProps) {
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
  }, [
    session.priceMale,
    session.priceFemale,
    isEditingPrice,
  ]);

  const settlement = useMemo(() => {
    const checkedInPlayers = players.filter(
      (player) => player.checkedIn,
    );

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
     * OTHER hiện tại được tính theo giá Nam.
     */
    const malePriceCount = maleCount + otherCount;

    const totalPlayerCount =
      malePriceCount + femaleCount;

    /*
     * Chi phí cầu thực tế.
     */
    const shuttleCost =
      actualShuttleCock * session.pricePerShuttleCock;

    /*
     * Tổng chi phí session.
     */
    const totalCost =
      session.totalCourtPrice + shuttleCost;

    /*
     * Giữ chênh lệch giá Nam/Nữ đã thiết lập
     * khi tạo session.
     */
    const priceDifference =
      session.priceMale - session.priceFemale;

    /*
     * Hệ phương trình:
     *
     * M - F = D
     *
     * malePriceCount * M
     * + femaleCount * F
     * = totalCost
     *
     * =>
     *
     * F =
     * (totalCost - malePriceCount * D)
     * / totalPlayerCount
     *
     * M = F + D
     */
    let suggestedMale = 0;
    let suggestedFemale = 0;
    let canSuggestPrice = false;

    if (totalPlayerCount > 0) {
      suggestedFemale =
        (totalCost -
          malePriceCount * priceDifference) /
        totalPlayerCount;

      suggestedMale =
        suggestedFemale + priceDifference;

      canSuggestPrice =
        suggestedMale >= 0 &&
        suggestedFemale >= 0;
    }

    /*
     * Nếu đang Edit thì preview doanh thu,
     * lợi nhuận theo giá đang nhập.
     *
     * Nếu không Edit thì dùng giá đã lưu.
     */
    const currentPriceMale = isEditingPrice
      ? Number(draftPriceMale) || 0
      : session.priceMale;

    const currentPriceFemale = isEditingPrice
      ? Number(draftPriceFemale) || 0
      : session.priceFemale;

    const revenue =
      malePriceCount * currentPriceMale +
      femaleCount * currentPriceFemale;

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
      setPriceError(
        "Giá Nam và giá Nữ phải là số hợp lệ và không nhỏ hơn 0.",
      );

      return;
    }

    onPriceChange(priceMale, priceFemale);

    setPriceError("");
    setIsEditingPrice(false);
  };

  const handleUseSuggestedPrice = () => {
    if (!settlement.canSuggestPrice) return;

    setDraftPriceMale(
      String(Math.round(settlement.suggestedMale)),
    );

    setDraftPriceFemale(
      String(Math.round(settlement.suggestedFemale)),
    );

    setPriceError("");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* SETTLEMENT INPUT */}
      <WhiteCard className="flex-col items-stretch">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h3 className="text-xl font-semibold text-text">
              Settlement
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Finalize shuttlecock usage and calculate the
              final session profit.
            </p>
          </div>

          {!isEditingPrice ? (
            <Button
              type="button"
              onClick={handleStartEdit}
              background="bg-white"
              color="text-text"
              className="border border-placeholder sm:w-fit sm:px-5"
            >
              <Pencil size={15} />
              Edit Price
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCancelEdit}
                background="bg-white"
                color="text-gray-600"
                className="border border-gray-300 sm:w-fit sm:px-4"
              >
                <X size={15} />
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSavePrice}
                className="sm:w-fit sm:px-4"
              >
                <Check size={15} />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* ACTUAL SHUTTLECOCK */}
        <div className="mt-4">
          <Input
            id="actual-shuttle"
            label="Actual ShuttleCock Used"
            type="number"
            min={0}
            value={actualShuttleCock}
            onChange={(event) =>
              onActualShuttleCockChange(
                Number(event.target.value),
              )
            }
          />

          <p className="mt-2 text-xs text-gray-500">
            Expected: {session.expectedShuttleCock} shuttlecocks
            • Unit price:{" "}
            {formatMoney(session.pricePerShuttleCock)}
          </p>
        </div>

        {/* ACTUAL PLAYER INFO */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InformationCard
            label="Checked In"
            value={`${settlement.checkedInCount} players`}
          />

          <InformationCard
            label="Male"
            value={`${settlement.maleCount} players`}
          />

          <InformationCard
            label="Female"
            value={`${settlement.femaleCount} players`}
          />

          <InformationCard
            label="Other"
            value={`${settlement.otherCount} players`}
          />
        </div>

        {/* PRICE */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-semibold text-text">
                Player Price
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Original difference:{" "}
                {formatMoney(
                  settlement.priceDifference,
                )}
              </p>
            </div>

            {isEditingPrice &&
              settlement.canSuggestPrice && (
                <button
                  type="button"
                  onClick={handleUseSuggestedPrice}
                  className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-bg px-3 py-2 text-sm font-semibold text-text transition hover:bg-placeholder/40"
                >
                  <Sparkles size={15} />
                  Use Suggested Price
                </button>
              )}
          </div>

          <div className="grid gap-0 md:grid-cols-2 md:gap-4">
            {/* MALE PRICE */}
            <div>
              <Input
                id="settlement-male"
                label="Price Male"
                type="number"
                min={0}
                value={draftPriceMale}
                readOnly={!isEditingPrice}
                onChange={(event) =>
                  setDraftPriceMale(event.target.value)
                }
                className={
                  !isEditingPrice
                    ? "cursor-not-allowed bg-gray-100"
                    : ""
                }
              />

              <PriceSuggestion
                price={settlement.suggestedMale}
                canSuggest={
                  settlement.canSuggestPrice
                }
              />
            </div>

            {/* FEMALE PRICE */}
            <div>
              <Input
                id="settlement-female"
                label="Price Female"
                type="number"
                min={0}
                value={draftPriceFemale}
                readOnly={!isEditingPrice}
                onChange={(event) =>
                  setDraftPriceFemale(event.target.value)
                }
                className={
                  !isEditingPrice
                    ? "cursor-not-allowed bg-gray-100"
                    : ""
                }
              />

              <PriceSuggestion
                price={settlement.suggestedFemale}
                canSuggest={
                  settlement.canSuggestPrice
                }
              />
            </div>
          </div>

          {priceError && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {priceError}
            </p>
          )}

          {isEditingPrice && (
            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-700">
                Preview mode
              </p>

              <p className="mt-1 text-xs leading-5 text-yellow-600">
                Revenue và Profit/Loss bên dưới đang được tính
                theo giá Nam/Nữ bạn đang chỉnh. Giá chỉ được lưu
                khi nhấn Save.
              </p>
            </div>
          )}
        </div>

        {/* SUGGESTED PRICE EXPLANATION */}
        {settlement.canSuggestPrice ? (
          <div className="mt-5 rounded-xl border border-placeholder bg-main0 p-4">
            <div className="flex items-center gap-2 text-text">
              <CircleDollarSign size={18} />

              <p className="font-semibold">
                Suggested Break-even Price
              </p>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Giá gợi ý được tính dựa trên số người check-in
              thực tế, số cầu sử dụng thực tế và giữ nguyên mức
              chênh lệch Nam/Nữ đã thiết lập.
            </p>

            <div className="mt-3 grid gap-2 text-sm text-gray-600">
              <p>
                Actual Cost = Court Cost + Actual ShuttleCock
                Cost
              </p>

              <p>
                Male Price - Female Price ={" "}
                {formatMoney(
                  settlement.priceDifference,
                )}
              </p>

              <p>
                Revenue at suggested prices = Actual Cost
              </p>
            </div>

            {settlement.otherCount > 0 && (
              <p className="mt-3 text-xs text-gray-500">
                {settlement.otherCount} player(s) có Gender =
                OTHER hiện được tính theo mức giá Nam.
              </p>
            )}
          </div>
        ) : (
          settlement.totalPlayerCount > 0 && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-600">
                Không thể tính mức giá gợi ý hợp lệ.
              </p>

              <p className="mt-1 text-xs text-red-500">
                Mức chênh lệch Nam/Nữ hiện tại quá lớn so với
                chi phí và số lượng người chơi thực tế.
              </p>
            </div>
          )
        )}
      </WhiteCard>

      {/* COST SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Court Cost"
          value={session.totalCourtPrice}
        />

        <SummaryCard
          label="Actual ShuttleCock Cost"
          value={settlement.shuttleCost}
        />

        <SummaryCard
          label="Total Cost"
          value={settlement.totalCost}
        />

        <SummaryCard
          label={
            isEditingPrice
              ? "Preview Revenue"
              : "Revenue"
          }
          value={settlement.revenue}
        />

        <SummaryCard
          label={
            isEditingPrice
              ? "Preview Profit / Loss"
              : "Profit / Loss"
          }
          value={settlement.profit}
          highlight
        />
      </div>

      {/* BREAKDOWN */}
      <WhiteCard className="flex-col items-stretch">
        <h3 className="font-semibold text-text">
          Revenue Breakdown
        </h3>

        <div className="mt-4 flex flex-col gap-3">
          <BreakdownRow
            label={`Male (${settlement.maleCount})`}
            value={
              settlement.maleCount *
              settlement.currentPriceMale
            }
          />

          {settlement.otherCount > 0 && (
            <BreakdownRow
              label={`Other (${settlement.otherCount})`}
              value={
                settlement.otherCount *
                settlement.currentPriceMale
              }
            />
          )}

          <BreakdownRow
            label={`Female (${settlement.femaleCount})`}
            value={
              settlement.femaleCount *
              settlement.currentPriceFemale
            }
          />

          <div className="border-t border-gray-200 pt-3">
            <BreakdownRow
              label="Total Revenue"
              value={settlement.revenue}
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

function InformationCard({
  label,
  value,
}: InformationCardProps) {
  return (
    <div className="rounded-xl bg-bg p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

interface PriceSuggestionProps {
  price: number;
  canSuggest: boolean;
}

function PriceSuggestion({
  price,
  canSuggest,
}: PriceSuggestionProps) {
  if (!canSuggest) {
    return (
      <p className="mt-2 text-xs text-gray-400">
        Suggested price is unavailable.
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-gray-500">
      Suggested break-even:{" "}
      <span className="font-semibold text-text">
        {formatMoney(Math.round(price))}
      </span>
    </p>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: SummaryCardProps) {
  const valueStyle = highlight
    ? value > 0
      ? "text-text"
      : value < 0
        ? "text-red-600"
        : "text-gray-600"
    : "text-gray-800";

  return (
    <WhiteCard className="flex-col items-start">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${valueStyle}`}
      >
        {formatMoney(value)}
      </p>

      {highlight && (
        <p
          className={`mt-1 text-xs ${
            value > 0
              ? "text-text"
              : value < 0
                ? "text-red-500"
                : "text-gray-500"
          }`}
        >
          {value > 0
            ? "Profit"
            : value < 0
              ? "Loss"
              : "Break-even"}
        </p>
      )}
    </WhiteCard>
  );
}

interface BreakdownRowProps {
  label: string;
  value: number;
  bold?: boolean;
}

function BreakdownRow({
  label,
  value,
  bold = false,
}: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          bold
            ? "font-semibold text-gray-800"
            : "text-sm text-gray-600"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold text-text"
            : "text-sm font-semibold"
        }
      >
        {formatMoney(value)}
      </span>
    </div>
  );
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")} VNĐ`;
}