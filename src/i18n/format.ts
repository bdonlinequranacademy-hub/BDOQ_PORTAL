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

export function formatLocaleDateTime(
  locale: LocaleType,
  iso: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaults: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(iso).toLocaleString(intlLocale(locale), options ?? defaults);
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
