"use client";

import { Package, CheckCircle2, Calendar, AlertCircle } from "lucide-react";

interface SummaryStripProps {
  total: number;
  active: number;
  upcoming: number;
}

export function SummaryStrip({ total, active, upcoming }: SummaryStripProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 py-2">
      <div className="flex items-center gap-1.5">
        <Package className="h-3.5 w-3.5 text-[#00A39A]" />
        <span>{total} סה"כ</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#00A39A]" />
        <span>{active} פעילים</span>
      </div>
      {upcoming > 0 && (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#00A39A]" />
          <span>{upcoming} קרובות</span>
        </div>
      )}
    </div>
  );
}

