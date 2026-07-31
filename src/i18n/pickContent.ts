import type { LocaleType } from "@/i18n/types";

/** Pick a localized scalar field (e.g. titleEn / titleBn). */
export function pickLocaleField(
  locale: LocaleType,
  en: string | undefined | null,
  bn: string | undefined | null,
  fallback = ""
): string {
  const primary = locale === "bn" ? bn : en;
  const secondary = locale === "bn" ? en : bn;
  return (primary?.trim() || secondary?.trim() || fallback).trim();
}

/** CMS document with bilingual content fields. */
export function pickCmsContent<
  T extends { contentEn?: string; contentBn?: string },
>(doc: T, locale: LocaleType): string {
  return pickLocaleField(locale, doc.contentEn, doc.contentBn);
}

/** Generic bilingual record helper. */
export function pickLocalizedContent<T>(
  locale: LocaleType,
  record: { en: T; bn: T }
): T {
  return locale === "bn" ? record.bn : record.en;
}
