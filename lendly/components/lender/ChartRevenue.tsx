"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartRevenueProps {
  data: { month: string; revenue: number }[];
}

export function ChartRevenue({ data }: ChartRevenueProps) {
  return (
    <div className="w-full h-64" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#9CA3AF"
            tickFormatter={(value) => `₪${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "8px 12px",
              direction: "rtl",
            }}
            formatter={(value: number) => [`₪${value}`, "הכנסה"]}
          />
          <Bar
            dataKey="revenue"
            fill="#00A39A"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

