import type { SessionPhase } from "@/types/models";
import { cn } from "@/lib/utils/cn";

export type LiveMonitorFilter = "all" | SessionPhase | "issues";

interface IFilterOption {
  id: LiveMonitorFilter;
  label: string;
  count?: number;
}

interface ILiveMonitorFilterTabsProps {
  filters: IFilterOption[];
  active: LiveMonitorFilter;
  onChange: (id: LiveMonitorFilter) => void;
}

export function LiveMonitorFilterTabs({
  filters,
  active,
  onChange,
}: ILiveMonitorFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-2 rounded-2xl border border-portal bg-portal-surface p-2 shadow-sm"
      role="tablist"
      aria-label="Filter sessions"
    >
      {filters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.id)}
            className={cn(
              "rounded-xl px-3.5 py-2 text-xs font-semibold transition",
              isActive
                ? "bg-primary text-white shadow-sm dark:bg-emerald-600"
                : "text-portal-muted hover:bg-portal-surface-muted hover:text-portal-heading"
            )}
          >
            {filter.label}
            {filter.count !== undefined ? (
              <span
                className={cn(
                  "ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                  isActive ? "bg-white/20" : "bg-portal-surface-muted"
                )}
              >
                {filter.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
