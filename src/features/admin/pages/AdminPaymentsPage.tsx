import { useState } from "react";
import {
  Banknote,
  Calendar,
  Check,
  CreditCard,
  ExternalLink,
  Hash,
  MapPin,
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

type Tab = "pending" | "all" | "overdue" | "billing";

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

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:border-gold/25 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <UserInitialAvatar name={studentName} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-navy">{studentName}</p>
                <p className="truncate text-xs text-zinc-500">{payment.student?.email}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles(payment.status)}`}
              >
                {payment.status}
              </span>
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-navy">
              {formatAmount(payment.amount, payment.currency)}
            </p>
            <p className="text-xs text-zinc-500">
              {payment.monthsCovered} month{payment.monthsCovered > 1 ? "s" : ""} covered
              {payment.netAmount != null
                ? ` · Net ${formatAmount(payment.netAmount, payment.currency)}`
                : ""}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <CreditCard className="size-3.5 shrink-0 text-zinc-400" />
                <span>{methodLabel}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <Hash className="size-3.5 shrink-0 text-zinc-400" />
                <span className="truncate">{payment.reference}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <Calendar className="size-3.5 shrink-0 text-zinc-400" />
                <span>Paid {new Date(payment.paymentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
                <MapPin className="size-3.5 shrink-0 text-zinc-400" />
                <span>{payment.country}</span>
              </div>
            </div>

            {payment.note ? (
              <p className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-xs leading-relaxed text-zinc-600">
                <span className="font-semibold text-navy">Note:</span> {payment.note}
              </p>
            ) : null}

            {payment.rejectionReason ? (
              <p className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                <span className="font-semibold">Rejected:</span> {payment.rejectionReason}
              </p>
            ) : null}

            <a
              href={payment.screenshotUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-semibold text-gold-dark transition hover:bg-gold/10"
            >
              View payment proof
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        {payment.status === "pending" ? (
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:min-w-[140px]">
            <Button
              variant="success"
              disabled={busy}
              onClick={() => onApprove(payment.id)}
              className="h-10 w-full gap-1.5 rounded-xl px-4"
            >
              <Check className="size-4" />
              Approve
            </Button>
            <Button
              variant="outline-danger"
              disabled={busy}
              onClick={() => onReject(payment.id)}
              className="h-10 w-full gap-1.5 rounded-xl px-4"
            >
              <X className="size-4" />
              Reject
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function AdminPaymentsPage() {
  const [tab, setTab] = useState<Tab>("pending");
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

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "pending", label: "Pending", count: pending.length },
    { id: "all", label: "All payments" },
    { id: "overdue", label: "Overdue", count: overdue.length },
    { id: "billing", label: "Set billing" },
  ];

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Payments</h1>
        <p className="text-sm text-zinc-500">
          Review manual payment proofs and manage student billing plans.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
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
          <div className="grid gap-4">
            {pending.map((p) => (
              <PaymentReviewCard
                key={p.id}
                payment={p}
                busy={busy}
                onApprove={(id) => approvePayment.mutate(id)}
                onReject={(id) => setRejectId(id)}
              />
            ))}
          </div>
        )
      ) : null}

      {tab === "all" ? (
        allLoading ? (
          <PageLoading label="Loading payments…" />
        ) : all.length === 0 ? (
          <EmptyState title="No payments yet" description="Approved and rejected payments appear here." />
        ) : (
          <div className="grid gap-4">
            {all.map((p) => (
              <PaymentReviewCard
                key={p.id}
                payment={p}
                busy={busy}
                onApprove={(id) => approvePayment.mutate(id)}
                onReject={(id) => setRejectId(id)}
              />
            ))}
          </div>
        )
      ) : null}

      {tab === "overdue" ? (
        overdueLoading ? (
          <PageLoading label="Loading overdue students…" />
        ) : overdue.length === 0 ? (
          <EmptyState title="No overdue students" description="All active billings are current." />
        ) : (
          <div className="grid gap-3">
            {overdue.map((row) => (
              <article
                key={row.student.id}
                className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <UserInitialAvatar name={row.student.name} size="sm" />
                  <div>
                    <p className="font-semibold text-navy">{row.student.name}</p>
                    <p className="text-xs text-zinc-500">{row.student.email}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-800">
                  {formatAmount(row.monthlyFee, row.currency)}/mo · Paid until{" "}
                  {row.paidUntil ? new Date(row.paidUntil).toLocaleDateString() : "not set"}
                </div>
              </article>
            ))}
          </div>
        )
      ) : null}

      {tab === "billing" ? (
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
      ) : null}

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
