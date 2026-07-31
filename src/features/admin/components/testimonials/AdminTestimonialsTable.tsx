import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Card } from "@/components/ui/Card";
import { TestimonialMediaBadge } from "@/features/admin/components/testimonials/TestimonialMediaBadge";
import { isPublished } from "@/features/admin/components/testimonials/adminTestimonialsUtils";
import { cn } from "@/lib/utils/cn";
import type { AdminTestimonial } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsTableProps {
  items: AdminTestimonial[];
  totalCount: number;
  onView: (item: AdminTestimonial) => void;
  onEdit: (item: AdminTestimonial) => void;
  onDelete: (item: AdminTestimonial) => void;
}

function formatTestimonialDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < Math.round(rating) ? "fill-gold text-gold" : "text-portal-muted/40"
          )}
          aria-hidden
        />
      ))}
      <span className="ml-1 text-xs font-semibold tabular-nums text-portal-heading">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export function AdminTestimonialsTable({
  items,
  totalCount,
  onView,
  onEdit,
  onDelete,
}: IAdminTestimonialsTableProps) {
  const { t } = usePortalTranslation();

  if (items.length === 0) {
    return (
      <Card className="rounded-2xl border border-portal p-8 text-center shadow-sm">
        <p className="font-semibold text-portal-heading">No reviews match filters</p>
        <p className="mt-1 text-sm text-portal-muted">
          Try clearing search or status filters.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal px-5 py-3">
        <p className="text-xs font-medium text-portal-muted">
          Showing {items.length} of {totalCount} review{totalCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("shared.schedule.student")}</th>
              <th className="px-5 py-3.5">Review</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Role / Course</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">{t("tables.status")}</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal/80">
            {items.map((item) => {
              const published = isPublished(item);
              return (
                <tr key={item.id} className="transition hover:bg-portal-muted/20">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={item.name}
                        avatarUrl={item.image}
                        size="sm"
                        shape="circle"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-portal-heading">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-portal-muted">
                          {item.location || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[280px] px-5 py-4">
                    <p className="line-clamp-2 text-sm text-portal-muted">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <TestimonialMediaBadge type={item.mediaType ?? "text"} />
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-heading">{item.role}</td>
                  <td className="px-5 py-4">
                    <Stars rating={item.rating || 0} />
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        published
                          ? "bg-primary/15 text-primary-dark"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {published ? "Published" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-muted">
                    {formatTestimonialDate(item.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
                        aria-label={`View ${item.name}`}
                        title="View / edit"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
                        aria-label={`Edit ${item.name}`}
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-lg p-2 text-portal-muted transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${item.name}`}
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-portal/80 lg:hidden">
        {items.map((item) => {
          const published = isPublished(item);
          return (
            <div key={item.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <UserAvatar
                  name={item.name}
                  avatarUrl={item.image}
                  size="sm"
                  shape="circle"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-portal-heading">{item.name}</p>
                    <TestimonialMediaBadge type={item.mediaType ?? "text"} />
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        published
                          ? "bg-primary/15 text-primary-dark"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {published ? "Published" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-portal-muted">
                    {item.role} · {item.location}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-portal-muted">
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Stars rating={item.rating || 0} />
                    <span className="text-xs text-portal-muted">
                      {formatTestimonialDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-lg p-2 text-primary hover:bg-portal-muted/50"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
