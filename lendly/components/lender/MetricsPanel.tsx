"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp, Calendar, Percent, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { KPICard } from "./KPICard";
import { ChartRevenue } from "./ChartRevenue";
import { ChartBookings } from "./ChartBookings";

interface MetricsPanelProps {
  monthlyRevenue: number;
  monthlyBookings: number;
  averageOccupancy: number;
  itemsNeedingAttention: number;
  revenueData: { month: string; revenue: number }[];
  bookingsData: { week: string; bookings: number }[];
  revenueTrend?: number;
  bookingsTrend?: number;
}

export function MetricsPanel({
  monthlyRevenue,
  monthlyBookings,
  averageOccupancy,
  itemsNeedingAttention,
  revenueData,
  bookingsData,
  revenueTrend = 12,
  bookingsTrend = 8,
}: MetricsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-right"
      >
        <h2 className="text-lg font-semibold text-slate-900">מדדים ופעילות</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <KPICard
          title="הכנסות החודש"
          value={`₪${monthlyRevenue.toLocaleString()}`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: revenueTrend, isPositive: true }}
          index={0}
        />
        <KPICard
          title="מספר השכרות החודש"
          value={monthlyBookings}
          icon={<Calendar className="h-4 w-4" />}
          trend={{ value: bookingsTrend, isPositive: true }}
          index={1}
        />
        <KPICard
          title="אחוז תפוסה ממוצע"
          value={`${averageOccupancy}%`}
          icon={<Percent className="h-4 w-4" />}
          index={2}
        />
        <KPICard
          title="פריטים הדורשים טיפול"
          value={itemsNeedingAttention}
          icon={<AlertCircle className="h-4 w-4" />}
          index={3}
        />
      </div>

      {/* Charts - Collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Revenue Chart */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                הכנסות חודשיות
              </h3>
              <ChartRevenue data={revenueData} />
            </div>

            {/* Bookings Chart */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                מספר הזמנות לפי זמן
              </h3>
              <ChartBookings data={bookingsData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

