import {
  AlertCircle,
  Banknote,
  CalendarDays,
  Clock,
  RotateCcw,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { OverdueBillingView, PaymentRecordView } from "@/types/models";
import {
  paymentsThisMonth,
  sumOverdueByCurrency,
  sumPaymentsByCurrency,
} from "@/features/admin/components/payments/adminPaymentsUtils";

interface IAdminPaymentsStatsGridProps {
  allPayments: PaymentRecordView[];
  overdue: OverdueBillingView[];
  isLoading?: boolean;
}

export function AdminPaymentsStatsGrid({
  allPayments,
  overdue,
  isLoading,
}: IAdminPaymentsStatsGridProps) {
  const { t } = usePortalTranslation();
  const monthPayments = paymentsThisMonth(allPayments);
  const pendingCount = allPayments.filter((payment) => payment.status === "pending").length;
  const rejectedCount = allPayments.filter((payment) => payment.status === "rejected").length;

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.payments.totalCollected")}
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(allPayments, (payment) => payment.status === "approved")
        }
        icon={<Banknote className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.payments.approvedHint", {
          count: String(allPayments.filter((p) => p.status === "approved").length),
        })}
      />
      <StatCard
        label={t("admin.payments.pendingPayments")}
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(allPayments, (payment) => payment.status === "pending")
        }
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={
          pendingCount > 0
            ? t("admin.payments.toReviewHint", { count: String(pendingCount) })
            : t("admin.payments.allReviewed")
        }
      />
      <StatCard
        label={t("admin.payments.overduePayments")}
        value={isLoading ? "—" : sumOverdueByCurrency(overdue)}
        icon={<AlertCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={t("admin.payments.studentsHint", { count: String(overdue.length) })}
      />
      <StatCard
        label={t("admin.payments.rejected")}
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(allPayments, (payment) => payment.status === "rejected")
        }
        icon={<RotateCcw className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={
          rejectedCount > 0
            ? t("admin.payments.rejectedHint", { count: String(rejectedCount) })
            : t("admin.payments.noRejections")
        }
      />
      <StatCard
        label={t("admin.payments.thisMonth")}
        value={isLoading ? "—" : sumPaymentsByCurrency(monthPayments, () => true)}
        icon={<CalendarDays className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint={t("admin.payments.collectedHint", { count: String(monthPayments.length) })}
      />
    </div>
  );
}
