import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import {
  type AdminHomeworkTab,
  type HomeworkSort,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkToolbarProps {
  search: string;
  programFilter: string;
  classFilter: string;
  teacherFilter: string;
  dateFrom: string;
  dateTo: string;
  sortBy: HomeworkSort;
  tab: AdminHomeworkTab;
  tabCounts: Record<AdminHomeworkTab, number>;
  classes: { id: string; title: string }[];
  teachers: { id: string; name: string }[];
  curriculumTree: CurriculumNode[];
  onSearchChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortChange: (value: HomeworkSort) => void;
  onTabChange: (tab: AdminHomeworkTab) => void;
  onExport: () => void;
}

const TABS: AdminHomeworkTab[] = ["all", "awaiting_grade", "overdue", "fully_graded"];

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminHomeworkToolbar({
  search,
  programFilter,
  classFilter,
  teacherFilter,
  dateFrom,
  dateTo,
  sortBy,
  tab,
  tabCounts,
  classes,
  teachers,
  curriculumTree,
  onSearchChange,
  onProgramChange,
  onClassChange,
  onTeacherChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onTabChange,
  onExport,
}: IAdminHomeworkToolbarProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  const tabLabel = (id: AdminHomeworkTab): string => {
    if (id === "all") return t("labels.all");
    return statusLabel(id);
  };

  const sortOptions: { value: HomeworkSort; labelKey: string }[] = [
    { value: "due_soonest", labelKey: "admin.homework.sortDueSoonest" },
    { value: "due_latest", labelKey: "admin.homework.sortDueLatest" },
    { value: "newest", labelKey: "admin.homework.sortNewest" },
    { value: "most_submissions", labelKey: "admin.homework.sortMostSubmissions" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">
            {t("admin.homework.toolbarTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            {t("admin.homework.toolbarSubtitle")}
          </p>
        </div>
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

      <div className="flex flex-wrap gap-2 border-b border-portal pb-4">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onTabChange(item)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-[8px] px-4 text-sm font-semibold transition",
              tab === item
                ? "bg-primary text-white shadow-sm"
                : "bg-portal-muted/50 text-portal-muted hover:text-portal-heading"
            )}
          >
            {tabLabel(item)}
            <span
              className={cn(
                "tabular-nums",
                tab === item ? "text-white/90" : "text-portal-muted"
              )}
            >
              ({formatNumber(tabCounts[item])})
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "pl-9")}
            placeholder={t("admin.homework.searchPlaceholder")}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={t("admin.homework.searchAria")}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
          <CurriculumProgramFilter
            tree={curriculumTree}
            value={programFilter}
            onChange={onProgramChange}
            className={cn(toolbarFieldClass, "w-full min-w-[160px] xl:w-auto")}
          />
          <select
            className={toolbarFieldClass}
            value={classFilter}
            onChange={(event) => onClassChange(event.target.value)}
            aria-label={t("filters.filterByClass")}
          >
            <option value="">{t("filters.allClasses")}</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.title}
              </option>
            ))}
          </select>
          <select
            className={toolbarFieldClass}
            value={teacherFilter}
            onChange={(event) => onTeacherChange(event.target.value)}
            aria-label={t("filters.filterByTeacher")}
          >
            <option value="">{t("filters.allTeachers")}</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <select
            className={toolbarFieldClass}
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as HomeworkSort)}
            aria-label={t("admin.homework.sortAssignments")}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="date"
          className={cn(toolbarFieldClass, "sm:max-w-[180px]")}
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          aria-label={t("admin.homework.dueDateFrom")}
        />
        <span className="hidden text-sm text-portal-muted sm:inline">
          {t("admin.homework.dateTo")}
        </span>
        <input
          type="date"
          className={cn(toolbarFieldClass, "sm:max-w-[180px]")}
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          aria-label={t("admin.homework.dueDateTo")}
        />
      </div>
    </div>
  );
}
