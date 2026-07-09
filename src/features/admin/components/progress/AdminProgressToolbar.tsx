import { Search } from "lucide-react";
import type { ProgressSort } from "@/features/admin/components/progress/adminProgressUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminProgressToolbarProps {
  search: string;
  sortBy: ProgressSort;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ProgressSort) => void;
}

const fieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminProgressToolbar({
  search,
  sortBy,
  onSearchChange,
  onSortChange,
}: IAdminProgressToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Student progress</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Search by student, class, or program.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative block w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search students…"
            className={cn(fieldClass, "w-full pl-9")}
          />
        </label>
        <select
          className={cn(fieldClass, "w-full sm:w-44")}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as ProgressSort)}
          aria-label="Sort progress"
        >
          <option value="highest">Highest progress</option>
          <option value="lowest">Lowest progress</option>
          <option value="recent">Recently updated</option>
          <option value="student_name">Student name</option>
          <option value="most_surahs">Most surahs</option>
        </select>
      </div>
    </div>
  );
}
