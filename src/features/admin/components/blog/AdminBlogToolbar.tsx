import { Search, SlidersHorizontal } from "lucide-react";
import type { BlogCategory, BlogPostStatus } from "@/types/models";
import {
  BLOG_CATEGORIES,
  type AdminBlogTab,
  type BlogSort,
} from "@/features/admin/components/blog/adminBlogUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminBlogToolbarProps {
  tab: AdminBlogTab;
  tabCounts: Record<AdminBlogTab, number>;
  search: string;
  categoryFilter: BlogCategory | "";
  authorFilter: string;
  statusFilter: BlogPostStatus | "";
  dateFrom: string;
  dateTo: string;
  sortBy: BlogSort;
  authors: string[];
  showAdvancedFilters: boolean;
  onTabChange: (tab: AdminBlogTab) => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: BlogCategory | "") => void;
  onAuthorChange: (value: string) => void;
  onStatusChange: (value: BlogPostStatus | "") => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortChange: (value: BlogSort) => void;
  onToggleAdvancedFilters: () => void;
}

const TABS: { id: AdminBlogTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "featured", label: "Featured" },
];

const fieldClass = cn(formControlClass, "h-10 min-h-10 py-2 text-sm shadow-none");

export function AdminBlogToolbar({
  tab,
  tabCounts,
  search,
  categoryFilter,
  authorFilter,
  statusFilter,
  dateFrom,
  dateTo,
  sortBy,
  authors,
  showAdvancedFilters,
  onTabChange,
  onSearchChange,
  onCategoryChange,
  onAuthorChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onToggleAdvancedFilters,
}: IAdminBlogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Blog posts</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Manage, edit and organize all blog posts.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-portal pb-3">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              tab === item.id
                ? "border-b-2 border-primary text-primary"
                : "text-portal-muted hover:text-portal-heading"
            )}
          >
            {item.label} ({tabCounts[item.id]})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="relative block w-full lg:min-w-[220px] lg:flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search posts…"
            className={cn(fieldClass, "w-full pl-9")}
          />
        </label>

        <select
          className={cn(fieldClass, "w-full lg:w-44")}
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value as BlogCategory | "")}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {BLOG_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className={cn(fieldClass, "w-full lg:w-40")}
          value={authorFilter}
          onChange={(event) => onAuthorChange(event.target.value)}
          aria-label="Filter by author"
        >
          <option value="">All authors</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>

        <select
          className={cn(fieldClass, "w-full lg:w-36")}
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value as BlogPostStatus | "")}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button
          type="button"
          onClick={onToggleAdvancedFilters}
          className={cn(
            fieldClass,
            "inline-flex w-full items-center justify-center gap-2 lg:w-auto",
            showAdvancedFilters && "border-primary/40 bg-primary/5 text-primary"
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
        </button>
      </div>

      {showAdvancedFilters ? (
        <div className="flex flex-col gap-3 border-t border-portal pt-3 sm:flex-row sm:items-center">
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className={cn(fieldClass, "w-full sm:w-auto")}
            aria-label="Publish from"
          />
          <span className="hidden text-xs text-portal-muted sm:block">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={cn(fieldClass, "w-full sm:w-auto")}
            aria-label="Publish to"
          />
          <select
            className={cn(fieldClass, "w-full sm:w-44")}
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as BlogSort)}
            aria-label="Sort posts"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}
