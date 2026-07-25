import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { CmsStatusFilter } from "@/features/admin/lib/adminCmsUtils";

interface IAdminCmsListToolbarProps {
  title: string;
  subtitle: string;
  search: string;
  status: CmsStatusFilter;
  newLabel: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CmsStatusFilter) => void;
  onNew: () => void;
}

export function AdminCmsListToolbar({
  title,
  subtitle,
  search,
  status,
  newLabel,
  searchPlaceholder = "Search…",
  onSearchChange,
  onStatusChange,
  onNew,
}: IAdminCmsListToolbarProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-primary-dark">{title}</h2>
          <p className="mt-0.5 text-xs text-portal-muted">{subtitle}</p>
        </div>
        <Button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden />
          {newLabel}
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted" />
          <input
            className={cn(formControlClass, "py-2.5 pl-10")}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className={cn(formControlClass, "w-full sm:w-auto sm:min-w-[140px] py-2.5")}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as CmsStatusFilter)}
          aria-label="Filter by visibility"
        >
          <option value="all">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </Card>
  );
}
