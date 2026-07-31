import type { ClassLogStatus } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const statusStyles: Record<ClassLogStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const statusKeys: Record<ClassLogStatus, string> = {
  pending: "pending_approval",
  approved: "approved",
  rejected: "rejected",
};

export function ClassLogStatusBadge({ status }: { status: ClassLogStatus }) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {statusLabel(statusKeys[status])}
    </span>
  );
}
