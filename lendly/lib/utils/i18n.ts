import { getLocale } from "next-intl/server";

/**
 * Format a number according to the current locale
 */
export async function formatNumber(value: number, options?: Intl.NumberFormatOptions): Promise<string> {
  const locale = await getLocale();
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a currency amount according to the current locale
 */
export async function formatCurrency(
  amount: number,
  currency: string = "ILS",
  options?: Intl.NumberFormatOptions
): Promise<string> {
  const locale = await getLocale();
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...options,
  }).format(amount);
}

/**
 * Format a date according to the current locale
 */
export async function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): Promise<string> {
  const locale = await getLocale();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a date range according to the current locale
 */
export async function formatDateRange(
  startDate: Date | string,
  endDate: Date | string,
  options?: Intl.DateTimeFormatOptions
): Promise<string> {
  const locale = await getLocale();
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  return new Intl.DateTimeFormat(locale, {
    ...options,
  }).formatRange(start, end);
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export async function formatRelativeTime(
  date: Date | string,
  options?: Intl.RelativeTimeFormatOptions
): Promise<string> {
  const locale = await getLocale();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, options);
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (Math.abs(diffInSeconds) < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (Math.abs(diffInSeconds) < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  }
}

