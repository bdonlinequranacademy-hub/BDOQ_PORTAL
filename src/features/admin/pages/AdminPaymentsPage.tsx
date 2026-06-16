import { useState } from "react";
import {
  Banknote,
  Check,
  ExternalLink,
  X,
} from "lucide-react";
import type { BillingCurrency, PaymentRecordView, PaymentStatus } from "@/types/models";
import {
  useAdminPayments,
  useAdminOverdueBillings,
  useAdminUsers,
  useApprovePayment,
  useRejectPayment,
  useUpsertStudentBilling,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";

type PaymentTab = "pending" | "all" | "overdue";

const CURRENCIES: BillingCurrency[] = ["USD", "GBP", "EUR", "BDT", "CAD", "AUD"];

const METHOD_LABELS: Record<string, string> = {
  zelle: "Zelle",
  wise: "Wise",
  bank_transfer: "Bank transfer",
  paypal: "PayPal",
  cash_app: "Cash App",
  bkash: "bKash",
  nagad: "Nagad",
  other: "Other",
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function statusStyles(status: PaymentStatus) {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "rejected") {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-900";
}

function PaymentReviewCard({
  payment,
  onApprove,
  onReject,
  busy,
}: {
  payment: PaymentRecordView;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  busy: boolean;
}) {
  const studentName = payment.student?.name ?? "Student";
  const methodLabel = METHOD_LABELS[payment.method] ?? payment.method.replace(/_/g, " ");
  const paidOn = new Date(payment.paymentDate).toLocaleDateString();
  const isPending = payment.status === "pending";

  return (
    <article className="border-b border-zinc-100 last:border-b-0">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-start gap-3">
          <UserInitialAvatar name={studentName} size="sm" />
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy">{studentName}</p>
              <p className="truncate text-xs text-zinc-500">{payment.student?.email}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums text-navy sm:text-xl">
                  {formatAmount(payment.amount, payment.currency)}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {payment.monthsCovered} mo
                  {payment.netAmount != null
                    ? ` · net ${formatAmount(payment.netAmount, payment.currency)}`
                    : ""}
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles(payment.status)}`}
              >
                {payment.status}
              </span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Method</dt>
            <dd className="mt-0.5 font-medium text-zinc-700">{methodLabel}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Reference</dt>
            <dd className="mt-0.5 truncate font-medium text-zinc-700" title={payment.reference}>
              {payment.reference}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Paid on</dt>
            <dd className="mt-0.5 font-medium text-zinc-700">{paidOn}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Country</dt>
            <dd className="mt-0.5 font-medium text-zinc-700">{payment.country}</dd>
          </div>
        </dl>

        {payment.note ? (
          <p className="w-full rounded-lg bg-zinc-50 px-3 py-2 text-xs leading-relaxed text-zinc-600">
            <span className="font-semibold text-navy">Note · </span>
            {payment.note}
          </p>
        ) : null}

        {payment.rejectionReason ? (
          <p className="w-full rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
            <span className="font-semibold">Rejected · </span>
            {payment.rejectionReason}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={payment.screenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-gold-dark hover:underline"
          >
            View payment proof
            <ExternalLink className="size-3.5" />
          </a>

          {isPending ? (
            <div className="flex gap-2 sm:justify-end">
              <Button
                variant="success"
                disabled={busy}
                onClick={() => onApprove(payment.id)}
                className="h-9 flex-1 gap-1.5 rounded-lg px-4 sm:flex-none"
              >
                <Check className="size-4" />
                Approve
              </Button>
              <Button
                variant="outline-danger"
                disabled={busy}
                onClick={() => onReject(payment.id)}
                className="h-9 flex-1 gap-1.5 rounded-lg px-4 sm:flex-none"
              >
                <X className="size-4" />
                Reject
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function AdminPaymentsPage() {
  const [tab, setTab] = useState<PaymentTab>("pending");
  const [showBilling, setShowBilling] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: pending = [], isLoading: pendingLoading } = useAdminPayments("pending");
  const { data: all = [], isLoading: allLoading } = useAdminPayments();
  const { data: overdue = [], isLoading: overdueLoading } = useAdminOverdueBillings();
  const { data: students = [] } = useAdminUsers("student");

  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();
  const upsertBilling = useUpsertStudentBilling();

  const [billingStudentId, setBillingStudentId] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [billingCurrency, setBillingCurrency] = useState<BillingCurrency>("USD");
  const [dueDay, setDueDay] = useState("1");
  const [paidUntil, setPaidUntil] = useState("");

  const busy = approvePayment.isPending || rejectPayment.isPending;

  const paymentTabs: { id: PaymentTab; label: string; count?: number }[] = [
    { id: "pending", label: "Pending", count: pending.length },
    { id: "all", label: "All payments" },
    { id: "overdue", label: "Overdue", count: overdue.length },
  ];

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Payments</h1>
          <p className="text-sm text-zinc-500">
            Review manual payment proofs and manage student billing plans.
          </p>
        </div>
        {!showBilling ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowBilling(true)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border-gold/30 bg-gold/10 px-4 text-navy hover:bg-gold/15"
          >
            <Banknote className="size-4 text-gold-dark" />
            Set billing
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowBilling(false)}
            className="h-10 shrink-0 rounded-xl border border-zinc-200 px-4 text-navy"
          >
            Back to payments
          </Button>
        )}
      </div>

      {showBilling ? (
        <Card className="flex max-w-lg flex-col gap-4 rounded-2xl border-0 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Banknote className="size-5 text-navy" />
            <h2 className="font-display text-lg font-bold text-navy">Student billing plan</h2>
          </div>
          <Select
            value={billingStudentId}
            onChange={(e) => setBillingStudentId(e.target.value)}
            label="Student"
          >
            <option value="">Select student…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </Select>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Monthly fee"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(e.target.value)}
          />
          <Select
            value={billingCurrency}
            onChange={(e) => setBillingCurrency(e.target.value as BillingCurrency)}
            label="Currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            min="1"
            max="28"
            placeholder="Due day of month (1–28)"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
          />
          <Input
            type="date"
            value={paidUntil}
            onChange={(e) => setPaidUntil(e.target.value)}
          />
          <Button
            disabled={!billingStudentId || !monthlyFee || upsertBilling.isPending}
            className="h-11 rounded-xl"
            onClick={() => {
              if (!billingStudentId || !monthlyFee) return;
              upsertBilling.mutate({
                studentId: billingStudentId,
                monthlyFee: Number(monthlyFee),
                currency: billingCurrency,
                dueDayOfMonth: Number(dueDay) || 1,
                ...(paidUntil ? { paidUntil } : {}),
              });
            }}
          >
            {upsertBilling.isPending ? "Saving…" : "Save billing plan"}
          </Button>
        </Card>
      ) : (
        <>
      <div className="flex flex-wrap gap-2">
        {paymentTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? "bg-navy text-white shadow-sm"
                : "border border-zinc-200 bg-white text-navy hover:border-gold/40 hover:bg-gold/5"
            }`}
          >
            {t.label}
            {t.count != null ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        pendingLoading ? (
          <PageLoading label="Loading pending payments…" />
        ) : pending.length === 0 ? (
          <EmptyState title="No pending payments" description="New submissions will appear here." />
        ) : (
          <Card className="overflow-hidden rounded-2xl border border-zinc-100 bg-white p-0 shadow-sm">
            {pending.map((p) => (
              <PaymentReviewCard
                key={p.id}
                payment={p}
                busy={busy}
                onApprove={(id) => approvePayment.mutate(id)}
                onReject={(id) => setRejectId(id)}
              />
            ))}
          </Card>
        )
      ) : null}

      {tab === "all" ? (
        allLoading ? (
          <PageLoading label="Loading payments…" />
        ) : all.length === 0 ? (
          <EmptyState title="No payments yet" description="Approved and rejected payments appear here." />
        ) : (
          <Card className="overflow-hidden rounded-2xl border border-zinc-100 bg-white p-0 shadow-sm">
            {all.map((p) => (
              <PaymentReviewCard
                key={p.id}
                payment={p}
                busy={busy}
                onApprove={(id) => approvePayment.mutate(id)}
                onReject={(id) => setRejectId(id)}
              />
            ))}
          </Card>
        )
      ) : null}

      {tab === "overdue" ? (
        overdueLoading ? (
          <PageLoading label="Loading overdue students…" />
        ) : overdue.length === 0 ? (
          <EmptyState title="No overdue students" description="All active billings are current." />
        ) : (
          <Card className="overflow-hidden rounded-2xl border border-zinc-100 bg-white p-0 shadow-sm">
            {overdue.map((row) => (
              <article
                key={row.student.id}
                className="flex flex-col gap-2 border-b border-zinc-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <UserInitialAvatar name={row.student.name} size="sm" />
                  <div>
                    <p className="font-semibold text-navy">{row.student.name}</p>
                    <p className="text-xs text-zinc-500">{row.student.email}</p>
                  </div>
                </div>
                <p className="text-sm font-medium tabular-nums text-red-700">
                  {formatAmount(row.monthlyFee, row.currency)}/mo · Due{" "}
                  {row.paidUntil ? new Date(row.paidUntil).toLocaleDateString() : "not set"}
                </p>
              </article>
            ))}
          </Card>
        )
      ) : null}
        </>
      )}

      {rejectId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="flex w-full max-w-md flex-col gap-4 rounded-2xl p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold text-navy">Reject payment</h3>
            <p className="text-sm text-zinc-500">
              The student will see this reason in their payment history.
            </p>
            <Input
              placeholder="Reason (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant="danger"
                className="flex-1 rounded-xl"
                disabled={rejectPayment.isPending}
                onClick={() => {
                  rejectPayment.mutate(
                    { id: rejectId, reason: rejectReason || undefined },
                    {
                      onSuccess: () => {
                        setRejectId(null);
                        setRejectReason("");
                      },
                    }
                  );
                }}
              >
                Reject payment
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-xl border border-zinc-200"
                onClick={() => {
                  setRejectId(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </PageContainer>
  );
}
