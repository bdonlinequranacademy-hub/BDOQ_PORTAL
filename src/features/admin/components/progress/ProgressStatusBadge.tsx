import type { ProgressStatus } from "@/features/admin/components/progress/adminProgressUtils";
import { progressStatusStyles } from "@/features/admin/components/progress/adminProgressUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IProgressStatusBadgeProps {
  status: ProgressStatus;
  className?: string;
}

export function ProgressStatusBadge({ status, className }: IProgressStatusBadgeProps) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        progressStatusStyles(status),
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
