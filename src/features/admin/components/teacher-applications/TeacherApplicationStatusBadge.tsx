import type { TeacherApplicationStatus } from "@/types/models";
import { teacherApplicationStatusStyles } from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function TeacherApplicationStatusBadge({
  status,
}: {
  status: TeacherApplicationStatus;
}) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        teacherApplicationStatusStyles(status)
      )}
    >
      {statusLabel(status === "reviewing" ? "under_review" : status)}
    </span>
  );
}
