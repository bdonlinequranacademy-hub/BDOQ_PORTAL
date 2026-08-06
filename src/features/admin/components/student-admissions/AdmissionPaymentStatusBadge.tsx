import type { StudentAdmissionPaymentStatus } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface IAdmissionPaymentStatusBadgeProps {
  status?: StudentAdmissionPaymentStatus;
}

export function admissionPaymentStatusStyles(
  status: StudentAdmissionPaymentStatus | undefined
): string {
  switch (status) {
    case "verified":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    case "rejected":
      return "border-red-500/35 bg-red-500/10 text-red-800";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

export function AdmissionPaymentStatusBadge({
  status = "pending",
}: IAdmissionPaymentStatusBadgeProps) {
  const { t } = usePortalTranslation();

  const label =
    status === "verified"
      ? t("admin.admissions.paymentVerified")
      : status === "rejected"
        ? t("admin.admissions.paymentRejected")
        : t("admin.admissions.paymentPending");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        admissionPaymentStatusStyles(status)
      )}
    >
      {label}
    </span>
  );
}
