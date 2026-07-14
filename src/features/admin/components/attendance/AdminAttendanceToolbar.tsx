import { Download, Eraser, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type {
  AttendanceRateFilter,
  AttendanceSort,
} from "@/features/admin/components/attendance/adminAttendanceUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminAttendanceToolbarProps {
  search: string;
  sortBy: AttendanceSort;
  rateFilter: AttendanceRateFilter;
  classFilterLabel?: string;
  resultCount: number;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: AttendanceSort) => void;
  onRateFilterChange: (value: AttendanceRateFilter) => void;
  onClearFilters: () => void;
  onExport: () => void;
}

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

const RATE_LABELS: Record<AttendanceRateFilter, string> = {
  all: "All rates",
  low: "Needs attention",
  good: "Good attendance",
  excellent: "Excellent",
};

export function AdminAttendanceToolbar({
  search,
  sortBy,
  rateFilter,
  classFilterLabel,
  resultCount,
  hasActiveFilters,
  onSearchChange,
  onSortChange,
  onRateFilterChange,
  onClearFilters,
  onExport,
}: IAdminAttendanceToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">Class attendance</h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            Showing {resultCount} class{resultCount === 1 ? "" : "es"} · search, sort, or clear
            filters anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4 disabled:opacity-45"
          >
            <Eraser className="size-4" aria-hidden />
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4"
          >
            <Download className="size-4" aria-hidden />
            Export
          </Button>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          {classFilterLabel ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
              Class: {classFilterLabel}
            </span>
          ) : null}
          {search.trim() ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1.5 rounded-full border border-portal bg-portal-muted/30 px-2.5 py-1 text-[11px] font-semibold text-portal-heading transition hover:border-primary/30"
            >
              Search: “{search.trim()}”
              <X className="size-3" aria-hidden />
            </button>
          ) : null}
          {rateFilter !== "all" ? (
            <button
              type="button"
              onClick={() => onRateFilterChange("all")}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100"
            >
              {RATE_LABELS[rateFilter]}
              <X className="size-3" aria-hidden />
            </button>
          ) : null}
          {sortBy !== "highest" ? (
            <span className="inline-flex items-center rounded-full border border-portal bg-portal-muted/20 px-2.5 py-1 text-[11px] font-semibold text-portal-muted">
              Sorted: {sortBy.replace(/_/g, " ")}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "pl-9")}
            placeholder="Search class or teacher…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search attendance"
          />
        </div>
        <select
          className={cn(toolbarFieldClass, "w-full lg:w-48")}
          value={rateFilter}
          onChange={(event) =>
            onRateFilterChange(event.target.value as AttendanceRateFilter)
          }
          aria-label="Filter by attendance rate"
        >
          <option value="all">All rates</option>
          <option value="low">Needs attention (&lt;60%)</option>
          <option value="good">Good (60–79%)</option>
          <option value="excellent">Excellent (80%+)</option>
        </select>
        <select
          className={cn(toolbarFieldClass, "w-full lg:w-52")}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as AttendanceSort)}
          aria-label="Sort attendance"
        >
          <option value="highest">Highest attendance</option>
          <option value="lowest">Lowest attendance</option>
          <option value="most_records">Most records</option>
          <option value="class_name">Class name</option>
        </select>
      </div>
    </div>
  );
}
