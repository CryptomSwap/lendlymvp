"use client";

import { useIsRTL } from "@/lib/utils/rtl";

/**
 * HomeHeroHeader Component
 * 
 * Centered logo and tagline for the homepage.
 * Appears at the top of the hero section.
 */
export function HomeHeroHeader() {
  const isRTL = useIsRTL();

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-0" dir={isRTL ? "rtl" : "ltr"}>
      {/* Tagline */}
      <p className="text-sm font-normal text-teal-600 text-center w-full mt-1">
        לא צריך לקנות הכל - פשוט משכירים
      </p>
    </div>
  );
}

