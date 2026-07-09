import { Filter } from "lucide-react";
import { formControlClass } from "@/lib/formControl";
import { SCHEDULE_DAYS } from "@/lib/utils/schedule";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import type { AdminRoutineStatusFilter } from "@/features/admin/components/routine/adminRoutineUtils";
import type { ITeacherFilterOption } from "@/features/admin/components/classes/adminClassesUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminRoutineFiltersProps {
  courseTypes: string[];
  teachers: ITeacherFilterOption[];
  countries: string[];
  dayCounts: Record<string, number>;
  courseType: string;
  teacherId: string;
  country: string;
  status: AdminRoutineStatusFilter;
  day: string;
  onCourseTypeChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onStatusChange: (value: AdminRoutineStatusFilter) => void;
  onDayChange: (value: string) => void;
}

export function AdminRoutineFilters({
  courseTypes,
  teachers,
  countries,
  dayCounts,
  courseType,
  teacherId,
  country,
  status,
  day,
  onCourseTypeChange,
  onTeacherChange,
  onCountryChange,
  onStatusChange,
  onDayChange,
}: IAdminRoutineFiltersProps) {
  const hasActiveFilters = Boolean(courseType || teacherId || country || status);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <select
          value={courseType}
          onChange={(event) => onCourseTypeChange(event.target.value)}
          className={formControlClass}
          aria-label="Filter by course type"
        >
          <option value="">All course types</option>
          {courseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={teacherId}
          onChange={(event) => onTeacherChange(event.target.value)}
          className={formControlClass}
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
          value={country}
          onChange={(event) => onCountryChange(event.target.value)}
          className={formControlClass}
          aria-label="Filter by country"
        >
          <option value="">All countries</option>
          {countries.map((item) => (
            <option key={item} value={item}>
              {formatCountryWithFlag(item)}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as AdminRoutineStatusFilter)}
          className={formControlClass}
          aria-label="Filter by status"
        >
          <option value="">All status</option>
          <option value="live">Live now</option>
          <option value="upcoming">Starting soon</option>
          <option value="scheduled">Weekly scheduled</option>
          <option value="completed">Completed today</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => onDayChange("")}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
              day === ""
                ? "bg-primary-dark text-white shadow-sm"
                : "border border-portal bg-portal-surface text-portal-heading hover:bg-portal-muted/50"
            )}
          >
            All days ({dayCounts.all ?? 0})
          </button>
          {SCHEDULE_DAYS.map((scheduleDay) => {
            const count = dayCounts[scheduleDay] ?? 0;
            if (count === 0 && day !== scheduleDay) return null;
            return (
              <button
                key={scheduleDay}
                type="button"
                onClick={() => onDayChange(scheduleDay)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  day === scheduleDay
                    ? "bg-primary-dark text-white shadow-sm"
                    : "border border-portal bg-portal-surface text-portal-heading hover:bg-portal-muted/50"
                )}
              >
                {scheduleDay.slice(0, 3)} ({count})
              </button>
            );
          })}
        </div>

        {hasActiveFilters ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-portal-muted">
            <Filter className="size-3.5" aria-hidden />
            Filters applied
          </span>
        ) : null}
      </div>
    </div>
  );
}
