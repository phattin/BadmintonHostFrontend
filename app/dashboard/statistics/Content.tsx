"use client";

import { ReactNode, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  CalendarCheck,
  CircleDollarSign,
  Download,
  Landmark,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";

import ManagementPage from "@/app/components/ManagementPage";
import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";

import RevenueChart, { RevenueChartData } from "./RevenueChart";

type Period = "TODAY" | "WEEK" | "MONTH" | "YEAR";
type ChartPeriod = "DAY" | "MONTH" | "YEAR";

interface RevenueSummary {
  totalRevenue: number;
  outstanding: number;
  settledSessions: number;
  profit: number;
  revenueChange: string;
  outstandingSessions: number;
}

interface OutstandingItem {
  id: number;
  sessionName: string;
  playerName: string;
  date: string;
  amount: number;
}

const summaries: Record<Period, RevenueSummary> = {
  TODAY: {
    totalRevenue: 2850000,
    outstanding: 450000,
    settledSessions: 4,
    profit: 2180000,
    revenueChange: "+8.4%",
    outstandingSessions: 2,
  },
  WEEK: {
    totalRevenue: 12650000,
    outstanding: 1250000,
    settledSessions: 22,
    profit: 10350000,
    revenueChange: "+10.8%",
    outstandingSessions: 5,
  },
  MONTH: {
    totalRevenue: 45200000,
    outstanding: 3450000,
    settledSessions: 128,
    profit: 38500000,
    revenueChange: "+12.5%",
    outstandingSessions: 14,
  },
  YEAR: {
    totalRevenue: 428500000,
    outstanding: 6800000,
    settledSessions: 1042,
    profit: 356000000,
    revenueChange: "+18.2%",
    outstandingSessions: 31,
  },
};

const dayData: RevenueChartData[] = [
  {
    label: "08:00",
    revenue: 450000,
  },
  {
    label: "10:00",
    revenue: 950000,
  },
  {
    label: "12:00",
    revenue: 1250000,
  },
  {
    label: "14:00",
    revenue: 1600000,
  },
  {
    label: "16:00",
    revenue: 2100000,
  },
  {
    label: "18:00",
    revenue: 2850000,
  },
];

const monthData: RevenueChartData[] = [
  {
    label: "Jan",
    revenue: 24500000,
  },
  {
    label: "Feb",
    revenue: 29800000,
  },
  {
    label: "Mar",
    revenue: 35400000,
  },
  {
    label: "Apr",
    revenue: 32700000,
  },
  {
    label: "May",
    revenue: 41800000,
  },
  {
    label: "Jun",
    revenue: 45200000,
  },
];

const yearData: RevenueChartData[] = [
  {
    label: "2022",
    revenue: 185000000,
  },
  {
    label: "2023",
    revenue: 238000000,
  },
  {
    label: "2024",
    revenue: 294000000,
  },
  {
    label: "2025",
    revenue: 362000000,
  },
  {
    label: "2026",
    revenue: 428500000,
  },
];

const outstandingItems: OutstandingItem[] = [
  {
    id: 1,
    sessionName: "Court 2 - Evening Pass",
    playerName: "Minh Tuấn",
    date: "12 Mar",
    amount: 350000,
  },
  {
    id: 2,
    sessionName: "Court 1 - Tournament",
    playerName: "HCM Club",
    date: "10 Mar",
    amount: 1200000,
  },
  {
    id: 3,
    sessionName: "Court 3 - Morning",
    playerName: "Lê Vy",
    date: "09 Mar",
    amount: 150000,
  },
  {
    id: 4,
    sessionName: "Court 2 - Weekend",
    playerName: "Trần Minh",
    date: "08 Mar",
    amount: 550000,
  },
];

export default function Content() {
  const t = useTranslations("statistics");
  const [period, setPeriod] = useState<Period>("MONTH");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("MONTH");

  const summary = summaries[period];

  const chartData = useMemo(() => {
    switch (chartPeriod) {
      case "DAY":
        return dayData;

      case "YEAR":
        return yearData;

      default:
        return monthData;
    }
  }, [chartPeriod]);

  const formatMoney = (value: number) => {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  };

  const averageRevenue =
    summary.settledSessions > 0
      ? Math.round(summary.totalRevenue / summary.settledSessions)
      : 0;

  const outstandingRate =
    summary.totalRevenue > 0
      ? ((summary.outstanding / summary.totalRevenue) * 100).toFixed(1)
      : "0.0";

  const profitMargin =
    summary.totalRevenue > 0
      ? ((summary.profit / summary.totalRevenue) * 100).toFixed(1)
      : "0.0";

  return (
    <ManagementPage
      title={t("title")}
      description={t("description")}
      action={
        <div className="flex w-full overflow-x-auto rounded-xl border border-foreground/20 bg-surface p-1 md:w-fit">
          <PeriodButton
            active={period === "TODAY"}
            onClick={() => setPeriod("TODAY")}
          >
            {t("today")}
          </PeriodButton>

          <PeriodButton
            active={period === "WEEK"}
            onClick={() => setPeriod("WEEK")}
          >
            {t("thisWeek")}
          </PeriodButton>

          <PeriodButton
            active={period === "MONTH"}
            onClick={() => setPeriod("MONTH")}
          >
            {t("thisMonth")}
          </PeriodButton>

          <PeriodButton
            active={period === "YEAR"}
            onClick={() => setPeriod("YEAR")}
          >
            {t("thisYear")}
          </PeriodButton>
        </div>
      }
    >
      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RevenueStatCard
          label={t("totalRevenue")}
          value={formatMoney(summary.totalRevenue)}
          description={t("revenueChange", { change: summary.revenueChange })}
          icon={<WalletCards size={20} />}
        />

        <RevenueStatCard
          label={t("outstanding")}
          value={formatMoney(summary.outstanding)}
          description={t("pendingSessions", {
            count: summary.outstandingSessions,
          })}
          icon={<CircleDollarSign size={20} />}
          danger
        />

        <RevenueStatCard
          label={t("settledSessions")}
          value={summary.settledSessions.toLocaleString("vi-VN")}
          description={t("completedPeriod")}
          icon={<CalendarCheck size={20} />}
        />

        <RevenueStatCard
          label={t("estimatedProfit")}
          value={formatMoney(summary.profit)}
          description={t("afterCosts")}
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* REVENUE CHART */}
        <WhiteCard className="flex-col items-stretch">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold text-primary">
                {t("chartTitle")}
              </h3>

              <p className="mt-1 text-sm text-foreground/60">
                {t("chartDescription")}
              </p>
            </div>

            <div className="flex w-fit rounded-lg bg-tag p-1">
              <ChartPeriodButton
                active={chartPeriod === "DAY"}
                onClick={() => setChartPeriod("DAY")}
              >
                {t("day")}
              </ChartPeriodButton>

              <ChartPeriodButton
                active={chartPeriod === "MONTH"}
                onClick={() => setChartPeriod("MONTH")}
              >
                {t("month")}
              </ChartPeriodButton>

              <ChartPeriodButton
                active={chartPeriod === "YEAR"}
                onClick={() => setChartPeriod("YEAR")}
              >
                {t("year")}
              </ChartPeriodButton>
            </div>
          </div>

          <div className="mt-6">
            <RevenueChart data={chartData} />
          </div>
        </WhiteCard>

        {/* OUTSTANDING */}
        <WhiteCard padding="p-0" className="flex-col items-stretch">
          {/* HEADER */}
          <div className="flex items-start justify-between border-b border-foreground/20 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-primary">
                  {t("outstanding")}
                </h3>

                <span className="rounded-full bg-colorWrong/10 px-2 py-1 text-xs font-semibold text-colorWrong">
                  {summary.outstandingSessions}
                </span>
              </div>

              <p className="mt-1 text-sm text-foreground/60">
                {t("pendingCollections")}
              </p>
            </div>

            <button
              type="button"
              className="cursor-pointer text-sm font-semibold text-primary transition hover:opacity-60"
            >
              {t("viewAll")}
            </button>
          </div>

          {/* LIST */}
          <div className="max-h-100 overflow-y-auto">
            {outstandingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-foreground/20 p-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tag text-primary">
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {item.sessionName}
                    </p>

                    <p className="mt-1 truncate text-xs text-foreground/60">
                      {item.date} • {item.playerName}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 text-sm font-bold text-colorWrong">
                  {item.amount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="border-t border-foreground/20 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm text-foreground/60">
                {t("totalOutstanding")}
              </span>

              <span className="font-bold text-colorWrong">
                {formatMoney(summary.outstanding)}
              </span>
            </div>

            <Button
              type="button"
              background="bg-surface"
              color="text-primary"
              className="border border-placeholder"
            >
              {t("pendingPayments")}
            </Button>
          </div>
        </WhiteCard>
      </div>

      {/* BOTTOM SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <MiniSummaryCard
          icon={<Landmark size={20} />}
          label={t("averageRevenue")}
          value={formatMoney(averageRevenue)}
        />

        <MiniSummaryCard
          icon={<CircleDollarSign size={20} />}
          label={t("outstandingRate")}
          value={`${outstandingRate}%`}
        />

        <MiniSummaryCard
          icon={<TrendingUp size={20} />}
          label={t("profitMargin")}
          value={`${profitMargin}%`}
        />
      </div>

      {/* EXPORT */}
      <div className="flex justify-end">
        <Button type="button" className="md:w-fit md:px-6">
          <Download size={16} />
          {t("exportReport")}
        </Button>
      </div>
    </ManagementPage>
  );
}

interface RevenueStatCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  danger?: boolean;
}

function RevenueStatCard({
  label,
  value,
  description,
  icon,
  danger = false,
}: RevenueStatCardProps) {
  return (
    <WhiteCard
      className={`flex-col items-stretch border ${
        danger ? "border-colorWrong/30 bg-colorWrong/5" : "border-foreground/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground/70">{label}</p>

        <div
          className={`flex size-10 items-center justify-center rounded-full ${
            danger ? "bg-colorWrong/10 text-colorWrong" : "bg-tag text-primary"
          }`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-4 text-2xl font-bold ${
          danger ? "text-colorWrong" : "text-foreground"
        }`}
      >
        {value}
      </p>

      <p
        className={`mt-2 text-xs ${
          danger ? "text-colorWrong" : "text-foreground/60"
        }`}
      >
        {description}
      </p>
    </WhiteCard>
  );
}

interface MiniSummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function MiniSummaryCard({ icon, label, value }: MiniSummaryCardProps) {
  return (
    <WhiteCard className="justify-start gap-4 border border-foreground/10">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-tag text-primary">
        {icon}
      </div>

      <div>
        <p className="text-xs text-foreground/60">{label}</p>

        <p className="mt-1 text-lg font-bold text-primary">{value}</p>
      </div>
    </WhiteCard>
  );
}

interface PeriodButtonProps {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}

function PeriodButton({ active, children, onClick }: PeriodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-max cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-primary text-surface" : "text-foreground/70 hover:bg-tag"
      }`}
    >
      {children}
    </button>
  );
}

function ChartPeriodButton({ active, children, onClick }: PeriodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-surface text-primary shadow-sm"
          : "text-foreground/60 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
