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

export function programUsesSurahPicker(programId: string): boolean {
  return programId === "quran-memorisation" || programId === "quran-recitation";
}

export function programUsesTajweedPicker(programId: string): boolean {
  return programId === "tajweed";
}

export function programUsesGrammarPicker(programId: string, sectionId: string): boolean {
  return programId === "arabic-language" && sectionId === "ar-grammar";
}
