"use client";

import { useLocale } from "next-intl";

/**
 * Format a number according to the current locale (client-side)
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const locale = useLocale();
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a currency amount according to the current locale (client-side)
 */
export function formatCurrency(
  amount: number,
  currency: string = "ILS",
  options?: Intl.NumberFormatOptions
): string {
  const locale = useLocale();
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...options,
  }).format(amount);
}

/**
 * Format a date according to the current locale (client-side)
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = useLocale();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a date range according to the current locale (client-side)
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = useLocale();
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  return new Intl.DateTimeFormat(locale, {
    ...options,
  }).formatRange(start, end);
}

