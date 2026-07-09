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

const TABS: { id: AdminHomeworkTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "awaiting_grade", label: "Awaiting grade" },
  { id: "overdue", label: "Overdue" },
  { id: "fully_graded", label: "Fully graded" },
];

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
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">Assignments</h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            Filter by program, class, teacher, or due date.
          </p>
        </div>
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

      <div className="flex flex-wrap gap-2 border-b border-portal pb-4">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition",
              tab === item.id
                ? "bg-primary text-white shadow-sm"
                : "bg-portal-muted/50 text-portal-muted hover:text-portal-heading"
            )}
          >
            {item.label}
            <span
              className={cn(
                "tabular-nums",
                tab === item.id ? "text-white/90" : "text-portal-muted"
              )}
            >
              ({tabCounts[item.id]})
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
            placeholder="Search assignments…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search homework"
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
            aria-label="Filter by class"
          >
            <option value="">All classes</option>
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
            aria-label="Filter by teacher"
          >
            <option value="">All teachers</option>
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
            aria-label="Sort assignments"
          >
            <option value="due_soonest">Due soonest</option>
            <option value="due_latest">Due latest</option>
            <option value="newest">Newest first</option>
            <option value="most_submissions">Most submissions</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="date"
          className={cn(toolbarFieldClass, "sm:max-w-[180px]")}
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          aria-label="Due date from"
        />
        <span className="hidden text-sm text-portal-muted sm:inline">to</span>
        <input
          type="date"
          className={cn(toolbarFieldClass, "sm:max-w-[180px]")}
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          aria-label="Due date to"
        />
      </div>
    </div>
  );
}
