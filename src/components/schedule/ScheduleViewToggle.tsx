import { LayoutList, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export type ScheduleViewMode = "timeline" | "table";

interface ScheduleViewToggleProps {
  value: ScheduleViewMode;
  onChange: (mode: ScheduleViewMode) => void;
}

export function ScheduleViewToggle({ value, onChange }: ScheduleViewToggleProps) {
  const { t } = usePortalTranslation();

  const options: { id: ScheduleViewMode; label: string; icon: typeof Rows3 }[] = [
    { id: "timeline", label: t("shared.schedule.timelineView"), icon: Rows3 },
    { id: "table", label: t("shared.schedule.tableView"), icon: LayoutList },
  ];

  return (
    <div
      className="inline-flex rounded-xl border border-portal bg-portal-surface p-1 shadow-sm"
      role="tablist"
      aria-label={t("shared.schedule.scheduleView")}
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
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition",
              active
                ? "bg-primary-dark text-white shadow-sm"
                : "text-portal-muted hover:bg-portal-muted/50 hover:text-portal-heading"
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
