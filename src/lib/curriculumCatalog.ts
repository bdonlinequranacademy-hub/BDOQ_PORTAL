/**
 * Curriculum program ids — aligned with public-site TOPICS and backend master tree.
 */
export const CURRICULUM_PROGRAM_IDS = [
  "quran-education",
  "quran-recitation",
  "tafsir",
  "seerah-history",
  "islamic-studies",
  "urdu",
  "tajweed",
  "hifz",
  "surah-memorization",
  "adab",
  "arabic",
  "english",
] as const;

export type CurriculumProgramId = (typeof CURRICULUM_PROGRAM_IDS)[number];

export const LEGACY_PROGRAM_ID_MAP: Record<string, CurriculumProgramId> = {
  "arabic-language": "arabic",
  "quran-memorisation": "hifz",
  "quran-tajweed": "tajweed",
};

export function normalizeProgramId(programId: string): string {
  return LEGACY_PROGRAM_ID_MAP[programId] ?? programId;
}

export function programUsesSurahPicker(programId: string): boolean {
  const id = normalizeProgramId(programId);
  return id === "hifz" || id === "surah-memorization" || id === "quran-recitation";
}

export function programUsesTajweedPicker(programId: string): boolean {
  return normalizeProgramId(programId) === "tajweed";
}

export function programUsesGrammarPicker(programId: string, sectionId: string): boolean {
  return normalizeProgramId(programId) === "arabic" && sectionId === "ar-grammar";
}

/** Labels for admission / free-class forms (EN). */
export const CURRICULUM_PROGRAM_OPTIONS = [
  { value: "quran-education", labelEn: "Quran Education", labelBn: "কুরআন শিক্ষা" },
  { value: "quran-recitation", labelEn: "Quran Recitation", labelBn: "কুরআন তিলাওয়াত" },
  { value: "tafsir", labelEn: "Tafsirul Quran", labelBn: "তাফসীরুল কুরআন" },
  { value: "seerah-history", labelEn: "Seerah and History", labelBn: "সীরাহ এবং ইতিহাস" },
  { value: "islamic-studies", labelEn: "Islamic Studies", labelBn: "ইসলামিক স্টাডিজ" },
  { value: "urdu", labelEn: "Urdu Language", labelBn: "উর্দু ভাষা" },
  { value: "tajweed", labelEn: "Tajweed", labelBn: "তাজবিদ" },
  { value: "hifz", labelEn: "Hifzul Quran", labelBn: "হিফজুল কুরআন" },
  { value: "surah-memorization", labelEn: "Surah Memorization", labelBn: "সুরা মুখস্থ" },
  { value: "adab", labelEn: "Adab & Etiquette", labelBn: "আদব-কায়দা" },
  { value: "arabic", labelEn: "Arabic Language", labelBn: "আরবি ভাষা" },
  { value: "english", labelEn: "English Language", labelBn: "ইংরেজি ভাষা" },
] as const;

/** Mirrors backend SELECTABLE_SURAHS — used in admin surah picker & dropdowns. */
export const SELECTABLE_SURAHS = [
  "Al-Fatiha",
  "Al-Baqarah",
  "Al-Imran",
  "An-Nisa",
  "Al-Maidah",
  "Ya-Sin",
  "Ar-Rahman",
  "Al-Mulk",
  "Al-Qalam",
  "Al-Muzzammil",
  "Al-Muddaththir",
  "Al-Qadr",
  "Al-Alaq",
  "At-Tin",
  "Ash-Sharh",
  "Al-Fil",
  "Al-Falaq",
  "An-Nas",
  "Al-Ikhlas",
  "Al-Kawthar",
  "Al-Asr",
  "Al-Humazah",
];

export const TAJWEED_RULE_CATALOG: { id: string; label: string; labelBn?: string }[] = [
  { id: "tj-noon-tanween", label: "Noon Sakinah & Tanween", labelBn: "নূন সাকিন ও তানউইন" },
  { id: "tj-meem-sakin", label: "Meem Sakinah", labelBn: "মীম সাকিন" },
  { id: "tj-qalqalah", label: "Qalqalah", labelBn: "কলকলাহ" },
  { id: "tj-madd-tabee", label: "Madd Tabee'i", labelBn: "মাদ্দ তবঈ" },
  { id: "tj-madd-muttasil-munfasil", label: "Madd Muttasil & Munfasil", labelBn: "মাদ্দ মুতtasil ও মুনফasil" },
  { id: "tj-madd-lazim", label: "Madd Lazim", labelBn: "মাদ্দ লাজিম" },
  { id: "tj-waqf-ibtida", label: "Waqf & Ibtida", labelBn: "ওকফ ও ইবতিদা" },
  { id: "tj-ghunnah-idgham", label: "Ghunnah & Idgham", labelBn: "গুন্নাহ ও ইদগাম" },
];

export const GRAMMAR_LESSON_CATALOG: { id: string; label: string; labelBn?: string }[] = [
  { id: "ar-nouns-verbs", label: "Nouns & Verbs (Ism & Fi'l)", labelBn: "বিশেষ্য ও ক্রিয়া" },
  { id: "ar-sentences", label: "Sentence Structure (Jumla)", labelBn: "বাক্য গঠন" },
  { id: "ar-irab", label: "I'rab (Case Endings)", labelBn: "ইআরাব" },
  { id: "ar-huruf", label: "Huruf (Prepositions & Particles)", labelBn: "হুরুফ" },
  { id: "ar-pronouns", label: "Pronouns (Dama'ir)", labelBn: "সর্বনাম" },
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isSurahTopicId(id: string): boolean {
  return id.includes("-surah-");
}

export function surahTopicId(sectionId: string, surahName: string): string {
  return `${sectionId}-surah-${slugify(surahName)}`;
}

export function surahNameFromTopicId(id: string): string | null {
  const match = id.match(/-surah-(.+)$/);
  if (!match) return null;
  return SELECTABLE_SURAHS.find((s) => slugify(s) === match[1]) ?? null;
}
