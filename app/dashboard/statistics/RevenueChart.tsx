"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface RevenueChartData {
  label: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueChartData[];
}

export default function RevenueChart({
  data,
}: RevenueChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    }

    if (value >= 1000) {
      return `${value / 1000}K`;
    }

    return String(value);
  };

  return (
    <div className="h-80 w-full md:h-100">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--color-primary)"
                stopOpacity={0.35}
              />

              <stop
                offset="95%"
                stopColor="var(--color-primary)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-foreground)"
            strokeOpacity={0.15}
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "var(--color-foreground)",
              opacity: 0.6,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            tick={{
              fontSize: 12,
              fill: "var(--color-foreground)",
              opacity: 0.6,
            }}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString("vi-VN")} VNĐ`,
              "Revenue",
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid var(--color-tag)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-foreground)",
              boxShadow: "0 8px 24px rgb(0 0 0 / 0.12)",
            }}
            labelStyle={{
              color: "var(--color-foreground)",
              fontWeight: 600,
            }}
            itemStyle={{
              color: "var(--color-primary)",
            }}
            cursor={{
              stroke: "var(--color-primary)",
              strokeOpacity: 0.2,
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary)"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            activeDot={{
              r: 5,
              fill: "var(--color-surface)",
              stroke: "var(--color-primary)",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}