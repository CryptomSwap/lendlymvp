"use client";

import { useIsRTL } from "@/lib/utils/rtl";
import { LocationInput } from "@/components/location-input";
import { CategoryChips } from "@/components/category-chips";
import { HomeHeroHeader } from "@/components/home-hero-header";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HeroArea() {
  const isRTL = useIsRTL();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show background in light mode
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      <div className="px-4 flex flex-col relative z-10">
        {/* Search Bar */}
        <div className="mt-2 mb-2 relative z-10">
          <LocationInput />
        </div>

        {/* Category Icons Row */}
        <div className="mt-2 relative z-10">
          <CategoryChips />
        </div>
      </div>
    </div>
  );
}

