import type { LocaleType } from "@/i18n/types";
import { translate } from "@/i18n/messages";
import { formatLocaleDate } from "@/i18n/messages";

/** Islamic copy & helpers for the authenticated portal */

export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export interface IPortalQuote {
  arabic: string;
  translation: string;
  source: string;
}

const QUOTE_KEYS: Array<{ arabic: string; translationKey: string; sourceKey: string }> = [
  {
    arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    translationKey: "islamic.quote961",
    sourceKey: "islamic.quote961Source",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translationKey: "islamic.quote20114",
    sourceKey: "islamic.quote20114Source",
  },
  {
    arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    translationKey: "islamic.quote5811",
    sourceKey: "islamic.quote5811Source",
  },
  {
    arabic: "وَقُل رَّبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي",
    translationKey: "islamic.quote1440",
    sourceKey: "islamic.quote1440Source",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translationKey: "islamic.quote2152",
    sourceKey: "islamic.quote2152Source",
  },
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translationKey: "islamic.quote652",
    sourceKey: "islamic.quote652Source",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translationKey: "islamic.quote946",
    sourceKey: "islamic.quote946Source",
  },
];

const BRANDING_QUOTE_KEYS: Array<{ arabic: string; translationKey: string; sourceKey: string }> = [
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translationKey: "islamic.hadithBest",
    sourceKey: "islamic.hadithSourceBukhari",
  },
  {
    arabic: "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ",
    translationKey: "islamic.quote179",
    sourceKey: "islamic.quote179Source",
  },
  {
    arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    translationKey: "islamic.quote1782",
    sourceKey: "islamic.quote1782Source",
  },
  {
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ",
    translationKey: "islamic.quote1328",
    sourceKey: "islamic.quote1328Source",
  },
  {
    arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
    translationKey: "islamic.quoteRecite",
    sourceKey: "islamic.quoteReciteSource",
  },
  {
    arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
    translationKey: "islamic.quote3829",
    sourceKey: "islamic.quote3829Source",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translationKey: "islamic.quote20114",
    sourceKey: "islamic.quote20114Source",
  },
];

function localizeQuotes(
  locale: LocaleType,
  keys: Array<{ arabic: string; translationKey: string; sourceKey: string }>
): IPortalQuote[] {
  return keys.map((entry) => ({
    arabic: entry.arabic,
    translation: translate(locale, entry.translationKey),
    source: translate(locale, entry.sourceKey),
  }));
}

export function portalQuotes(locale: LocaleType = "en"): IPortalQuote[] {
  return localizeQuotes(locale, QUOTE_KEYS);
}

export function portalBrandingQuotes(locale: LocaleType = "en"): IPortalQuote[] {
  return localizeQuotes(locale, BRANDING_QUOTE_KEYS);
}

export function portalBrandingHadith(locale: LocaleType = "en"): IPortalQuote {
  return {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation: translate(locale, "islamic.hadithBest"),
    source: translate(locale, "islamic.hadithSourceBukhari"),
  };
}

/** @deprecated Use portalBrandingHadith(locale) */
export const PORTAL_BRANDING_HADITH = portalBrandingHadith("en");

/** @deprecated Use portalBrandingQuotes(locale) */
export const PORTAL_BRANDING_QUOTES = portalBrandingQuotes("en");

/** @deprecated Use portalQuotes(locale) */
export const PORTAL_QUOTES = portalQuotes("en");

export function dailyPortalQuote(locale: LocaleType = "en"): IPortalQuote {
  const quotes = portalQuotes(locale);
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return quotes[dayIndex % quotes.length] ?? quotes[0];
}

export function hijriDateLabel(locale: LocaleType = "en"): string {
  try {
    const tag = locale === "bn" ? "bn-BD-u-ca-islamic" : "en-US-u-ca-islamic";
    return new Date().toLocaleDateString(tag, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function formatPortalDateLabel(iso: string, locale: LocaleType = "en"): string {
  return formatLocaleDate(locale, iso);
}
