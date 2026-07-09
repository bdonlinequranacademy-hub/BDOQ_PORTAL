import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AttendanceSort } from "@/features/admin/components/attendance/adminAttendanceUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminAttendanceToolbarProps {
  search: string;
  sortBy: AttendanceSort;
  onSearchChange: (value: string) => void;
  onSortChange: (value: AttendanceSort) => void;
  onExport: () => void;
}

const toolbarFieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminAttendanceToolbar({
  search,
  sortBy,
  onSearchChange,
  onSortChange,
  onExport,
}: IAdminAttendanceToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">Class attendance</h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            Search by class or teacher and sort by attendance rate.
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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "pl-9")}
            placeholder="Search class or teacher…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search attendance"
          />
        </div>
        <select
          className={cn(toolbarFieldClass, "w-full lg:w-52")}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as AttendanceSort)}
          aria-label="Sort attendance"
        >
          <option value="highest">Highest attendance</option>
          <option value="lowest">Lowest attendance</option>
          <option value="most_records">Most records</option>
          <option value="class_name">Class name</option>
        </select>
      </div>
    </div>
  );
}
