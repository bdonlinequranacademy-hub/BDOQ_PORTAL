export type QaidaCardColor = "cream" | "sky" | "mint" | "peach" | "lavender";

const CARD_COLORS: Record<QaidaCardColor, { bg: string; border: string }> = {
  cream: { bg: "#FDF3E0", border: "#C4922B" },
  sky: { bg: "#E8F4FC", border: "#5BB5E8" },
  mint: { bg: "#E8F8F0", border: "#1F9D63" },
  peach: { bg: "#FFF0E8", border: "#E8956A" },
  lavender: { bg: "#F0EBFA", border: "#9B7FD4" },
};

export const ARABIC_LETTERS: { char: string; name: string; color: QaidaCardColor }[] = [
  { char: "ا", name: "Alif", color: "cream" },
  { char: "ب", name: "Ba", color: "sky" },
  { char: "ت", name: "Ta", color: "mint" },
  { char: "ث", name: "Tha", color: "peach" },
  { char: "ج", name: "Jeem", color: "lavender" },
  { char: "ح", name: "Ha", color: "cream" },
  { char: "خ", name: "Kha", color: "sky" },
  { char: "د", name: "Dal", color: "mint" },
  { char: "ذ", name: "Dhal", color: "peach" },
  { char: "ر", name: "Ra", color: "lavender" },
  { char: "ز", name: "Zay", color: "cream" },
  { char: "س", name: "Seen", color: "sky" },
  { char: "ش", name: "Sheen", color: "mint" },
  { char: "ص", name: "Sad", color: "peach" },
  { char: "ض", name: "Dad", color: "lavender" },
  { char: "ط", name: "Ta", color: "cream" },
  { char: "ظ", name: "Za", color: "sky" },
  { char: "ع", name: "Ayn", color: "mint" },
  { char: "غ", name: "Ghayn", color: "peach" },
  { char: "ف", name: "Fa", color: "lavender" },
  { char: "ق", name: "Qaf", color: "cream" },
  { char: "ك", name: "Kaf", color: "sky" },
  { char: "ل", name: "Lam", color: "mint" },
  { char: "م", name: "Meem", color: "peach" },
  { char: "ن", name: "Noon", color: "lavender" },
  { char: "ه", name: "Ha", color: "cream" },
  { char: "و", name: "Waw", color: "sky" },
  { char: "ي", name: "Ya", color: "mint" },
];

export const HARAKAT_MARKS: { char: string; label: string; sample: string; color: QaidaCardColor }[] = [
  { char: "َ", label: "Fatha", sample: "بَ", color: "cream" },
  { char: "ِ", label: "Kasra", sample: "بِ", color: "sky" },
  { char: "ُ", label: "Damma", sample: "بُ", color: "mint" },
  { char: "ْ", label: "Sukoon", sample: "بْ", color: "peach" },
  { char: "ّ", label: "Shadda", sample: "بَّ", color: "lavender" },
];

export const TANWIN_MARKS: { char: string; label: string; sample: string; color: QaidaCardColor }[] = [
  { char: "ً", label: "Tanwin Fath", sample: "بً", color: "cream" },
  { char: "ٍ", label: "Tanwin Kasr", sample: "بٍ", color: "sky" },
  { char: "ٌ", label: "Tanwin Damm", sample: "بٌ", color: "mint" },
];

export function getCardColors(color: QaidaCardColor) {
  return CARD_COLORS[color];
}
