import { useState } from "react";
import { Banknote, Check, ExternalLink, X } from "lucide-react";
import type { BillingCurrency, PaymentRecordView } from "@/types/models";
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

type Tab = "pending" | "all" | "overdue" | "billing";

const CURRENCIES: BillingCurrency[] = ["USD", "GBP", "EUR", "BDT", "CAD", "AUD"];

function PaymentRow({
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
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 last:border-0 md:flex-row md:items-start md:justify-between">
      <div className="flex-1">
        <p className="font-semibold text-navy">
          {payment.student?.name ?? "Student"} · {payment.currency} {payment.amount.toFixed(2)}
        </p>
        <p className="text-xs text-zinc-500">{payment.student?.email}</p>
        <p className="mt-2 text-sm text-zinc-600">
          {payment.monthsCovered} month{payment.monthsCovered > 1 ? "s" : ""} ·{" "}
          {payment.method.replace("_", " ")} · Ref: {payment.reference}
        </p>
        <p className="text-xs text-zinc-500">
          Paid on {new Date(payment.paymentDate).toLocaleDateString()} · {payment.country}
          {payment.transactionFee != null
            ? ` · Fee ${payment.currency} ${payment.transactionFee.toFixed(2)}`
            : ""}
        </p>
        {payment.note ? <p className="mt-1 text-xs text-zinc-500">Note: {payment.note}</p> : null}
        <a
          href={payment.screenshotUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
        >
          View screenshot <ExternalLink className="size-3" />
        </a>
      </div>
      {payment.status === "pending" ? (
        <div className="flex gap-2">
          <Button
            disabled={busy}
            onClick={() => onApprove(payment.id)}
            className="gap-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Check className="size-4" /> Approve
          </Button>
          <Button
            disabled={busy}
            onClick={() => onReject(payment.id)}
            className="gap-1 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
          >
            <X className="size-4" /> Reject
          </Button>
        </div>
      ) : (
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold capitalize text-zinc-700">
          {payment.status}
        </span>
      )}
    </div>
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
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              tab === t.id
                ? "bg-navy text-white"
                : "border border-zinc-200 bg-white text-navy"
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
          <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
            {pending.map((p) => (
              <PaymentRow
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
        ) : (
          <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
            {all.map((p) => (
              <PaymentRow
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
          <Card className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
            {overdue.map((row) => (
              <div key={row.student.id} className="flex flex-col gap-1 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-navy">{row.student.name}</p>
                  <p className="text-xs text-zinc-500">{row.student.email}</p>
                </div>
                <div className="text-sm text-zinc-600">
                  {row.currency} {row.monthlyFee}/mo · Paid until{" "}
                  {row.paidUntil
                    ? new Date(row.paidUntil).toLocaleDateString()
                    : "not set"}
                </div>
              </div>
            ))}
          </Card>
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
            className="h-11 rounded-xl bg-navy text-white"
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
            <Input
              placeholder="Reason (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 rounded-xl bg-red-600 text-white"
                disabled={rejectPayment.isPending}
                onClick={() => {
                  rejectPayment.mutate(
                    { id: rejectId, reason: rejectReason || undefined },
                    { onSuccess: () => { setRejectId(null); setRejectReason(""); } }
                  );
                }}
              >
                Reject
              </Button>
              <Button
                className="flex-1 rounded-xl"
                onClick={() => { setRejectId(null); setRejectReason(""); }}
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
