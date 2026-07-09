import { Card } from "@/components/ui/Card";
import type { PaymentRecordView } from "@/types/models";
import {
  formatPaymentAmount,
  formatPaymentDate,
  PAYMENT_METHOD_LABELS,
  paymentStatusStyles,
} from "@/features/admin/components/payments/adminPaymentsUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminPaymentMethodsOverviewProps {
  payments: PaymentRecordView[];
}

const METHOD_ACCENTS: Record<string, string> = {
  bkash: "border-[#E2136E]/25 bg-[#E2136E]/8 text-[#E2136E]",
  nagad: "border-orange-500/25 bg-orange-500/8 text-orange-700",
  wise: "border-emerald-500/25 bg-emerald-500/8 text-emerald-700",
  bank_transfer: "border-primary/25 bg-primary/8 text-primary-dark",
  paypal: "border-blue-500/25 bg-blue-500/8 text-blue-700",
  zelle: "border-violet-500/25 bg-violet-500/8 text-violet-700",
  cash_app: "border-green-500/25 bg-green-500/8 text-green-700",
  other: "border-portal bg-portal-muted/40 text-portal-heading",
};

export function AdminPaymentMethodsOverview({
  payments,
}: IAdminPaymentMethodsOverviewProps) {
  const approved = payments.filter((payment) => payment.status === "approved");
  const totals = new Map<string, Map<string, number>>();

  for (const payment of approved) {
    if (!totals.has(payment.method)) {
      totals.set(payment.method, new Map());
    }
    const currencyMap = totals.get(payment.method)!;
    currencyMap.set(
      payment.currency,
      (currencyMap.get(payment.currency) ?? 0) + payment.amount
    );
  }

  const methods = [...totals.entries()]
    .map(([method, currencyMap]) => {
      const primary = [...currencyMap.entries()][0];
      return {
        method,
        label: PAYMENT_METHOD_LABELS[method] ?? method.replace(/_/g, " "),
        amount: primary ? formatPaymentAmount(primary[1], primary[0]) : "—",
        count: approved.filter((payment) => payment.method === method).length,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (methods.length === 0) {
    return (
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">Payment Methods Overview</h2>
        <p className="mt-2 text-sm text-portal-muted">No approved payments yet.</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">Payment Methods Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((item) => (
          <div
            key={item.method}
            className={cn(
              "rounded-xl border p-3.5",
              METHOD_ACCENTS[item.method] ?? METHOD_ACCENTS.other
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums">{item.amount}</p>
            <p className="mt-1 text-[11px] opacity-80">{item.count} payments</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface IAdminRecentTransactionsProps {
  payments: PaymentRecordView[];
}

export function AdminRecentTransactions({ payments }: IAdminRecentTransactionsProps) {
  const recent = [...payments]
    .sort(
      (a, b) =>
        new Date(b.paymentDate || b.createdAt).getTime() -
        new Date(a.paymentDate || a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">Recent Transactions</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-portal-muted">No transactions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {recent.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-portal/80 bg-portal-muted/30 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-portal-heading">
                  {payment.student?.name ?? "Student"}
                </p>
                <p className="text-xs text-portal-muted">
                  {formatPaymentDate(payment.paymentDate)} ·{" "}
                  {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-portal-heading">
                  {formatPaymentAmount(payment.amount, payment.currency)}
                </p>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                    paymentStatusStyles(payment.status)
                  )}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
