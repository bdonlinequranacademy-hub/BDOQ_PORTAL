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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const MEDIA_BADGE_CLASS: Record<GalleryMediaType, string> = {
  photo: "bg-sky-100 text-sky-700",
  video: "bg-violet-100 text-violet-700",
  audio: "bg-orange-100 text-orange-700",
};

const MEDIA_BADGE_ICON: Record<
  GalleryMediaType,
  typeof ImageIcon
> = {
  photo: ImageIcon,
  video: Video,
  audio: Mic,
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
  const { t, dynamicLabel, formatNumber } = usePortalTranslation();

  function mediaLabel(type: GalleryMediaType): string {
    return dynamicLabel(type);
  }

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-primary-dark">
          {t("admin.cms.gallery.recentTitle")}
        </h2>
        <span className="text-xs font-medium text-portal-muted">
          {t("admin.cms.gallery.totalCount", {
            count: formatNumber(pagination.totalItems),
          })}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-portal bg-portal-muted/15 px-4 py-10 text-center">
          <ImageIcon className="mx-auto size-8 text-portal-muted/50" aria-hidden />
          <p className="mt-2 text-sm font-medium text-portal-heading">
            {t("admin.cms.gallery.emptyTitle")}
          </p>
          <p className="mt-1 text-xs text-portal-muted">
            {t("admin.cms.gallery.emptyDesc")}
          </p>
        </div>
      ) : listStyle === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-portal"
            >
              <div className="relative aspect-[4/3] bg-portal-muted/30">
                <ItemThumb item={item} />
                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    MEDIA_BADGE_CLASS[item.mediaType]
                  )}
                >
                  {mediaLabel(item.mediaType)}
                </span>
              </div>
              <div className="p-2.5">
                <p className="line-clamp-1 text-xs font-semibold text-portal-heading">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[10px] text-portal-muted">
                  {item.showOnWebsite
                    ? t("admin.cms.shared.visibilityPublic")
                    : t("admin.cms.shared.visibilityPrivate")}{" "}
                  · {formatGalleryDate(item.createdAt)}
                </p>
                <div className="mt-2 flex gap-1">
                  <ActionButtons
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    t={t}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : listStyle === "carousel" ? (
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-44 shrink-0 overflow-hidden rounded-xl border border-portal"
            >
              <div className="relative aspect-video bg-portal-muted/30">
                <ItemThumb item={item} />
                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    MEDIA_BADGE_CLASS[item.mediaType]
                  )}
                >
                  {mediaLabel(item.mediaType)}
                </span>
              </div>
              <div className="p-2.5">
                <p className="line-clamp-1 text-xs font-semibold text-portal-heading">
                  {item.title}
                </p>
                <div className="mt-2 flex gap-1">
                  <ActionButtons
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    t={t}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-portal">
          {items.map((item) => {
            const BadgeIcon = MEDIA_BADGE_ICON[item.mediaType];
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
                    {item.showOnWebsite
                      ? t("admin.cms.shared.visibilityPublic")
                      : t("admin.cms.shared.visibilityPrivate")}{" "}
                    · {formatGalleryDate(item.createdAt)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-portal-muted">
                    {GALLERY_ALBUM_LABELS[item.album]}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      MEDIA_BADGE_CLASS[item.mediaType]
                    )}
                  >
                    <BadgeIcon className="size-3" aria-hidden />
                    {mediaLabel(item.mediaType)}
                  </span>
                  <ActionButtons
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    t={t}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pagination.totalPages > 1 || pagination.totalItems > 0 ? (
        <div className="mt-4 border-t border-portal pt-3">
          <Pagination pagination={pagination} itemLabel={t("shared.pagination.items")} />
        </div>
      ) : null}
    </Card>
  );
}

function ActionButtons({
  item,
  onEdit,
  onDelete,
  t,
}: {
  item: AdminGalleryItem;
  onEdit: (item: AdminGalleryItem) => void;
  onDelete: (item: AdminGalleryItem) => void;
  t: (key: string, params?: Record<string, string>) => string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <a
        href={`${env.publicSiteUrl}/gallery`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-7 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={t("admin.cms.gallery.viewItemOnWebsite", { title: item.title })}
        title={t("admin.cms.shared.viewWebsite")}
      >
        <Eye className="size-3.5" aria-hidden />
      </a>
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="inline-flex size-7 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/40 hover:text-primary"
        aria-label={`${t("admin.common.edit")} ${item.title}`}
        title={t("admin.common.edit")}
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        className="inline-flex size-7 items-center justify-center rounded-lg text-portal-muted transition hover:bg-red-50 hover:text-red-600"
        aria-label={`${t("admin.common.delete")} ${item.title}`}
        title={t("admin.common.delete")}
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
