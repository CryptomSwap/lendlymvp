"use client";

import { motion } from "framer-motion";

export type FilterType =
  | "all"
  | "active"
  | "pending"
  | "paused"
  | "issues";

interface StatusTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    pending: number;
    paused: number;
    issues: number;
  };
}

const filterLabels: Record<FilterType, string> = {
  all: "הכל",
  active: "פעילים",
  pending: "ממתינים לאישור",
  paused: "מושהים",
  issues: "בעיות",
};

export function StatusTabs({
  activeFilter,
  onFilterChange,
  counts,
}: StatusTabsProps) {
  const filters: FilterType[] = [
    "all",
    "active",
    "pending",
    "paused",
    "issues",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        const count = counts[filter];

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all snap-start ${
              isActive
                ? "bg-[#00A39A] text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filterLabels[filter]}
            {count > 0 && (
              <span className={`mr-1 ${isActive ? "opacity-90" : "opacity-70"}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

