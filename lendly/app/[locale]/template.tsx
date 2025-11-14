"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const isRTL = locale === "he";

  useEffect(() => {
    // Update html lang and dir attributes based on locale
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  return <>{children}</>;
}

