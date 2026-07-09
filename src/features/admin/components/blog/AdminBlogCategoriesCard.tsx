import { BookOpen, Cpu, Lightbulb, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { BlogCategory } from "@/types/models";
import type { IBlogCategoryRow } from "@/features/admin/components/blog/adminBlogUtils";

interface IAdminBlogCategoriesCardProps {
  categories: IBlogCategoryRow[];
  activeCategory: BlogCategory | "";
  onCategorySelect: (category: BlogCategory | "") => void;
}

function CategoryIcon({ iconKey }: { iconKey: IBlogCategoryRow["iconKey"] }) {
  switch (iconKey) {
    case "parents":
      return <Users className="size-4 text-blue-600" aria-hidden />;
    case "tips":
      return <Lightbulb className="size-4 text-amber-600" aria-hidden />;
    case "platform":
      return <Cpu className="size-4 text-violet-600" aria-hidden />;
    default:
      return <BookOpen className="size-4 text-primary" aria-hidden />;
  }
}

export function AdminBlogCategoriesCard({
  categories,
  activeCategory,
  onCategorySelect,
}: IAdminBlogCategoriesCardProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">Content categories</h2>
        <button
          type="button"
          onClick={() => onCategorySelect("")}
          className="text-xs font-semibold text-primary hover:underline"
        >
          View all
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {categories.map((row) => (
          <button
            key={row.category}
            type="button"
            onClick={() =>
              onCategorySelect(activeCategory === row.category ? "" : row.category)
            }
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
              activeCategory === row.category
                ? "border-primary/30 bg-primary/5"
                : "border-portal bg-portal-muted/15 hover:border-primary/20"
            }`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-portal-surface">
                <CategoryIcon iconKey={row.iconKey} />
              </span>
              <span className="truncate text-sm font-medium text-portal-heading">
                {row.category}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-portal-muted">
              {row.count}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-portal-muted">
        Categories are fixed for the public education blog. Use Platform &amp; AI for internal portal
        guides.
      </p>
    </Card>
  );
}
