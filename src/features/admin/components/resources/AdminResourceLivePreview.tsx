import { BookOpen, Headphones, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import type {
  EbookCategory,
  EbookLanguage,
  ResourceType,
} from "@/types/models";
import {
  EBOOK_CATEGORY_LABELS,
  RESOURCE_TYPE_LABELS,
} from "@/features/admin/components/resources/adminResourcesUtils";

interface IAdminResourceLivePreviewProps {
  type: ResourceType;
  title: string;
  description: string;
  category?: EbookCategory;
  coverUrl?: string;
  coverGradient?: string;
  pageCount?: string;
  fileSize?: string;
  language?: EbookLanguage;
  duration?: string;
  youtubeId?: string;
  featured: boolean;
  published: boolean;
}

export function AdminResourceLivePreview({
  type,
  title,
  description,
  category,
  coverUrl,
  coverGradient,
  pageCount,
  fileSize,
  language,
  duration,
  youtubeId,
  featured,
  published,
}: IAdminResourceLivePreviewProps) {
  const Icon =
    type === "ebook" ? BookOpen : type === "audio" ? Headphones : Video;

  const metaBits =
    type === "ebook"
      ? [
          pageCount ? `${pageCount} Pages` : null,
          fileSize || null,
          language === "bn"
            ? "Bangla"
            : language === "both"
              ? "EN + BN"
              : "English",
        ].filter(Boolean)
      : type === "audio"
        ? [duration || "Audio"].filter(Boolean)
        : [youtubeId ? "YouTube" : "Video"].filter(Boolean);

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-4 py-3">
        <h2 className="text-sm font-bold text-primary-dark">Live Preview</h2>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
            published
              ? "bg-primary/15 text-primary-dark"
              : "bg-amber-50 text-amber-700"
          )}
        >
          {published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="p-4">
        <div className="relative overflow-hidden rounded-xl bg-portal-muted/20">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          ) : type === "video" && youtubeId ? (
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt=""
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "flex aspect-[4/3] items-center justify-center",
                coverGradient
                  ? `bg-gradient-to-br ${coverGradient} text-white`
                  : "bg-primary/15 text-primary-dark"
              )}
            >
              <Icon className="size-12 opacity-90" aria-hidden />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {RESOURCE_TYPE_LABELS[type]}
          </span>
          {featured ? (
            <span className="absolute right-3 top-3 rounded-md bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Featured
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-bold text-portal-heading">
          {title.trim() || "Resource title"}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-portal-muted">
          {description.trim() || "Short description will appear here…"}
        </p>

        {type === "ebook" && category ? (
          <span className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary-dark">
            {EBOOK_CATEGORY_LABELS[category]}
          </span>
        ) : null}

        <p className="mt-3 text-xs font-medium text-portal-muted">
          {metaBits.join(" · ") || "—"}
        </p>

        <button
          type="button"
          tabIndex={-1}
          className="mt-4 w-full cursor-default rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
        >
          View Resource
        </button>
      </div>
    </Card>
  );
}
