import type { IslamicShapeItem } from "@/components/classroom/shapes/islamicShapeCatalog";

interface ShapeGridProps {
  items: IslamicShapeItem[];
  onInsert: (svg: string) => void;
}

export function ShapeGrid({ items, onInsert }: ShapeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onInsert(item.svg)}
          className="group flex flex-col items-center gap-1.5 rounded-2xl border-2 border-navy/10 bg-white p-2 transition hover:border-gold hover:bg-gold/5 active:scale-95"
          title={`Add ${item.label}`}
        >
          <div
            className="flex size-16 items-center justify-center rounded-xl bg-cream/60 p-1 [&_svg]:max-h-14 [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: item.svg }}
          />
          <span className="text-center text-[10px] font-bold leading-tight text-navy">
            <span className="mr-0.5">{item.emoji}</span>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
