import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  type AdminStudentRequestsTab,
  type StudentRequestSort,
} from "@/features/admin/components/student-requests/adminStudentRequestsUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminStudentRequestsToolbarProps {
  search: string;
  teacherFilter: string;
  courseFilter: string;
  dateFrom: string;
  dateTo: string;
  sortBy: StudentRequestSort;
  tab: AdminStudentRequestsTab;
  tabCounts: Record<AdminStudentRequestsTab, number>;
  teachers: { id: string; name: string }[];
  courses: string[];
  onSearchChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortChange: (value: StudentRequestSort) => void;
  onTabChange: (tab: AdminStudentRequestsTab) => void;
  onExport: () => void;
}

const TABS: { id: AdminStudentRequestsTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminStudentRequestsToolbar({
  search,
  teacherFilter,
  courseFilter,
  dateFrom,
  dateTo,
  sortBy,
  tab,
  tabCounts,
  teachers,
  courses,
  onSearchChange,
  onTeacherChange,
  onCourseChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onTabChange,
  onExport,
}: IAdminStudentRequestsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Search &amp; filters</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Find requests by teacher, course preference, or submission date.
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "pl-9")}
            placeholder="Search teacher, message, course…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search student requests"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap xl:items-center xl:justify-end">
          <select
            value={teacherFilter}
            onChange={(event) => onTeacherChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
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
            value={courseFilter}
            onChange={(event) => onCourseChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label="Filter by course"
          >
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label="Date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label="Date to"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-portal pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "shrink-0 rounded-[8px] px-3.5 py-1.5 text-xs font-semibold transition",
                tab === item.id
                  ? "bg-primary-dark text-white shadow-sm"
                  : "border border-portal bg-portal-muted/20 text-portal-heading hover:bg-portal-muted/40"
              )}
            >
              {item.label} ({tabCounts[item.id]})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as StudentRequestSort)}
            className={cn(toolbarFieldClass, "min-w-[140px]")}
            aria-label="Sort requests"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl border border-portal px-4"
          >
            <Download className="size-4" aria-hidden />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
