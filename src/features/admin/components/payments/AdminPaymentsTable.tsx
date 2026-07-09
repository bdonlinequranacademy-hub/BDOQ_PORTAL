import { Check, ExternalLink, Eye, FileText, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { cn } from "@/lib/utils/cn";
import type { PaymentRecordView } from "@/types/models";
import {
  formatPaymentAmount,
  formatPaymentDate,
  PAYMENT_METHOD_LABELS,
  paymentStatusStyles,
} from "@/features/admin/components/payments/adminPaymentsUtils";

interface IAdminPaymentsTableProps {
  payments: PaymentRecordView[];
  busy: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function PaymentRowActions({
  payment,
  busy,
  onApprove,
  onReject,
}: {
  payment: PaymentRecordView;
  busy: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const isPending = payment.status === "pending";

  return (
    <div className="flex items-center justify-end gap-1">
      <a
        href={payment.screenshotUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
        aria-label="View payment proof"
        title="View payment proof"
      >
        <Eye className="size-4" />
      </a>
      {payment.status === "approved" ? (
        <Link
          to={`/admin/payments/${payment.id}/invoice`}
          className="rounded-lg p-2 text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
          aria-label="View invoice"
          title="Invoice"
        >
          <FileText className="size-4" />
        </Link>
      ) : null}
      {isPending ? (
        <>
          <Button
            variant="success"
            disabled={busy}
            onClick={() => onApprove(payment.id)}
            className="h-8 gap-1 rounded-lg px-2.5 text-xs"
          >
            <Check className="size-3.5" />
            Approve
          </Button>
          <Button
            variant="outline-danger"
            disabled={busy}
            onClick={() => onReject(payment.id)}
            className="h-8 gap-1 rounded-lg px-2.5 text-xs"
          >
            <X className="size-3.5" />
            Reject
          </Button>
        </>
      ) : null}
    </div>
  );
}

export function AdminPaymentsTable({
  payments,
  busy,
  onApprove,
  onReject,
}: IAdminPaymentsTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Reference</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Method</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal/80">
            {payments.map((payment) => {
              const studentName = payment.student?.name ?? "Student";
              const methodLabel =
                PAYMENT_METHOD_LABELS[payment.method] ??
                payment.method.replace(/_/g, " ");

              return (
                <tr key={payment.id} className="transition hover:bg-portal-muted/25">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={studentName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-portal-heading">
                          {studentName}
                        </p>
                        <p className="truncate text-xs text-portal-muted">
                          {payment.student?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="max-w-[140px] truncate text-sm font-medium text-portal-heading">
                      {payment.reference}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold tabular-nums text-portal-heading">
                      {formatPaymentAmount(payment.amount, payment.currency)}
                    </p>
                    <p className="text-[11px] text-portal-muted">
                      {payment.monthsCovered} mo
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-muted">{methodLabel}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                        paymentStatusStyles(payment.status)
                      )}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-portal-muted">
                    {formatPaymentDate(payment.paymentDate)}
                  </td>
                  <td className="px-5 py-4">
                    <PaymentRowActions
                      payment={payment}
                      busy={busy}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-portal/80 lg:hidden">
        {payments.map((payment) => {
          const studentName = payment.student?.name ?? "Student";
          const methodLabel =
            PAYMENT_METHOD_LABELS[payment.method] ?? payment.method.replace(/_/g, " ");

          return (
            <article key={payment.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <UserInitialAvatar name={studentName} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-portal-heading">{studentName}</p>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                        paymentStatusStyles(payment.status)
                      )}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-xs text-portal-muted">{payment.student?.email}</p>
                </div>
                <p className="text-right text-lg font-bold tabular-nums text-portal-heading">
                  {formatPaymentAmount(payment.amount, payment.currency)}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-portal-muted">Reference</dt>
                  <dd className="font-medium text-portal-heading">{payment.reference}</dd>
                </div>
                <div>
                  <dt className="text-portal-muted">Method</dt>
                  <dd className="font-medium text-portal-heading">{methodLabel}</dd>
                </div>
                <div>
                  <dt className="text-portal-muted">Paid on</dt>
                  <dd className="font-medium text-portal-heading">
                    {formatPaymentDate(payment.paymentDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-portal-muted">Country</dt>
                  <dd className="font-medium text-portal-heading">{payment.country}</dd>
                </div>
              </dl>

              {payment.note ? (
                <p className="rounded-lg bg-portal-muted/40 px-3 py-2 text-xs text-portal-muted">
                  {payment.note}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-portal/80 pt-3">
                <a
                  href={payment.screenshotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  View proof
                  <ExternalLink className="size-3.5" />
                </a>
                <PaymentRowActions
                  payment={payment}
                  busy={busy}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

export function exportPaymentsFile(
  payments: PaymentRecordView[],
  format: "csv" | "excel"
): void {
  const headers = ["Student", "Email", "Reference", "Amount", "Currency", "Method", "Status", "Date"];
  const rows = payments.map((payment) => [
    payment.student?.name ?? "Student",
    payment.student?.email ?? "",
    payment.reference,
    payment.amount.toFixed(2),
    payment.currency,
    PAYMENT_METHOD_LABELS[payment.method] ?? payment.method,
    payment.status,
    formatPaymentDate(payment.paymentDate),
  ]);

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const delimiter = format === "excel" ? "\t" : ",";
  const content = [headers, ...rows]
    .map((row) => row.map((cell) => escape(cell)).join(delimiter))
    .join("\n");

  const mime =
    format === "excel"
      ? "application/vnd.ms-excel;charset=utf-8;"
      : "text/csv;charset=utf-8;";
  const extension = format === "excel" ? "xls" : "csv";

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bdoq-payments-${new Date().toISOString().slice(0, 10)}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}
