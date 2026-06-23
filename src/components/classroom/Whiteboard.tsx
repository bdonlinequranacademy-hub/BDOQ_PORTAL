import { memo, useCallback, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useWhiteboard } from "@/hooks/useWhiteboard";
import { WhiteboardToolbar } from "@/components/classroom/WhiteboardToolbar";
import { IslamicShapesPanel } from "@/components/classroom/IslamicShapes";
import type { QaidaCardColor } from "@/components/classroom/shapes/qaidaCatalog";
import { Button } from "@/components/ui/Button";
import type { RemoteWhiteboardSnapshot } from "@/types/classroom.types";

interface WhiteboardProps {
  className?: string;
  readOnly?: boolean;
  onDocumentChange?: (json: Record<string, unknown>) => void;
  remoteWhiteboard?: RemoteWhiteboardSnapshot | null;
  clearSignal?: number;
}

function WhiteboardInner({
  className = "",
  readOnly = false,
  onDocumentChange,
  remoteWhiteboard,
  clearSignal = 0,
}: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapesOpen, setShapesOpen] = useState(false);

  const insertSvgRef = useRef<(svg: string) => void>(() => {});
  const insertQaidaRef = useRef<(text: string, label: string, color: QaidaCardColor) => void>(() => {});

  const {
    tool,
    setTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    canUndo,
    canRedo,
    undo,
    redo,
    clearAll,
    exportPng,
    insertSvg,
    insertQaidaCard,
  } = useWhiteboard({
    canvasRef,
    containerRef,
    readOnly,
    onDocumentChange,
    remoteWhiteboard,
    clearSignal,
  });

  insertSvgRef.current = (svg) => void insertSvg(svg);
  insertQaidaRef.current = insertQaidaCard;

  const handleInsertSvg = useCallback((svg: string) => {
    insertSvgRef.current(svg);
  }, []);

  const handleInsertLetter = useCallback((text: string, label: string, color: QaidaCardColor) => {
    insertQaidaRef.current(text, label, color);
  }, []);

  return (
    <section className={`flex flex-col gap-3 ${className}`}>
      <WhiteboardToolbar
        tool={tool}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        canUndo={canUndo}
        canRedo={canRedo}
        disabled={readOnly}
        onToolChange={setTool}
        onColorChange={setStrokeColor}
        onStrokeWidthChange={setStrokeWidth}
        onUndo={() => void undo()}
        onRedo={() => void redo()}
        onClear={clearAll}
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-4 py-2.5 text-white">
            <span className="text-sm font-semibold">Interactive Whiteboard</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-semibold lg:hidden"
                onClick={() => setShapesOpen((open) => !open)}
              >
                Shapes
                {shapesOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
              <Button
                type="button"
                variant="ghost"
                className="h-8 gap-1.5 px-2 text-xs text-white hover:bg-white/15"
                onClick={exportPng}
              >
                <Download className="size-3.5" />
                Save
              </Button>
            </div>
          </div>

          <div className="relative w-full bg-[linear-gradient(rgba(3,33,79,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(3,33,79,0.04)_1px,transparent_1px)] bg-[size:24px_24px] p-2 sm:p-4">
            {readOnly ? (
              <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 rounded-lg bg-gold/90 px-3 py-1.5 text-center text-[11px] font-semibold text-white">
                View only — teacher locked the board
              </div>
            ) : null}
            <div ref={containerRef} className="h-[340px] w-full sm:h-[400px]">
              <canvas ref={canvasRef} className="block rounded-xl border border-navy/10" />
            </div>
          </div>
        </div>

        <div className={`${shapesOpen ? "block" : "hidden"} lg:block`}>
          <IslamicShapesPanel
            onInsertSvg={handleInsertSvg}
            onInsertLetter={handleInsertLetter}
            disabled={readOnly}
          />
        </div>
      </div>
    </section>
  );
}

export const Whiteboard = memo(WhiteboardInner);
