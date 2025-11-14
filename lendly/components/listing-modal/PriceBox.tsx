"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PriceBoxProps {
  dailyRate: number;
  hasInsurance: boolean;
  className?: string;
}

export function PriceBox({ dailyRate, hasInsurance, className }: PriceBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn("rounded-xl border border-[#E6F3F3] bg-white p-4 shadow-sm", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#64748B]">יום</span>
        <span className="text-2xl font-bold text-[#0F172A]">₪{dailyRate}</span>
      </div>
      <p className="mt-2 text-xs text-[#64748B] text-center">
        {hasInsurance ? "כולל ביטוח" : "לא כולל ביטוח"}
      </p>
    </motion.div>
  );
}

