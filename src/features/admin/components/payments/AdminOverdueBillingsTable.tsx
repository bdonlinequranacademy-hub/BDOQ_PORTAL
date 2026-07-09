import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { Card } from "@/components/ui/Card";
import type { OverdueBillingView } from "@/types/models";
import { formatPaymentAmount, formatPaymentDate } from "@/features/admin/components/payments/adminPaymentsUtils";

interface IAdminOverdueBillingsTableProps {
  rows: OverdueBillingView[];
}

export function AdminOverdueBillingsTable({ rows }: IAdminOverdueBillingsTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Monthly fee</th>
              <th className="px-5 py-3.5">Paid until</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal/80">
            {rows.map((row) => (
              <tr key={row.student.id} className="transition hover:bg-portal-muted/25">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserInitialAvatar name={row.student.name} size="sm" />
                    <div>
                      <p className="font-semibold text-portal-heading">{row.student.name}</p>
                      <p className="text-xs text-portal-muted">{row.student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-bold tabular-nums text-red-700">
                  {formatPaymentAmount(row.monthlyFee, row.currency)}/mo
                </td>
                <td className="px-5 py-4 text-sm text-portal-muted">
                  {row.paidUntil ? formatPaymentDate(row.paidUntil) : "Not set"}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-red-800">
                    {row.status.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-portal/80 lg:hidden">
        {rows.map((row) => (
          <article
            key={row.student.id}
            className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <UserInitialAvatar name={row.student.name} size="sm" />
              <div>
                <p className="font-semibold text-portal-heading">{row.student.name}</p>
                <p className="text-xs text-portal-muted">{row.student.email}</p>
              </div>
            </div>
            <p className="text-sm font-medium tabular-nums text-red-700">
              {formatPaymentAmount(row.monthlyFee, row.currency)}/mo · Due{" "}
              {row.paidUntil ? formatPaymentDate(row.paidUntil) : "not set"}
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}
