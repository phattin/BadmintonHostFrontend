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
                stopColor="var(--main3)"
                stopOpacity={0.35}
              />

              <stop
                offset="95%"
                stopColor="var(--main3)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#6b7280",
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            tick={{
              fontSize: 12,
              fill: "#9ca3af",
            }}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString("vi-VN")} VNĐ`,
              "Revenue",
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--main4)"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            activeDot={{
              r: 5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}