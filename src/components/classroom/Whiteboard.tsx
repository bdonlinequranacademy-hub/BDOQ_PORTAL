import { useRef } from "react";
import { Download } from "lucide-react";
import { useWhiteboard } from "@/hooks/useWhiteboard";
import { WhiteboardToolbar } from "@/components/classroom/WhiteboardToolbar";
import { IslamicShapesPanel } from "@/components/classroom/IslamicShapes";
import { Button } from "@/components/ui/Button";
import type { RemoteWhiteboardSnapshot } from "@/types/classroom.types";

interface WhiteboardProps {
  className?: string;
  readOnly?: boolean;
  onDocumentChange?: (json: Record<string, unknown>) => void;
  remoteWhiteboard?: RemoteWhiteboardSnapshot | null;
  clearSignal?: number;
}

export function Whiteboard({
  className = "",
  readOnly = false,
  onDocumentChange,
  remoteWhiteboard,
  clearSignal = 0,
}: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
            <Button
              type="button"
              variant="ghost"
              className="h-8 gap-1.5 px-2 text-xs text-white hover:bg-white/15"
              onClick={exportPng}
            >
              <Download className="size-3.5" />
              Save PNG
            </Button>
          </div>

          <div
            ref={containerRef}
            className="relative w-full bg-[linear-gradient(rgba(3,33,79,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(3,33,79,0.04)_1px,transparent_1px)] bg-[size:24px_24px] p-3 sm:p-4"
          >
            {readOnly ? (
              <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 rounded-lg bg-gold/90 px-3 py-1.5 text-center text-[11px] font-semibold text-white">
                View only — teacher locked the board
              </div>
            ) : null}
            <canvas ref={canvasRef} className="block w-full rounded-xl border border-navy/10" />
          </div>
        </div>

        <IslamicShapesPanel
          onInsertSvg={(svg) => void insertSvg(svg)}
          onInsertLetter={insertQaidaCard}
          disabled={readOnly}
        />
      </div>
    </section>
  );
}
