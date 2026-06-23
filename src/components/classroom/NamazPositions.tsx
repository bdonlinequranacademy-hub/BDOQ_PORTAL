import { NAMAZ_SHAPES } from "@/components/classroom/shapes/islamicShapeCatalog";
import { ShapeGrid } from "@/components/classroom/ShapeGrid";

interface NamazPositionsProps {
  onInsert: (svg: string) => void;
}

export function NamazPositions({ onInsert }: NamazPositionsProps) {
  return (
    <div>
      <p className="mb-2 text-xs text-zinc-500">
        Tap a picture to teach each step of Salah — simple shapes for little learners.
      </p>
      <ShapeGrid items={NAMAZ_SHAPES} onInsert={onInsert} />
    </div>
  );
}
