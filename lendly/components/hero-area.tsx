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
      {/* Soft vertical gradient background for hero area only (light mode only) */}
      {!isDark && (
        <>
          {/* Main gradient: #F4FFFB to #E7F6F1, transitioning to white at the bottom */}
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none -z-10"
            style={{
              height: '100%',
              background: 'linear-gradient(to bottom, #F4FFFB 0%, #E7F6F1 100%)',
              willChange: 'auto',
              transform: 'translateZ(0)', // GPU acceleration
            }}
            aria-hidden="true"
          />
          
          {/* Fade transition to white at the bottom of hero area */}
          <div 
            className="absolute inset-x-0 bottom-0 pointer-events-none -z-10"
            style={{
              height: '60px',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.7) 80%, #FFFFFF 100%)',
              willChange: 'auto',
              transform: 'translateZ(0)', // GPU acceleration
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="px-4 flex flex-col relative z-10">
        {/* Search Bar */}
        <div className="mt-3 mb-2 relative z-10">
          <LocationInput />
        </div>

        {/* Category Icons Row */}
        <div className="mt-3 relative z-10">
          <CategoryChips />
        </div>
      </div>
    </div>
  );
}

