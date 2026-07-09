import type { StudentRequestStatus } from "@/types/models";
import {
  studentRequestStatusLabel,
  studentRequestStatusStyles,
} from "@/features/admin/components/student-requests/adminStudentRequestsUtils";
import { cn } from "@/lib/utils/cn";

export function StudentRequestStatusBadge({ status }: { status: StudentRequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        studentRequestStatusStyles(status)
      )}
    >
      {studentRequestStatusLabel(status)}
    </span>
  );
}
