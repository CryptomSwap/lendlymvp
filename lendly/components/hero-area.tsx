"use client";

import { useIsRTL } from "@/lib/utils/rtl";
import { LocationInput } from "@/components/location-input";
import { CategoryChips } from "@/components/category-chips";

export function HeroArea() {
  const isRTL = useIsRTL();

  return (
    <div className="px-4 pt-3 pb-2 flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Tagline */}
      <p className="text-sm text-center text-[#0EA5A5] font-medium mt-3">
        לא צריך לקנות - פשוט משכירים
      </p>

      {/* Search Bar */}
      <div className="mt-4">
        <LocationInput />
      </div>

      {/* Category Icons Row */}
      <div className="mt-4">
        <CategoryChips />
      </div>
    </div>
  );
}

