import { CheckCircle2 } from "lucide-react";
import type { PaymentInvoiceView } from "@/types/models";
import {
  formatInvoiceDate,
  formatMoney,
  paymentMethodLabel,
} from "@/lib/paymentFormat";

interface IPaymentInvoiceDocumentProps {
  invoice: PaymentInvoiceView;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium text-text-gray">{label}</dt>
      <dd className="text-sm font-medium text-text-dark">{value}</dd>
    </div>
  );
}

export function PaymentInvoiceDocument({ invoice }: IPaymentInvoiceDocumentProps) {
  const { academy } = invoice;

  return (
    <article
      id="payment-invoice-document"
      className="mx-auto w-full max-w-[720px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg print:max-w-none print:rounded-none print:border-0 print:shadow-none"
    >
      <header className="bg-primary px-6 py-5 text-white print:bg-primary">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-arabic text-lg font-bold leading-tight">{academy.shortName}</p>
            <p className="mt-0.5 text-sm font-semibold opacity-95">{academy.name}</p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed opacity-80">{academy.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Invoice</p>
            <p className="mt-1 font-mono text-sm font-bold">{invoice.invoiceNumber}</p>
            <p className="mt-2 text-xs opacity-80">Issued {formatInvoiceDate(invoice.issuedAt)}</p>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">
              Student
            </h2>
            <dl className="space-y-2">
              <InfoRow label="Name" value={invoice.student.name} />
              <InfoRow label="Email" value={invoice.student.email} />
              {invoice.student.studentId ? (
                <InfoRow label="Student ID" value={invoice.student.studentId} />
              ) : null}
              <InfoRow label="Country" value={invoice.student.country || "—"} />
            </dl>
          </section>
          <section>
            <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">
              Academy
            </h2>
            <dl className="space-y-2">
              <InfoRow label="Address" value={academy.address} />
              <InfoRow label="Phone (BD)" value={academy.contactBD} />
              <InfoRow label="Email" value={academy.email} />
              <InfoRow label="Website" value={academy.website.replace(/^https?:\/\//, "")} />
            </dl>
          </section>
        </div>

        {invoice.courses.length > 0 ? (
          <section className="rounded-xl border border-primary/15 bg-bg-light p-4">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              Classes
            </h2>
            <ul className="space-y-2">
              {invoice.courses.map((course) => (
                <li key={`${course.title}-${course.teacherName}`} className="text-sm">
                  <p className="font-semibold text-text-dark">{course.title}</p>
                  <p className="text-xs text-text-gray">
                    Teacher: {course.teacherName}
                    {course.schedule ? ` · ${course.schedule}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">
            Payment details
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-[10px] font-bold uppercase tracking-wide text-text-gray">
                <tr>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3 text-text-dark">{invoice.description}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-text-dark">
                    {formatMoney(invoice.amount, invoice.currency)}
                  </td>
                </tr>
                {invoice.transactionFee != null && invoice.transactionFee > 0 ? (
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2.5 text-text-gray">Transaction fee</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-text-gray">
                      −{formatMoney(invoice.transactionFee, invoice.currency)}
                    </td>
                  </tr>
                ) : null}
                <tr className="border-t border-gray-200 bg-primary/5">
                  <td className="px-4 py-3 font-bold text-primary-dark">Total paid</td>
                  <td className="px-4 py-3 text-right text-base font-bold tabular-nums text-primary-dark">
                    {formatMoney(
                      invoice.netAmount != null ? invoice.netAmount : invoice.amount,
                      invoice.currency
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <dl className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:grid-cols-2">
          <InfoRow label="Payment date" value={formatInvoiceDate(invoice.paymentDate)} />
          <InfoRow label="Method" value={paymentMethodLabel(invoice.method)} />
          <InfoRow label="Reference / Trx ID" value={invoice.reference} />
          {invoice.paidUntilAfter ? (
            <InfoRow label="Paid until" value={formatInvoiceDate(invoice.paidUntilAfter)} />
          ) : null}
        </dl>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="size-5 shrink-0" />
          Payment verified — approved by academy
        </div>

        {invoice.note ? (
          <p className="text-xs leading-relaxed text-text-gray">
            <span className="font-semibold text-text-dark">Note: </span>
            {invoice.note}
          </p>
        ) : null}
      </div>

      <footer className="border-t border-gray-100 bg-bg-light px-6 py-4 text-center text-xs text-text-gray">
        <p>Thank you for trusting {academy.shortName} with your Quran learning journey.</p>
        <p className="mt-1">JazakAllah Khair — {academy.name}</p>
      </footer>
    </article>
  );
}
