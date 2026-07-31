import type { LocaleType } from "@/i18n/types";
import { LOCALE_STORAGE_KEY } from "@/i18n/types";

export function setLocalePreference(locale: LocaleType): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}

export function getStoredLocale(): LocaleType | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "bn") return stored;
  return null;
}
