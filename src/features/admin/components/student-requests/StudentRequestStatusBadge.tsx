import type { StudentRequestStatus } from "@/types/models";
import { studentRequestStatusStyles } from "@/features/admin/components/student-requests/adminStudentRequestsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const statusKeys: Record<StudentRequestStatus, string> = {
  pending: "pending_review",
  approved: "approved",
  rejected: "rejected",
};

export function StudentRequestStatusBadge({ status }: { status: StudentRequestStatus }) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        studentRequestStatusStyles(status)
      )}
    >
      {statusLabel(statusKeys[status])}
    </span>
  );
}
