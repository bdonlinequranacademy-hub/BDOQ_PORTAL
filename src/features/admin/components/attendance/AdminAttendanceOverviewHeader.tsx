import { Download, Eraser, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AttendanceRateFilter } from "@/features/admin/components/attendance/adminAttendanceUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

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
  const { t } = usePortalTranslation();

  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          {t("admin.attendance.title")}
        </h1>
        <p className="hidden mt-1 text-sm text-portal-muted sm:block">
          {t("admin.attendance.subtitle")}
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
            aria-label={t("filters.filterByClass")}
          >
            <option value="">{t("filters.allClasses")}</option>
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
            aria-label={t("filters.filterAttendanceRate")}
          >
            <option value="all">{t("filters.allRates")}</option>
            <option value="low">{t("filters.needsAttentionPct")}</option>
            <option value="good">{t("admin.attendance.rateGood")}</option>
            <option value="excellent">{t("filters.excellentPct")}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 disabled:opacity-45"
          >
            <Eraser className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("filters.clearFilters")}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4"
          >
            <RefreshCw
              className={cn("size-4", isFetching && "animate-spin")}
              aria-hidden
            />
            <span className="hidden sm:inline">{t("actions.refresh")}</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4"
          >
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("actions.exportReport")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
