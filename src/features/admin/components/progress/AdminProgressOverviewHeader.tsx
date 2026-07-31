import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminProgressOverviewHeaderProps {
  dateFrom: string;
  dateTo: string;
  programFilter: string;
  classFilter: string;
  classes: { _id: string; title: string }[];
  curriculumTree: CurriculumNode[];
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onExport: () => void;
}

const fieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminProgressOverviewHeader({
  dateFrom,
  dateTo,
  programFilter,
  classFilter,
  classes,
  curriculumTree,
  onDateFromChange,
  onDateToChange,
  onProgramChange,
  onClassChange,
  onExport,
}: IAdminProgressOverviewHeaderProps) {
  const { t } = usePortalTranslation();

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
            {t("admin.progress.academyAnalytics")}
          </p>
          <h1 className="portal-page-title mt-1 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.progress.title")}
          </h1>
          <p className="portal-page-subtitle mt-2 max-w-2xl text-sm text-portal-muted sm:text-base">
            {t("admin.progress.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
              className={cn(fieldClass, "w-full sm:w-auto")}
              aria-label={t("filters.dateFrom")}
            />
            <span className="text-xs text-portal-muted">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => onDateToChange(event.target.value)}
              className={cn(fieldClass, "w-full sm:w-auto")}
              aria-label={t("filters.dateTo")}
            />
          </div>
          <CurriculumProgramFilter
            tree={curriculumTree}
            value={programFilter}
            onChange={onProgramChange}
            className="w-full sm:min-w-[180px]"
          />
          <select
            className={cn(fieldClass, "w-full sm:min-w-[180px]")}
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
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm"
          >
            <Download className="size-4" aria-hidden />
            {t("actions.exportReport")}
          </Button>
        </div>
      </div>
    </div>
  );
}
