import { useState } from "react";
import { Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { StudentAdmissionPaymentStatus, StudentAdmissionView } from "@/types/models";
import { AdmissionPaymentStatusBadge } from "@/features/admin/components/student-admissions/AdmissionPaymentStatusBadge";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdmissionPaymentReviewPanelProps {
  application: StudentAdmissionView;
  busy: boolean;
  onUpdatePaymentStatus: (
    status: StudentAdmissionPaymentStatus,
    rejectReason?: string
  ) => void;
}

const fieldClass = cn(formControlClass, "shadow-none");

export function AdmissionPaymentReviewPanel({
  application,
  busy,
  onUpdatePaymentStatus,
}: IAdmissionPaymentReviewPanelProps) {
  const { t, formatDateTime } = usePortalTranslation();
  const [rejectReason, setRejectReason] = useState(application.paymentRejectReason ?? "");
  const paymentStatus = application.paymentStatus ?? "pending";

  return (
    <section className="rounded-2xl border border-portal bg-portal-muted/20 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-portal-heading">
            {t("admin.admissions.paymentReviewTitle")}
          </h3>
          <p className="mt-1 text-xs text-portal-muted">
            {t("admin.admissions.paymentReviewHint")}
          </p>
        </div>
        <AdmissionPaymentStatusBadge status={paymentStatus} />
      </div>

      {paymentStatus === "verified" && application.paymentVerifiedAt ? (
        <p className="text-xs text-emerald-800">
          {t("admin.admissions.paymentVerifiedAt", {
            date: formatDateTime(application.paymentVerifiedAt),
          })}
        </p>
      ) : null}

      {paymentStatus === "rejected" && application.paymentRejectReason ? (
        <p className="text-xs text-red-800">
          {t("admin.admissions.paymentRejectReasonLabel")}: {application.paymentRejectReason}
        </p>
      ) : null}

      {paymentStatus !== "verified" ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Button
            type="button"
            disabled={busy}
            onClick={() => onUpdatePaymentStatus("verified")}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-white"
          >
            <Check className="size-4" aria-hidden />
            {t("admin.admissions.paymentVerifyAction")}
          </Button>
        </div>
      ) : null}

      {paymentStatus !== "rejected" ? (
        <div className="mt-4 space-y-2 border-t border-portal pt-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
              {t("admin.admissions.paymentRejectReasonLabel")}
            </span>
            <Input
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              className={fieldClass}
              placeholder={t("admin.admissions.paymentRejectPlaceholder")}
            />
          </label>
          <Button
            type="button"
            variant="ghost"
            disabled={busy || !rejectReason.trim()}
            onClick={() => onUpdatePaymentStatus("rejected", rejectReason.trim())}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-red-700"
          >
            <XCircle className="size-4" aria-hidden />
            {t("admin.admissions.paymentRejectAction")}
          </Button>
        </div>
      ) : null}

      {paymentStatus === "rejected" ? (
        <div className="mt-4 border-t border-portal pt-4">
          <Button
            type="button"
            disabled={busy}
            onClick={() => onUpdatePaymentStatus("pending")}
            className="h-10 rounded-xl border border-portal px-4 text-sm"
          >
            {t("admin.admissions.paymentResetPending")}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
