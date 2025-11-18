"use client";

export type FilterType =
  | "all"
  | "active"
  | "upcoming"
  | "history"
  | "issues";

interface ListingsTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterLabels: Record<FilterType, string> = {
  all: "הכל",
  active: "פעילים",
  upcoming: "הזמנות קרובות",
  history: "היסטוריה",
  issues: "בעיות / נזק",
};

export function ListingsTabs({
  activeFilter,
  onFilterChange,
}: ListingsTabsProps) {
  const filters: FilterType[] = [
    "all",
    "active",
    "upcoming",
    "history",
    "issues",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all snap-start ${
              isActive
                ? "bg-[#00A39A] text-white shadow-sm"
                : "bg-white text-gray-600 border border-[#00A39A] hover:bg-teal-50"
            }`}
          >
            {filterLabels[filter]}
          </button>
        );
      })}
    </div>
  );
}
