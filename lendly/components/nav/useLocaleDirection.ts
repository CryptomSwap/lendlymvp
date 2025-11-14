"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export type Direction = "ltr" | "rtl";
export type Locale = "he" | "en";

/**
 * Hook to get locale and direction information
 * Also updates the HTML dir attribute when locale changes
 */
export function useLocaleDirection() {
  const locale = useLocale() as Locale;
  const dir: Direction = locale === "he" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";

  useEffect(() => {
    // Update HTML dir attribute
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", locale);
  }, [dir, locale]);

  return {
    locale,
    dir,
    isRTL,
  };
}

