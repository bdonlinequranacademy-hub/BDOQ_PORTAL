import type { HomeworkGradingStatus } from "@/features/admin/components/homework/adminHomeworkUtils";
import {
  homeworkGradingStatusLabel,
  homeworkGradingStatusStyles,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { cn } from "@/lib/utils/cn";

interface IHomeworkGradingStatusBadgeProps {
  status: HomeworkGradingStatus;
  className?: string;
}

export function HomeworkGradingStatusBadge({
  status,
  className,
}: IHomeworkGradingStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        homeworkGradingStatusStyles(status),
        className
      )}
    >
      {homeworkGradingStatusLabel(status)}
    </span>
  );
}
