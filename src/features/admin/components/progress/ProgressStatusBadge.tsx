import type { ProgressStatus } from "@/features/admin/components/progress/adminProgressUtils";
import {
  progressStatusLabel,
  progressStatusStyles,
} from "@/features/admin/components/progress/adminProgressUtils";
import { cn } from "@/lib/utils/cn";

interface IProgressStatusBadgeProps {
  status: ProgressStatus;
  className?: string;
}

export function ProgressStatusBadge({ status, className }: IProgressStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        progressStatusStyles(status),
        className
      )}
    >
      {progressStatusLabel(status)}
    </span>
  );
}
