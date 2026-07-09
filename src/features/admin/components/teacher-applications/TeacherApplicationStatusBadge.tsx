import type { TeacherApplicationStatus } from "@/types/models";
import {
  teacherApplicationStatusLabel,
  teacherApplicationStatusStyles,
} from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { cn } from "@/lib/utils/cn";

export function TeacherApplicationStatusBadge({
  status,
}: {
  status: TeacherApplicationStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        teacherApplicationStatusStyles(status)
      )}
    >
      {teacherApplicationStatusLabel(status)}
    </span>
  );
}
