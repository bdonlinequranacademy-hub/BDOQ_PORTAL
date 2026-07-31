import { Search } from "lucide-react";
import type { ProgressSort } from "@/features/admin/components/progress/adminProgressUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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
  const { t } = usePortalTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.progress.studentProgress")}</h2>
        <p className="mt-0.5 text-xs text-portal-muted">{t("admin.progress.searchHint")}</p>
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
            placeholder={t("admin.progress.searchPlaceholder")}
            className={cn(fieldClass, "w-full pl-9")}
          />
        </label>
        <select
          className={cn(fieldClass, "w-full sm:w-44")}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as ProgressSort)}
          aria-label={t("admin.progress.sortLabel")}
        >
          <option value="highest">{t("admin.progress.sortHighest")}</option>
          <option value="lowest">{t("admin.progress.sortLowest")}</option>
          <option value="recent">{t("admin.progress.sortRecent")}</option>
          <option value="student_name">{t("admin.progress.sortStudentName")}</option>
          <option value="most_surahs">{t("admin.progress.sortMostSurahs")}</option>
        </select>
      </div>
    </div>
  );
}
