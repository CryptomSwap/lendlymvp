"use client";

import { useLocale } from "next-intl";

/**
 * Check if the current locale is RTL (Right-to-Left)
 * @param locale - Optional locale string. If not provided, uses the current locale from context
 * @returns true if locale is RTL (Hebrew), false otherwise
 */
export function isRTL(locale?: string): boolean {
  if (typeof window !== "undefined" && !locale) {
    // Client-side: check document direction
    return document.documentElement.dir === "rtl";
  }
  // Server-side or with explicit locale
  return locale === "he";
}

/**
 * Hook to get RTL status from current locale
 */
export function useIsRTL(): boolean {
  const locale = useLocale();
  return isRTL(locale as string);
}

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
    ml: isRTL ? "mr" : "ml",
    mr: isRTL ? "ml" : "mr",
    pl: isRTL ? "pr" : "pl",
    pr: isRTL ? "pl" : "pr",
    ms: isRTL ? "me" : "ms",
    me: isRTL ? "ms" : "me",
    ps: isRTL ? "pe" : "ps",
    pe: isRTL ? "ps" : "pe",
  };
}
