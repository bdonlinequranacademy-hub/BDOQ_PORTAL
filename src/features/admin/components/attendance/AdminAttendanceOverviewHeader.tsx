import { Download, Eraser, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AttendanceRateFilter } from "@/features/admin/components/attendance/adminAttendanceUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminAttendanceOverviewHeaderProps {
  classFilter: string;
  rateFilter: AttendanceRateFilter;
  classes: { _id: string; title: string }[];
  hasActiveFilters: boolean;
  isFetching?: boolean;
  onClassChange: (value: string) => void;
  onRateFilterChange: (value: AttendanceRateFilter) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  onExport: () => void;
}

export function AdminAttendanceOverviewHeader({
  classFilter,
  rateFilter,
  classes,
  hasActiveFilters,
  isFetching = false,
  onClassChange,
  onRateFilterChange,
  onClearFilters,
  onRefresh,
  onExport,
}: IAdminAttendanceOverviewHeaderProps) {
  return (
    <div className="portal-card-islamic portal-card--lg relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8 sm:py-8">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-56 rounded-full bg-primary/8 blur-2xl sm:size-72"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[min(100%,42rem)] -translate-x-1/2 opacity-[0.14] sm:h-40"
        style={{
          backgroundImage: "url('/brand/islamic-shape-bg.png')",
          backgroundSize: "contain",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Academy analytics
          </p>
          <h1 className="portal-page-title mt-1 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Attendance Analytics
          </h1>
          <p className="portal-page-subtitle mt-2 max-w-2xl text-sm text-portal-muted sm:text-base">
            Track class attendance and student participation across all active classes.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:max-w-xl lg:items-end">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <select
              className={cn(
                formControlClass,
                "h-10 min-h-10 w-full py-2 text-sm shadow-none sm:min-w-[180px] sm:flex-1"
              )}
              value={classFilter}
              onChange={(event) => onClassChange(event.target.value)}
              aria-label="Filter by class"
            >
              <option value="">All classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </select>

            <select
              className={cn(
                formControlClass,
                "h-10 min-h-10 w-full py-2 text-sm shadow-none sm:min-w-[160px]"
              )}
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
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm disabled:opacity-45"
            >
              <Eraser className="size-4" aria-hidden />
              Clear filters
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onRefresh}
              disabled={isFetching}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm"
            >
              <RefreshCw
                className={cn("size-4", isFetching && "animate-spin")}
                aria-hidden
              />
              Refresh
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onExport}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm"
            >
              <Download className="size-4" aria-hidden />
              Export report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
