/** Islamic copy & helpers for the authenticated portal */

export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export const PORTAL_BRANDING_HADITH = {
  text: "The best among you are those who learn the Quran and teach it.",
  source: "Sahih Bukhari",
} as const;

export interface IPortalQuote {
  arabic: string;
  translation: string;
  source: string;
}

export const PORTAL_QUOTES: IPortalQuote[] = [
  {
    arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    translation: "Read in the name of your Lord who created.",
    source: "Quran 96:1",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
    source: "Quran 20:114",
  },
  {
    arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    translation:
      "Allah will raise those who have believed among you and those who were given knowledge, by degrees.",
    source: "Quran 58:11",
  },
  {
    arabic: "وَقُل رَّبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي",
    translation: "And say: My Lord, make me an establisher of prayer, and from my descendants.",
    source: "Quran 14:40",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    source: "Quran 2:152",
  },
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation: "And whoever fears Allah — He will make for him a way out.",
    source: "Quran 65:2",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    source: "Quran 94:6",
  },
];

export function dailyPortalQuote(): IPortalQuote {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return PORTAL_QUOTES[dayIndex % PORTAL_QUOTES.length] ?? PORTAL_QUOTES[0];
}

export function hijriDateLabel(): string {
  try {
    return new Date().toLocaleDateString("en-US", {
      calendar: "islamic",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
