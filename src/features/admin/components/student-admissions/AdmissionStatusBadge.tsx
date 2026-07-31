import type { StudentAdmissionStatus } from "@/types/models";
import { admissionStatusStyles } from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdmissionStatusBadge({ status }: { status: StudentAdmissionStatus }) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        admissionStatusStyles(status)
      )}
    >
      {statusLabel(status === "reviewing" ? "under_review" : status)}
    </span>
  );
}
