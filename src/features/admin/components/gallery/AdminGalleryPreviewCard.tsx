import { ImageIcon, Mic, Video } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import type { GalleryMediaType } from "@/types/models";
import {
  extractYoutubeId,
  type IGalleryFormState,
} from "@/features/admin/components/gallery/adminGalleryUtils";

interface IAdminGalleryPreviewCardProps {
  form: IGalleryFormState;
}

function MediaBadge({ type }: { type: GalleryMediaType }) {
  const meta = {
    photo: { label: "Photo", className: "bg-primary text-white" },
    video: { label: "Video", className: "bg-violet-600 text-white" },
    audio: { label: "Audio", className: "bg-orange-500 text-white" },
  }[type];

  return (
    <span
      className={cn(
        "absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}

export function AdminGalleryPreviewCard({ form }: IAdminGalleryPreviewCardProps) {
  const youtubeId = extractYoutubeId(form.youtubeId);
  const title = form.title.trim() || "Gallery item title";

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
      <h2 className="text-sm font-bold text-primary-dark">Preview</h2>
      <p className="mt-1 text-xs text-portal-muted">
        How this item will look in the gallery.
      </p>

      <div className="relative mt-4 overflow-hidden rounded-xl bg-primary/10">
        <MediaBadge type={form.mediaType} />

        {form.mediaType === "photo" && form.mediaUrl ? (
          <img
            src={form.mediaUrl}
            alt={title}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : form.mediaType === "video" &&
          form.videoSource === "youtube" &&
          youtubeId.length === 11 ? (
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            className="aspect-video w-full object-cover"
          />
        ) : form.mediaType === "audio" ? (
          <div
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br text-white",
              form.coverGradient
            )}
          >
            <Mic className="size-10 opacity-90" aria-hidden />
            <span className="mt-2 text-xs font-medium opacity-90">Audio</span>
          </div>
        ) : form.mediaUrl && form.mediaType === "video" ? (
          <div className="flex aspect-video items-center justify-center bg-zinc-900 text-white">
            <Video className="size-10 opacity-80" aria-hidden />
          </div>
        ) : (
          <div
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br text-white/90",
              form.coverGradient
            )}
          >
            <ImageIcon className="size-12 opacity-80" aria-hidden />
            <span className="mt-2 text-xs font-medium capitalize opacity-80">
              {form.mediaType} placeholder
            </span>
          </div>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm font-semibold text-portal-heading">
        {title}
      </p>
      {form.description.trim() ? (
        <p className="mt-1 line-clamp-2 text-xs text-portal-muted">
          {form.description.trim()}
        </p>
      ) : null}
    </Card>
  );
}
