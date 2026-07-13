import {
  BookOpen,
  Eye,
  Headphones,
  Pencil,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { env } from "@/config/env";
import { cn } from "@/lib/utils/cn";
import type { AdminResource } from "@/types/models";
import {
  EBOOK_CATEGORY_LABELS,
  formatResourceDate,
  publicResourcePath,
  RESOURCE_TYPE_LABELS,
  resourceMetaLine,
} from "@/features/admin/components/resources/adminResourcesUtils";

interface IAdminResourcesTableProps {
  items: AdminResource[];
  totalCount: number;
  onEdit: (item: AdminResource) => void;
  onDelete: (item: AdminResource) => void;
}

const TYPE_STYLE = {
  ebook: {
    badge: "bg-emerald-50 text-emerald-700",
    iconWrap: "bg-emerald-100 text-emerald-700",
    Icon: BookOpen,
  },
  audio: {
    badge: "bg-violet-50 text-violet-700",
    iconWrap: "bg-violet-100 text-violet-700",
    Icon: Headphones,
  },
  video: {
    badge: "bg-orange-50 text-orange-700",
    iconWrap: "bg-orange-100 text-orange-700",
    Icon: Video,
  },
} as const;

export function AdminResourcesTable({
  items,
  totalCount,
  onEdit,
  onDelete,
}: IAdminResourcesTableProps) {
  if (items.length === 0) {
    return (
      <Card className="rounded-2xl border border-portal p-8 text-center shadow-sm">
        <p className="font-semibold text-portal-heading">No resources match filters</p>
        <p className="mt-1 text-sm text-portal-muted">
          Try clearing search or changing tabs.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal px-5 py-3">
        <p className="text-xs font-medium text-portal-muted">
          Showing {items.length} of {totalCount} resource
          {totalCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Resource</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Author / Date</th>
              <th className="px-5 py-3.5">Section</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal/80">
            {items.map((item) => (
              <ResourceRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-portal xl:hidden">
        {items.map((item) => {
          const typeMeta = TYPE_STYLE[item.type];
          const Icon = typeMeta.Icon;
          return (
            <li key={item.id} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <Thumb item={item} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-portal-heading">{item.title}</p>
                    {item.featured ? (
                      <Star className="size-3.5 fill-gold text-gold" aria-hidden />
                    ) : null}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-portal-muted">
                    {item.description || resourceMetaLine(item)}
                  </p>
                </div>
                <StatusChip status={item.status} />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary-dark">
                  {item.type === "ebook" && item.category
                    ? EBOOK_CATEGORY_LABELS[item.category]
                    : item.section}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
                    typeMeta.badge
                  )}
                >
                  <Icon className="size-3" aria-hidden />
                  {RESOURCE_TYPE_LABELS[item.type]}
                </span>
              </div>
              <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function ResourceRow({
  item,
  onEdit,
  onDelete,
}: {
  item: AdminResource;
  onEdit: (item: AdminResource) => void;
  onDelete: (item: AdminResource) => void;
}) {
  const typeMeta = TYPE_STYLE[item.type];

  return (
    <tr className="align-top transition hover:bg-portal-muted/20">
      <td className="px-5 py-4">
        <div className="flex items-start gap-3">
          <Thumb item={item} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-portal-heading">{item.title}</p>
              {item.featured ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-gold-dark">
                  <Star className="size-3 fill-gold text-gold" aria-hidden />
                  Featured
                </span>
              ) : null}
            </div>
            {item.description ? (
              <p className="mt-0.5 line-clamp-1 text-xs text-portal-muted">
                {item.description}
              </p>
            ) : null}
            <p className="mt-1 text-[11px] text-portal-muted">
              {resourceMetaLine(item)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-dark">
          {item.type === "ebook" && item.category
            ? EBOOK_CATEGORY_LABELS[item.category]
            : item.section}
        </span>
      </td>
      <td className="px-5 py-4">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
            typeMeta.badge
          )}
        >
          {RESOURCE_TYPE_LABELS[item.type]}
        </span>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-portal-heading">
          {item.author || "BOQ Academy"}
        </p>
        <p className="text-xs text-portal-muted">
          {formatResourceDate(item.publishedAt || item.createdAt)}
        </p>
      </td>
      <td className="px-5 py-4 text-sm capitalize text-portal-heading">
        {item.section}
      </td>
      <td className="px-5 py-4">
        <StatusChip status={item.status} />
      </td>
      <td className="px-5 py-4">
        <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

function Thumb({ item }: { item: AdminResource }) {
  const typeMeta = TYPE_STYLE[item.type];
  const Icon = typeMeta.Icon;

  if (item.coverUrl) {
    return (
      <img
        src={item.coverUrl}
        alt=""
        className="size-12 shrink-0 rounded-xl object-cover"
      />
    );
  }

  if (item.type === "video" && item.youtubeId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
        alt=""
        className="size-12 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-xl",
        item.coverGradient
          ? `bg-gradient-to-br ${item.coverGradient} text-white`
          : typeMeta.iconWrap
      )}
    >
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

function StatusChip({ status }: { status: AdminResource["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "published"
          ? "bg-primary/15 text-primary-dark"
          : "bg-amber-50 text-amber-700"
      )}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

function RowActions({
  item,
  onEdit,
  onDelete,
}: {
  item: AdminResource;
  onEdit: (item: AdminResource) => void;
  onDelete: (item: AdminResource) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <a
        href={`${env.publicSiteUrl}${publicResourcePath(item.type)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`View ${item.title} on website`}
        title="View on website"
      >
        <Eye className="size-4" aria-hidden />
      </a>
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`Edit ${item.title}`}
      >
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-red-50 hover:text-red-600"
        aria-label={`Delete ${item.title}`}
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}
