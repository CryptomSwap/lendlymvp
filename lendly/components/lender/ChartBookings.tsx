"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartBookingsProps {
  data: { week: string; bookings: number }[];
}

const CustomDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#00A39A"
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

export function ChartBookings({ data }: ChartBookingsProps) {
  return (
    <div className="w-full h-64" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "8px 12px",
              direction: "rtl",
            }}
            formatter={(value: number) => [value, "הזמנות"]}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#00A39A"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

