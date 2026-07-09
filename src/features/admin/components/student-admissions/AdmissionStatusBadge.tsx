import type { StudentAdmissionStatus } from "@/types/models";
import {
  admissionStatusLabel,
  admissionStatusStyles,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { cn } from "@/lib/utils/cn";

export function AdmissionStatusBadge({ status }: { status: StudentAdmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        admissionStatusStyles(status)
      )}
    >
      {admissionStatusLabel(status)}
    </span>
  );
}
