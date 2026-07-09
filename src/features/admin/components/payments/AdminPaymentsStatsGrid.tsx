import {
  AlertCircle,
  Banknote,
  CalendarDays,
  Clock,
  RotateCcw,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
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
  const monthPayments = paymentsThisMonth(allPayments);
  const pendingCount = allPayments.filter((payment) => payment.status === "pending").length;
  const rejectedCount = allPayments.filter((payment) => payment.status === "rejected").length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
      <StatCard
        label="Total Collected"
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(allPayments, (payment) => payment.status === "approved")
        }
        icon={<Banknote className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={`${allPayments.filter((p) => p.status === "approved").length} approved`}
      />
      <StatCard
        label="Pending Payments"
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(allPayments, (payment) => payment.status === "pending")
        }
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pendingCount > 0 ? `${pendingCount} to review` : "All reviewed"}
      />
      <StatCard
        label="Overdue Payments"
        value={isLoading ? "—" : sumOverdueByCurrency(overdue)}
        icon={<AlertCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={`${overdue.length} student${overdue.length === 1 ? "" : "s"}`}
      />
      <StatCard
        label="Rejected"
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(allPayments, (payment) => payment.status === "rejected")
        }
        icon={<RotateCcw className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={rejectedCount > 0 ? `${rejectedCount} rejected` : "No rejections"}
      />
      <StatCard
        label="This Month"
        value={
          isLoading
            ? "—"
            : sumPaymentsByCurrency(monthPayments, () => true)
        }
        icon={<CalendarDays className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint={`${monthPayments.length} collected`}
      />
    </div>
  );
}
