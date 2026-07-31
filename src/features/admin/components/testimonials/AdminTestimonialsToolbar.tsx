import { Search, SlidersHorizontal, Star } from "lucide-react";
import type { TestimonialMediaType } from "@/types/models";
import {
  type AdminTestimonialsTab,
  type TestimonialsSort,
} from "@/features/admin/components/testimonials/adminTestimonialsUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsToolbarProps {
  tab: AdminTestimonialsTab;
  tabCounts: Record<AdminTestimonialsTab, number>;
  search: string;
  mediaType: TestimonialMediaType | "";
  ratingFilter: number | "";
  statusFilter: "published" | "pending" | "";
  dateFrom: string;
  dateTo: string;
  sortBy: TestimonialsSort;
  showAdvancedFilters: boolean;
  onTabChange: (tab: AdminTestimonialsTab) => void;
  onSearchChange: (value: string) => void;
  onMediaTypeChange: (value: TestimonialMediaType | "") => void;
  onRatingFilterChange: (value: number | "") => void;
  onStatusFilterChange: (value: "published" | "pending" | "") => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortChange: (value: TestimonialsSort) => void;
  onToggleAdvancedFilters: () => void;
}

const TABS: { id: AdminTestimonialsTab; label: string }[] = [
  { id: "all", label: "All Reviews" },
  { id: "published", label: "Published" },
  { id: "pending", label: "Pending" },
  { id: "featured", label: "Featured" },
];

const fieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminTestimonialsToolbar({
  tab,
  tabCounts,
  search,
  mediaType,
  ratingFilter,
  statusFilter,
  dateFrom,
  dateTo,
  sortBy,
  showAdvancedFilters,
  onTabChange,
  onSearchChange,
  onMediaTypeChange,
  onRatingFilterChange,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onToggleAdvancedFilters,
}: IAdminTestimonialsToolbarProps) {
  const { t } = usePortalTranslation();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Reviews list</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Filter, edit and publish student testimonials.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-portal pb-3">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "rounded-[8px] px-3.5 py-1.5 text-sm font-semibold transition",
              tab === item.id
                ? "bg-primary text-white shadow-sm"
                : "text-portal-muted hover:bg-portal-muted/40 hover:text-portal-heading"
            )}
          >
            {item.label} ({tabCounts[item.id]})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted" />
          <input
            className={cn(fieldClass, "pl-10")}
            placeholder="Search by student, location, or review…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className={cn(fieldClass, "w-[140px]")}
            value={mediaType}
            onChange={(e) =>
              onMediaTypeChange(e.target.value as TestimonialMediaType | "")
            }
            aria-label="Review type"
          >
            <option value="">{t("admin.cms.shared.allTypes")}</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
          <select
            className={cn(fieldClass, "w-[130px]")}
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as "published" | "pending" | "")
            }
            aria-label="Status"
          >
            <option value="">All statuses</option>
            <option value="published">{t("admin.common.statPublished")}</option>
            <option value="pending">Pending</option>
          </select>
          <select
            className={cn(fieldClass, "w-[120px]")}
            value={ratingFilter === "" ? "" : String(ratingFilter)}
            onChange={(e) =>
              onRatingFilterChange(e.target.value ? Number(e.target.value) : "")
            }
            aria-label="Rating"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}★
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onToggleAdvancedFilters}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition",
              showAdvancedFilters
                ? "border-primary/30 bg-primary/10 text-primary-dark"
                : "border-portal text-portal-muted hover:border-primary/20"
            )}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
          </button>
        </div>
      </div>

      {showAdvancedFilters ? (
        <div className="grid grid-cols-1 gap-3 border-t border-portal pt-3 sm:grid-cols-3">
          <label className="text-xs font-medium text-portal-muted">
            From
            <input
              type="date"
              className={cn(fieldClass, "mt-1")}
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-portal-muted">
            To
            <input
              type="date"
              className={cn(fieldClass, "mt-1")}
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </label>
          <label className="text-xs font-medium text-portal-muted">
            Sort by
            <select
              className={cn(fieldClass, "mt-1")}
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as TestimonialsSort)}
            >
              <option value="newest">{t("admin.studentRequests.toolbarSortNewest")}</option>
              <option value="oldest">{t("admin.studentRequests.toolbarSortOldest")}</option>
              <option value="rating">Highest rating</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      ) : null}

      <p className="inline-flex items-center gap-1.5 text-[11px] text-portal-muted">
        <Star className="size-3.5 text-gold" aria-hidden />
        Pending = hidden from website · Featured = 5★ published reviews
      </p>
    </div>
  );
}
