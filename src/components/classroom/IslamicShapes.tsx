import { useState } from "react";
import type { IslamicShapeCategory } from "@/components/classroom/shapes/islamicShapeCatalog";
import type { QaidaCardColor } from "@/components/classroom/shapes/qaidaCatalog";
import { NamazPositions } from "@/components/classroom/NamazPositions";
import { WuduDiagram } from "@/components/classroom/WuduDiagram";
import { QaidaTools } from "@/components/classroom/QaidaTools";

interface IslamicShapesPanelProps {
  onInsertSvg: (svg: string) => void;
  onInsertLetter: (text: string, label: string, color: QaidaCardColor) => void;
  className?: string;
  disabled?: boolean;
}

const TABS: { id: IslamicShapeCategory; label: string; emoji: string }[] = [
  { id: "namaz", label: "Namaz", emoji: "🕌" },
  { id: "wudu", label: "Wudu", emoji: "💧" },
  { id: "qaida", label: "Qaida", emoji: "📖" },
];

export function IslamicShapesPanel({
  onInsertSvg,
  onInsertLetter,
  className = "",
  disabled = false,
}: IslamicShapesPanelProps) {
  const [tab, setTab] = useState<IslamicShapeCategory>("namaz");

  return (
    <aside
      className={`flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm lg:w-72 xl:w-80 ${className}`}
    >
      <div className="border-b border-navy/10 bg-gradient-to-r from-navy to-[#0a3a7a] px-3 py-3 text-white">
        <h3 className="text-sm font-bold">Teaching Shapes</h3>
        <p className="text-[11px] text-white/75">Kid-friendly — tap to add</p>
      </div>

      <div className="flex gap-1 border-b border-navy/10 bg-cream/40 p-1.5">
        {TABS.map(({ id, label, emoji }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-bold transition ${
              tab === id
                ? "bg-gold text-white shadow-sm"
                : "text-navy hover:bg-white"
            }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <div className={`max-h-[420px] overflow-y-auto p-3 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
        {tab === "namaz" ? <NamazPositions onInsert={onInsertSvg} /> : null}
        {tab === "wudu" ? <WuduDiagram onInsert={onInsertSvg} /> : null}
        {tab === "qaida" ? <QaidaTools onInsertLetter={onInsertLetter} /> : null}
      </div>
    </aside>
  );
}
