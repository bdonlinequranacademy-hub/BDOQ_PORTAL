import { LayoutList, Rows3 } from "lucide-react";

export type ScheduleViewMode = "timeline" | "table";

interface ScheduleViewToggleProps {
  value: ScheduleViewMode;
  onChange: (mode: ScheduleViewMode) => void;
}

export function ScheduleViewToggle({ value, onChange }: ScheduleViewToggleProps) {
  const options: { id: ScheduleViewMode; label: string; icon: typeof Rows3 }[] = [
    { id: "timeline", label: "Timeline", icon: Rows3 },
    { id: "table", label: "Table", icon: LayoutList },
  ];

  return (
    <div
      className="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1"
      role="tablist"
      aria-label="Schedule view"
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-white text-[#03214F] shadow-sm"
                : "text-zinc-500 hover:text-[#03214F]"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
