import { Eye, ImageIcon, Mic, Pencil, Trash2, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils/cn";
import { env } from "@/config/env";
import type { AdminGalleryItem, GalleryMediaType } from "@/types/models";
import type { IPaginatedListResult } from "@/lib/hooks/usePaginatedList";
import {
  formatGalleryDate,
  GALLERY_ALBUM_LABELS,
  type GalleryListStyle,
} from "@/features/admin/components/gallery/adminGalleryUtils";

const MEDIA_BADGE: Record<
  GalleryMediaType,
  { label: string; className: string; icon: typeof ImageIcon }
> = {
  photo: {
    label: "Photo",
    className: "bg-sky-100 text-sky-700",
    icon: ImageIcon,
  },
  video: {
    label: "Video",
    className: "bg-violet-100 text-violet-700",
    icon: Video,
  },
  audio: {
    label: "Audio",
    className: "bg-orange-100 text-orange-700",
    icon: Mic,
  },
};

function ItemThumb({ item }: { item: AdminGalleryItem }) {
  if (item.mediaType === "photo" && item.mediaUrl) {
    return (
      <img
        src={item.mediaUrl}
        alt={item.title}
        className="size-full object-cover"
      />
    );
  }
  if (item.mediaType === "video" && item.youtubeId) {
    return (
      <img
        src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
        alt={item.title}
        className="size-full object-cover"
      />
    );
  }
  if (item.mediaType === "video") {
    return (
      <div className="flex size-full items-center justify-center bg-zinc-900 text-white">
        <Video className="size-5 opacity-80" aria-hidden />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center bg-gradient-to-br text-white",
        item.coverGradient
      )}
    >
      <Mic className="size-5 opacity-90" aria-hidden />
    </div>
  );
}

interface IAdminGalleryRecentListProps {
  items: AdminGalleryItem[];
  listStyle: GalleryListStyle;
  pagination: IPaginatedListResult<AdminGalleryItem>;
  onEdit: (item: AdminGalleryItem) => void;
  onDelete: (item: AdminGalleryItem) => void;
}

export function AdminGalleryRecentList({
  items,
  listStyle,
  pagination,
  onEdit,
  onDelete,
}: IAdminGalleryRecentListProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-primary-dark">
          Recent Gallery Items
        </h2>
        <span className="text-xs font-medium text-portal-muted">
          {pagination.totalItems} total
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-portal bg-portal-muted/15 px-4 py-10 text-center">
          <ImageIcon className="mx-auto size-8 text-portal-muted/50" aria-hidden />
          <p className="mt-2 text-sm font-medium text-portal-heading">
            No gallery items yet
          </p>
          <p className="mt-1 text-xs text-portal-muted">
            Upload your first photo, video, or audio above.
          </p>
        </div>
      ) : listStyle === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const badge = MEDIA_BADGE[item.mediaType];
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-portal"
              >
                <div className="relative aspect-[4/3] bg-portal-muted/30">
                  <ItemThumb item={item} />
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-1 text-xs font-semibold text-portal-heading">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-portal-muted">
                    {item.showOnWebsite ? "Public" : "Private"} ·{" "}
                    {formatGalleryDate(item.createdAt)}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : listStyle === "carousel" ? (
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {items.map((item) => {
            const badge = MEDIA_BADGE[item.mediaType];
            return (
              <div
                key={item.id}
                className="w-44 shrink-0 overflow-hidden rounded-xl border border-portal"
              >
                <div className="relative aspect-video bg-portal-muted/30">
                  <ItemThumb item={item} />
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-1 text-xs font-semibold text-portal-heading">
                    {item.title}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="divide-y divide-portal">
          {items.map((item) => {
            const badge = MEDIA_BADGE[item.mediaType];
            const BadgeIcon = badge.icon;
            return (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-portal-muted/30">
                  <ItemThumb item={item} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-portal-muted">
                    {item.showOnWebsite ? "Public" : "Private"} ·{" "}
                    {formatGalleryDate(item.createdAt)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-portal-muted">
                    {GALLERY_ALBUM_LABELS[item.album]}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      badge.className
                    )}
                  >
                    <BadgeIcon className="size-3" aria-hidden />
                    {badge.label}
                  </span>
                  <ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pagination.totalPages > 1 || pagination.totalItems > 0 ? (
        <div className="mt-4 border-t border-portal pt-3">
          <Pagination pagination={pagination} itemLabel="items" />
        </div>
      ) : null}
    </Card>
  );
}

function ActionButtons({
  item,
  onEdit,
  onDelete,
}: {
  item: AdminGalleryItem;
  onEdit: (item: AdminGalleryItem) => void;
  onDelete: (item: AdminGalleryItem) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <a
        href={`${env.publicSiteUrl}/gallery`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-7 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`View ${item.title} on website`}
        title="View on website"
      >
        <Eye className="size-3.5" aria-hidden />
      </a>
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="inline-flex size-7 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`Edit ${item.title}`}
        title="Edit"
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        className="inline-flex size-7 items-center justify-center rounded-lg text-portal-muted transition hover:bg-red-50 hover:text-red-600"
        aria-label={`Delete ${item.title}`}
        title="Delete"
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
