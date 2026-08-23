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
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          {t("admin.progress.title")}
        </h1>
        <p className="hidden mt-1 text-sm text-portal-muted sm:block">
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
          variant="secondary"
          onClick={onExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl"
        >
          <Download className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t("actions.exportReport")}</span>
        </Button>
      </div>
    </div>
  );
}
