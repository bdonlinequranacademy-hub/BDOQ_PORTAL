import type { BlogPostStatus } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface IBlogStatusBadgeProps {
  status: BlogPostStatus;
  upcoming?: boolean;
  className?: string;
}

export function BlogStatusBadge({ status, upcoming, className }: IBlogStatusBadgeProps) {
  const label =
    upcoming && status === "published"
      ? "Scheduled"
      : status === "published"
        ? "Published"
        : "Draft";

  const dotClass =
    upcoming && status === "published"
      ? "bg-amber-500"
      : status === "published"
        ? "bg-emerald-500"
        : "bg-zinc-400";

  const badgeClass =
    upcoming && status === "published"
      ? "border-amber-500/35 bg-amber-500/10 text-amber-800"
      : status === "published"
        ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-800"
        : "border-zinc-400/35 bg-zinc-100 text-zinc-600";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        badgeClass,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClass)} aria-hidden />
      {label}
    </span>
  );
}
