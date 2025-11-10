"use client";

import { useLocale } from "next-intl";

/**
 * Get RTL-aware flex direction classes
 */
export function useRTLFlex() {
  const locale = useLocale();
  const isRTL = locale === "he";
  
  return {
    flexRow: isRTL ? "flex-row-reverse" : "flex-row",
    flexCol: "flex-col", // Columns don't need reversal
    itemsStart: isRTL ? "items-end" : "items-start",
    itemsEnd: isRTL ? "items-start" : "items-end",
    justifyStart: isRTL ? "justify-end" : "justify-start",
    justifyEnd: isRTL ? "justify-start" : "justify-end",
    textLeft: isRTL ? "text-right" : "text-left",
    textRight: isRTL ? "text-left" : "text-right",
    ml: isRTL ? "mr" : "ml",
    mr: isRTL ? "ml" : "mr",
    pl: isRTL ? "pr" : "pl",
    pr: isRTL ? "pl" : "pr",
    borderL: isRTL ? "border-r" : "border-l",
    borderR: isRTL ? "border-l" : "border-r",
    roundedL: isRTL ? "rounded-r" : "rounded-l",
    roundedR: isRTL ? "rounded-l" : "rounded-r",
  };
}

/**
 * Get RTL-aware margin/padding utilities
 */
export function useRTLSpace() {
  const locale = useLocale();
  const isRTL = locale === "he";
  
  return {
    spaceX: (value: string) => isRTL ? `space-x-reverse ${value}` : value,
    spaceY: (value: string) => value, // Vertical spacing doesn't need reversal
  };
}

