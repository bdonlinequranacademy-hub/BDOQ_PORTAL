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

/** Emotional Quran / Hadith slides for branding header carousel */
export const PORTAL_BRANDING_QUOTES: IPortalQuote[] = [
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation:
      "The best among you are those who learn the Quran and teach it.",
    source: "Sahih Bukhari",
  },
  {
    arabic: "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ",
    translation:
      "Indeed, this Quran guides to that which is most upright.",
    source: "Quran 17:9",
  },
  {
    arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    translation:
      "And We send down of the Quran that which is healing and mercy for the believers.",
    source: "Quran 17:82",
  },
  {
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ",
    translation:
      "Those who believe and whose hearts find rest in the remembrance of Allah.",
    source: "Quran 13:28",
  },
  {
    arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
    translation:
      "Recite the Quran, for it will come as an intercessor for its companions on the Day of Resurrection.",
    source: "Sahih Muslim",
  },
  {
    arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
    translation:
      "A blessed Book We have revealed to you, that they may reflect upon its verses.",
    source: "Quran 38:29",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
    source: "Quran 20:114",
  },
];

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
