import { Download, Eraser, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type {
  AttendanceRateFilter,
  AttendanceSort,
} from "@/features/admin/components/attendance/adminAttendanceUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

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

const SORT_LABEL_KEYS: Record<AttendanceSort, string> = {
  highest: "filters.highestAttendance",
  lowest: "filters.lowestAttendance",
  most_records: "filters.mostRecords",
  class_name: "filters.className",
};

const RATE_FILTER_LABEL_KEYS: Record<AttendanceRateFilter, string> = {
  all: "filters.allRates",
  low: "status.needs_attention",
  good: "admin.attendance.rateGoodShort",
  excellent: "status.excellent",
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
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  const rateChipLabel = (filter: AttendanceRateFilter): string => {
    if (filter === "low") return statusLabel("needs_attention");
    if (filter === "excellent") return statusLabel("excellent");
    if (filter === "good") return t("admin.attendance.rateGoodShort");
    return t("filters.allRates");
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">
            {t("admin.attendance.toolbarTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            {t("admin.attendance.toolbarSubtitle", {
              count: formatNumber(resultCount),
            })}
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
            {t("filters.clear")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4"
          >
            <Download className="size-4" aria-hidden />
            {t("filters.export")}
          </Button>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          {classFilterLabel ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
              {t("admin.attendance.classFilterChip", { name: classFilterLabel })}
            </span>
          ) : null}
          {search.trim() ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="inline-flex items-center gap-1.5 rounded-full border border-portal bg-portal-muted/30 px-2.5 py-1 text-[11px] font-semibold text-portal-heading transition hover:border-primary/30"
            >
              {t("admin.attendance.searchChip", { query: search.trim() })}
              <X className="size-3" aria-hidden />
            </button>
          ) : null}
          {rateFilter !== "all" ? (
            <button
              type="button"
              onClick={() => onRateFilterChange("all")}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100"
            >
              {rateChipLabel(rateFilter)}
              <X className="size-3" aria-hidden />
            </button>
          ) : null}
          {sortBy !== "highest" ? (
            <span className="inline-flex items-center rounded-full border border-portal bg-portal-muted/20 px-2.5 py-1 text-[11px] font-semibold text-portal-muted">
              {t("admin.attendance.sortedChip", { sort: t(SORT_LABEL_KEYS[sortBy]) })}
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
            placeholder={t("filters.searchClassTeacher")}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={t("filters.searchAttendance")}
          />
        </div>
        <select
          className={cn(toolbarFieldClass, "w-full lg:w-48")}
          value={rateFilter}
          onChange={(event) =>
            onRateFilterChange(event.target.value as AttendanceRateFilter)
          }
          aria-label={t("filters.filterAttendanceRate")}
        >
          <option value="all">{t(RATE_FILTER_LABEL_KEYS.all)}</option>
          <option value="low">{t("filters.needsAttentionPct")}</option>
          <option value="good">{t("admin.attendance.rateGood")}</option>
          <option value="excellent">{t("filters.excellentPct")}</option>
        </select>
        <select
          className={cn(toolbarFieldClass, "w-full lg:w-52")}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as AttendanceSort)}
          aria-label={t("filters.sortAttendance")}
        >
          {(Object.keys(SORT_LABEL_KEYS) as AttendanceSort[]).map((sortKey) => (
            <option key={sortKey} value={sortKey}>
              {t(SORT_LABEL_KEYS[sortKey])}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
