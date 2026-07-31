import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type {
  PricingSort,
  PricingStatusFilter,
} from "@/features/admin/components/pricing/adminPricingUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminPricingToolbarProps {
  search: string;
  status: PricingStatusFilter;
  period: string;
  periods: string[];
  sortBy: PricingSort;
  showAdvancedFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PricingStatusFilter) => void;
  onPeriodChange: (value: string) => void;
  onSortChange: (value: PricingSort) => void;
  onToggleAdvancedFilters: () => void;
  onNewPackage: () => void;
}

export function AdminPricingToolbar({
  search,
  status,
  period,
  periods,
  sortBy,
  showAdvancedFilters,
  onSearchChange,
  onStatusChange,
  onPeriodChange,
  onSortChange,
  onToggleAdvancedFilters,
  onNewPackage,
}: IAdminPricingToolbarProps) {
  const { t, statusLabel } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-primary-dark">Pricing Packages</h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            Packages shown on the public /pricing page
          </p>
        </div>
        <Button
          type="button"
          onClick={onNewPackage}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-white hover:bg-primary-dark lg:hidden"
        >
          <Plus className="size-4" aria-hidden />
          New Package
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted" />
          <input
            className={cn(formControlClass, "py-2.5 pl-10")}
            placeholder="Search by name or slug…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className={cn(formControlClass, "w-auto min-w-[120px] py-2.5")}
            value={status}
            onChange={(e) => onStatusChange(e.target.value as PricingStatusFilter)}
            aria-label="Filter by status"
          >
            <option value="all">All status</option>
            <option value="published">{t("admin.common.statPublished")}</option>
            <option value="draft">{statusLabel("draft")}</option>
            <option value="popular">Popular</option>
          </select>

          <select
            className={cn(formControlClass, "w-auto min-w-[130px] py-2.5")}
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            aria-label="Filter by package period"
          >
            <option value="">All periods</option>
            {periods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className={cn(formControlClass, "w-auto min-w-[140px] py-2.5")}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as PricingSort)}
            aria-label="Sort packages"
          >
            <option value="sort-order">Sort order</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>

          <button
            type="button"
            onClick={onToggleAdvancedFilters}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
              showAdvancedFilters
                ? "border-primary/40 bg-primary/10 text-primary-dark"
                : "border-portal text-portal-muted hover:border-primary/30 hover:bg-portal-muted/20"
            )}
          >
            <Filter className="size-4" aria-hidden />
            Filters
          </button>
        </div>
      </div>

      {showAdvancedFilters ? (
        <p className="mt-3 rounded-xl bg-portal-muted/20 px-3 py-2 text-xs text-portal-muted">
          Tip: Use status and period filters together. Mark a package Popular in
          the edit form to highlight it on the public pricing page.
        </p>
      ) : null}
    </Card>
  );
}
