import type { SessionPhase } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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
  const { t } = usePortalTranslation();

  return (
    <div
      className="flex gap-1 overflow-x-auto border-b border-portal"
      role="tablist"
      aria-label={t("admin.liveMonitor.filters.filterSessions")}
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
              "shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-portal-muted hover:text-portal-heading"
            )}
          >
            {filter.label}
            {filter.count !== undefined ? (
              <span
                className={cn(
                  "ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                  isActive ? "bg-primary/10 text-primary" : "bg-portal-muted text-portal-muted"
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
