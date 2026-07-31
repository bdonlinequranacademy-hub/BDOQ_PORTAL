import { FileSpreadsheet, FileText, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formControlClass } from "@/lib/formControl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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
  const { t, statusLabel, dynamicLabel, role } = usePortalTranslation();

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-portal-heading">{t("filters.filterUsers")}</h2>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t("filters.clearAll")}
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-portal-muted">{t("filters.search")}</span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
                aria-hidden
              />
              <input
                className={`${formControlClass} py-2.5 pl-9 text-sm`}
                placeholder={t("filters.nameOrEmail")}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </label>

          <Select
            label={t("labels.role")}
            value={roleFilter}
            onChange={(event) => onRoleFilterChange(event.target.value as Role | "all")}
            className="py-2.5 text-sm"
          >
            {roleFilterOptions.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption === "all" ? t("filters.allRoles") : role(roleOption)}
              </option>
            ))}
          </Select>

          <Select
            label={t("tables.status")}
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as AdminUsersStatusFilter)
            }
            className="py-2.5 text-sm"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="active">{statusLabel("active")}</option>
            <option value="inactive">{statusLabel("inactive")}</option>
          </Select>

          {showGenderFilter ? (
            <Select
              label={t("filters.teacherGender")}
              value={genderFilter}
              onChange={(event) =>
                onGenderFilterChange(event.target.value as "all" | "male" | "female")
              }
              className="py-2.5 text-sm"
            >
              <option value="all">{t("filters.allTeachers")}</option>
              <option value="female">{dynamicLabel("female")}</option>
              <option value="male">{dynamicLabel("male")}</option>
            </Select>
          ) : null}

          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">{t("filters.joinedFrom")}</span>
              <input
                type="date"
                className={`${formControlClass} py-2.5 text-sm`}
                value={dateFrom}
                onChange={(event) => onDateFromChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-portal-muted">{t("filters.joinedTo")}</span>
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
        <h2 className="mb-3 text-sm font-bold text-portal-heading">{t("filters.exportUsers")}</h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FileText className="size-4 text-primary" aria-hidden />
            {t("filters.exportCsv")}
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5"
          >
            <FileSpreadsheet className="size-4 text-primary" aria-hidden />
            {t("filters.exportExcel")}
          </button>
        </div>
      </Card>
    </div>
  );
}
