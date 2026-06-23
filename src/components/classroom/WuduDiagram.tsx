import { WUDU_SHAPES } from "@/components/classroom/shapes/islamicShapeCatalog";
import { ShapeGrid } from "@/components/classroom/ShapeGrid";

interface WuduDiagramProps {
  onInsert: (svg: string) => void;
}

export function WuduDiagram({ onInsert }: WuduDiagramProps) {
  return (
    <div>
      <p className="mb-2 text-xs text-zinc-500">
        Show how to make Wudu — hands, face, arms, head, and feet, step by step.
      </p>
      <ShapeGrid items={WUDU_SHAPES} onInsert={onInsert} />
    </div>
  );
}
