import { FileSpreadsheet, FileText, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formControlClass } from "@/lib/formControl";
import { roleLabel } from "@/lib/assignableRoles";
import type { Role } from "@/types/models";

export type AdminUsersStatusFilter = "all" | "active" | "inactive";

interface IAdminUsersFilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: AdminUsersStatusFilter;
  onStatusFilterChange: (value: AdminUsersStatusFilter) => void;
  genderFilter: "all" | "male" | "female";
  onGenderFilterChange: (value: "all" | "male" | "female") => void;
  showGenderFilter: boolean;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  roleFilterOptions: readonly (Role | "all")[];
  roleFilter: Role | "all";
  onRoleFilterChange: (value: Role | "all") => void;
}

export function AdminUsersFilterPanel({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  genderFilter,
  onGenderFilterChange,
  showGenderFilter,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  onExportCsv,
  onExportExcel,
  roleFilterOptions,
  roleFilter,
  onRoleFilterChange,
}: IAdminUsersFilterPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-portal-heading">Filter Users</h2>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-portal-muted">Search</span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
                aria-hidden
              />
              <input
                className={`${formControlClass} py-2.5 pl-9 text-sm`}
                placeholder="Name or email…"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </label>

          <Select
            label="Role"
            value={roleFilter}
            onChange={(event) => onRoleFilterChange(event.target.value as Role | "all")}
            className="py-2.5 text-sm"
          >
            {roleFilterOptions.map((role) => (
              <option key={role} value={role}>
                {role === "all" ? "All roles" : roleLabel(role)}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as AdminUsersStatusFilter)
            }
            className="py-2.5 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>

          {showGenderFilter ? (
            <Select
              label="Teacher gender"
              value={genderFilter}
              onChange={(event) =>
                onGenderFilterChange(event.target.value as "all" | "male" | "female")
              }
              className="py-2.5 text-sm"
            >
              <option value="all">All teachers</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Select>
          ) : null}

          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">Joined from</span>
              <input
                type="date"
                className={`${formControlClass} py-2.5 text-sm`}
                value={dateFrom}
                onChange={(event) => onDateFromChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">Joined to</span>
              <input
                type="date"
                className={`${formControlClass} py-2.5 text-sm`}
                value={dateTo}
                onChange={(event) => onDateToChange(event.target.value)}
              />
            </label>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
        <h2 className="mb-3 text-sm font-bold text-portal-heading">Export Users</h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FileText className="size-4 text-primary" aria-hidden />
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FileSpreadsheet className="size-4 text-primary" aria-hidden />
            Export Excel
          </button>
        </div>
      </Card>
    </div>
  );
}
