import { Mic, Star, Video } from "lucide-react";
import type { TestimonialMediaType } from "@/types/models";
import { mediaTypeLabel } from "@/features/admin/components/testimonials/adminTestimonialsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface ITestimonialMediaBadgeProps {
  type: TestimonialMediaType;
  className?: string;
}

function MediaIcon({ type }: { type: TestimonialMediaType }) {
  if (type === "audio") return <Mic className="size-3" aria-hidden />;
  if (type === "video") return <Video className="size-3" aria-hidden />;
  return <Star className="size-3" aria-hidden />;
}

export function testimonialMediaStyles(type: TestimonialMediaType): string {
  switch (type) {
    case "audio":
      return "border-violet-500/35 bg-violet-500/10 text-violet-800";
    case "video":
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
    default:
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
  }
}

export function TestimonialMediaBadge({ type, className }: ITestimonialMediaBadgeProps) {
  const { t } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        testimonialMediaStyles(type),
        className
      )}
    >
      <MediaIcon type={type} />
      {mediaTypeLabel(type, t)}
    </span>
  );
}
