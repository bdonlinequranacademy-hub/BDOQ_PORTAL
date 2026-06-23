import { namazSvgs, wuduSvgs } from "@/components/classroom/shapes/kidShapeSvgs";

export type IslamicShapeCategory = "namaz" | "wudu" | "qaida";

export interface IslamicShapeItem {
  id: string;
  label: string;
  emoji: string;
  svg: string;
}

export const NAMAZ_SHAPES: IslamicShapeItem[] = [
  { id: "qiyam", label: "Stand", emoji: "🧍", svg: namazSvgs.qiyam },
  { id: "ruku", label: "Bow", emoji: "🙇", svg: namazSvgs.ruku },
  { id: "sujood", label: "Prostrate", emoji: "🤲", svg: namazSvgs.sujood },
  { id: "tashahhud", label: "Sit", emoji: "🪑", svg: namazSvgs.tashahhud },
  { id: "prayer-mat", label: "Prayer Mat", emoji: "🕌", svg: namazSvgs.prayerMat },
  { id: "qibla", label: "Qibla", emoji: "🧭", svg: namazSvgs.qibla },
  { id: "namaz-steps", label: "All Steps", emoji: "1️⃣", svg: namazSvgs.steps },
];

export const WUDU_SHAPES: IslamicShapeItem[] = [
  { id: "hands", label: "Hands", emoji: "🤲", svg: wuduSvgs.hands },
  { id: "face", label: "Face", emoji: "😊", svg: wuduSvgs.face },
  { id: "arms", label: "Arms", emoji: "💪", svg: wuduSvgs.arms },
  { id: "head", label: "Head", emoji: "🧒", svg: wuduSvgs.head },
  { id: "feet", label: "Feet", emoji: "🦶", svg: wuduSvgs.feet },
  { id: "wudu-steps", label: "All Steps", emoji: "1️⃣", svg: wuduSvgs.steps },
  { id: "water", label: "Water", emoji: "💧", svg: wuduSvgs.water },
];
