import {
  BookOpen,
  Filter,
  Headphones,
  Search,
  Star,
  FileEdit,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type { EbookCategory, ResourceStatus, ResourceType } from "@/types/models";
import {
  EBOOK_CATEGORY_LABELS,
  type ResourcesSort,
  type ResourcesTab,
} from "@/features/admin/components/resources/adminResourcesUtils";

interface IAdminResourcesToolbarProps {
  tab: ResourcesTab;
  tabCounts: Record<ResourcesTab, number>;
  search: string;
  type: ResourceType | "";
  status: ResourceStatus | "";
  category: EbookCategory | "";
  sortBy: ResourcesSort;
  showAdvancedFilters: boolean;
  onTabChange: (tab: ResourcesTab) => void;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: ResourceType | "") => void;
  onStatusChange: (value: ResourceStatus | "") => void;
  onCategoryChange: (value: EbookCategory | "") => void;
  onSortChange: (value: ResourcesSort) => void;
  onToggleAdvancedFilters: () => void;
}

const TABS: {
  id: ResourcesTab;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { id: "all", label: "All Resources", icon: BookOpen },
  { id: "ebook", label: "E-books", icon: BookOpen },
  { id: "audio", label: "Audio", icon: Headphones },
  { id: "video", label: "Videos", icon: Video },
  { id: "featured", label: "Featured", icon: Star },
  { id: "published", label: "Published", icon: BookOpen },
  { id: "draft", label: "Drafts", icon: FileEdit },
];

export function AdminResourcesToolbar({
  tab,
  tabCounts,
  search,
  type,
  status,
  category,
  sortBy,
  showAdvancedFilters,
  onTabChange,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onToggleAdvancedFilters,
}: IAdminResourcesToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "bg-portal-surface text-portal-muted ring-1 ring-portal hover:bg-portal-muted/30"
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold",
                  active ? "bg-white/20" : "bg-portal-muted/40"
                )}
              >
                {tabCounts[id]}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted" />
            <input
              className={cn(formControlClass, "py-2.5 pl-10")}
              placeholder="Search resources by title or keyword…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className={cn(formControlClass, "w-auto min-w-[130px] py-2.5")}
              value={category}
              onChange={(e) =>
                onCategoryChange(e.target.value as EbookCategory | "")
              }
              aria-label="Filter by ebook category"
            >
              <option value="">All Categories</option>
              {(Object.keys(EBOOK_CATEGORY_LABELS) as EbookCategory[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {EBOOK_CATEGORY_LABELS[key]}
                  </option>
                )
              )}
            </select>

            <select
              className={cn(formControlClass, "w-auto min-w-[110px] py-2.5")}
              value={type}
              onChange={(e) => onTypeChange(e.target.value as ResourceType | "")}
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              <option value="ebook">E-book</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>

            <select
              className={cn(formControlClass, "w-auto min-w-[110px] py-2.5")}
              value={status}
              onChange={(e) =>
                onStatusChange(e.target.value as ResourceStatus | "")
              }
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <button
              type="button"
              onClick={onToggleAdvancedFilters}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                showAdvancedFilters
                  ? "border-primary/40 bg-primary/10 text-primary-dark"
                  : "border-portal text-portal-muted hover:border-primary/30"
              )}
            >
              <Filter className="size-4" aria-hidden />
              Filters
            </button>

            <select
              className={cn(formControlClass, "w-auto min-w-[140px] py-2.5")}
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as ResourcesSort)}
              aria-label="Sort resources"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A–Z</option>
              <option value="sort-order">Sort order</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {showAdvancedFilters ? (
          <p className="mt-3 rounded-xl bg-portal-muted/20 px-3 py-2 text-xs text-portal-muted">
            Tip: Ebook category filter applies to e-books only. Use tabs for quick
            type or status views; Featured shows hero/playlist items.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
