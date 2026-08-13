import type { LocaleType } from "@/i18n/types";

export function intlLocale(locale: LocaleType): string {
  return locale === "bn" ? "bn-BD" : "en-GB";
}

export function formatLocaleMoney(
  locale: LocaleType,
  amount: number,
  currency: string
): string {
  try {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const symbol = currency === "BDT" ? "৳" : currency === "USD" ? "$" : `${currency} `;
    const formatted = formatLocaleNumber(locale, amount, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return currency === "BDT" ? `${symbol} ${formatted}` : `${symbol}${formatted}`;
  }
}

export function formatLocaleNumber(
  locale: LocaleType,
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(intlLocale(locale), options).format(value);
}

/** en-US + hour12 guarantees AM/PM (en-GB often stays 24-hour). */
export const AM_PM_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

export function formatAmPmTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-US", AM_PM_TIME_OPTIONS);
}

/** Display stored 24h ("17:35") or 12h ("5:35 PM") clock times as AM/PM. */
export function formatClockTime(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return raw;

  const twelveHour = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHour) {
    let hours = Number(twelveHour[1]);
    const minutes = twelveHour[2];
    const period = twelveHour[3].toUpperCase();
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${period}`;
  }

  const twentyFour = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!twentyFour) return raw;

  let hours = Number(twentyFour[1]);
  const minutes = twentyFour[2];
  if (Number.isNaN(hours) || hours < 0 || hours > 23) return raw;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
}

export function formatAmPmDateTime(
  value: Date | string,
  dateLocale = "en-GB"
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  const datePart = date.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${datePart}, ${formatAmPmTime(date)}`;
}

export function formatLocaleDate(
  locale: LocaleType,
  iso: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaults: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(iso).toLocaleDateString(intlLocale(locale), options ?? defaults);
}

export function formatLocaleTime(_locale: LocaleType, iso: string): string {
  return formatAmPmTime(iso);
}

export function formatLocaleDateTime(
  locale: LocaleType,
  iso: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  if (options) {
    return date.toLocaleString("en-US", { ...options, hour12: true });
  }
  const datePart = date.toLocaleDateString(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${datePart}, ${formatAmPmTime(date)}`;
}

export function formatLocalePercent(
  locale: LocaleType,
  value: number,
  fractionDigits = 0
): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100);
}

/** BDT display with locale-aware grouping (e.g. Bengali digits in bn). */
export function formatLocaleBdt(locale: LocaleType, amount: number): string {
  return formatLocaleMoney(locale, amount, "BDT");
}

/** USD display with locale-aware grouping. */
export function formatLocaleUsd(locale: LocaleType, amount: number): string {
  return formatLocaleMoney(locale, amount, "USD");
}
