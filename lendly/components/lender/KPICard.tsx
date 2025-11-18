"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index?: number;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  index = 0,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-[#F7FAFA] border border-gray-200 rounded-xl p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{title}</p>
        {icon && <div className="text-[#00A39A]">{icon}</div>}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {trend && (
          <p
            className={`text-xs ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </motion.div>
  );
}

