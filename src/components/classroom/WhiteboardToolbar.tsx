import type { ReactNode } from "react";
import {
  ArrowRight,
  Circle,
  Eraser,
  Minus,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  Trash2,
  Triangle,
  Type,
  Undo2,
} from "lucide-react";
import type { WhiteboardTool } from "@/types/classroom.types";

const COLOR_PRESETS = [
  { label: "Navy", value: "#03214F" },
  { label: "Gold", value: "#C4922B" },
  { label: "Black", value: "#111827" },
  { label: "Red", value: "#D14343" },
  { label: "Green", value: "#1F9D63" },
  { label: "Blue", value: "#1A4A8A" },
];

interface WhiteboardToolbarProps {
  tool: WhiteboardTool;
  strokeColor: string;
  strokeWidth: number;
  canUndo: boolean;
  canRedo: boolean;
  disabled?: boolean;
  onToolChange: (tool: WhiteboardTool) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

function ToolButton({
  active,
  label,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-gold text-white shadow-sm"
          : "text-navy hover:bg-navy-50"
      }`}
    >
      {children}
    </button>
  );
}

export function WhiteboardToolbar({
  tool,
  strokeColor,
  strokeWidth,
  canUndo,
  canRedo,
  disabled = false,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onClear,
}: WhiteboardToolbarProps) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between ${disabled ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center gap-1">
        <ToolButton
          label="Select"
          active={tool === "select"}
          disabled={disabled}
          onClick={() => onToolChange("select")}
        >
          <MousePointer2 className="size-4" />
        </ToolButton>
        <ToolButton label="Pen" active={tool === "pen"} disabled={disabled} onClick={() => onToolChange("pen")}>
          <Pencil className="size-4" />
        </ToolButton>
        <ToolButton
          label="Eraser"
          active={tool === "eraser"}
          disabled={disabled}
          onClick={() => onToolChange("eraser")}
        >
          <Eraser className="size-4" />
        </ToolButton>
        <ToolButton label="Text" active={tool === "text"} disabled={disabled} onClick={() => onToolChange("text")}>
          <Type className="size-4" />
        </ToolButton>

        <span className="mx-1 hidden h-6 w-px bg-navy/10 sm:block" />

        <ToolButton label="Rectangle" disabled={disabled} onClick={() => onToolChange("rect")}>
          <Square className="size-4" />
        </ToolButton>
        <ToolButton label="Circle" disabled={disabled} onClick={() => onToolChange("circle")}>
          <Circle className="size-4" />
        </ToolButton>
        <ToolButton label="Triangle" disabled={disabled} onClick={() => onToolChange("triangle")}>
          <Triangle className="size-4" />
        </ToolButton>
        <ToolButton label="Line" disabled={disabled} onClick={() => onToolChange("line")}>
          <Minus className="size-4" />
        </ToolButton>
        <ToolButton label="Arrow" disabled={disabled} onClick={() => onToolChange("arrow")}>
          <ArrowRight className="size-4" />
        </ToolButton>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              aria-label={preset.label}
              disabled={disabled}
              onClick={() => onColorChange(preset.value)}
              className={`size-6 rounded-full border-2 transition ${
                strokeColor === preset.value ? "border-gold scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: preset.value }}
            />
          ))}
          <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-navy/15">
            <span className="sr-only">Custom color</span>
            <input
              type="color"
              value={strokeColor}
              disabled={disabled}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
            <span
              className="size-5 rounded-full border border-navy/10"
              style={{ backgroundColor: strokeColor }}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-navy/70">
          <span>Size</span>
          <input
            type="range"
            min={1}
            max={20}
            value={strokeWidth}
            disabled={disabled}
            onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
            className="w-20 accent-gold"
          />
          <span className="w-4 text-right tabular-nums">{strokeWidth}</span>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Undo"
            aria-label="Undo"
            disabled={!canUndo || disabled}
            onClick={onUndo}
            className="flex size-9 items-center justify-center rounded-lg text-navy transition hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            title="Redo"
            aria-label="Redo"
            disabled={!canRedo || disabled}
            onClick={onRedo}
            className="flex size-9 items-center justify-center rounded-lg text-navy transition hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Redo2 className="size-4" />
          </button>
          <ToolButton label="Clear all" disabled={disabled} onClick={onClear}>
            <Trash2 className="size-4" />
          </ToolButton>
        </div>
      </div>
    </div>
  );
}
