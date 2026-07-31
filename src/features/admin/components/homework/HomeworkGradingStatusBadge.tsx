import type { HomeworkGradingStatus } from "@/features/admin/components/homework/adminHomeworkUtils";
import { homeworkGradingStatusStyles } from "@/features/admin/components/homework/adminHomeworkUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IHomeworkGradingStatusBadgeProps {
  status: HomeworkGradingStatus;
  className?: string;
}

export function HomeworkGradingStatusBadge({
  status,
  className,
}: IHomeworkGradingStatusBadgeProps) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        homeworkGradingStatusStyles(status),
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
