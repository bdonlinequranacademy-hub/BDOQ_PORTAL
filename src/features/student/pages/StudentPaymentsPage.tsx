import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Upload, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import {
  useStudentPaymentStatus,
  useStudentPayments,
  useSubmitStudentPayment,
  useStudentProfile,
} from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { CountrySelect } from "@/components/ui/CountrySelect";
import type { BillingCurrency, PaymentMethod, PaymentStatus } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const CURRENCIES: BillingCurrency[] = ["USD", "GBP", "EUR", "BDT", "CAD", "AUD"];
const METHODS: PaymentMethod[] = [
  "zelle",
  "wise",
  "bank_transfer",
  "paypal",
  "cash_app",
  "other",
];

function statusBadge(status: PaymentStatus) {
  if (status === "approved") return "bg-emerald-100 text-emerald-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

function billingBadge(status: string | undefined) {
  if (status === "current") return "bg-emerald-100 text-emerald-800";
  if (status === "due_soon") return "bg-amber-100 text-amber-900";
  if (status === "overdue") return "bg-red-100 text-red-800";
  return "bg-zinc-100 text-zinc-700";
}

export function StudentPaymentsPage() {
  const { t, paymentMethod, statusLabel, formatDate, formatMoney } = usePortalTranslation();
  const { data: statusData, isLoading: statusLoading } = useStudentPaymentStatus();
  const { data: payments = [], isLoading: historyLoading } = useStudentPayments();
  const { data: profile } = useStudentProfile();
  const submitPayment = useSubmitStudentPayment();

  const billing = statusData?.billing;

  const historyPagination = usePaginatedList(payments);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<BillingCurrency>("USD");
  const [country, setCountry] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [monthsCovered, setMonthsCovered] = useState("1");
  const [method, setMethod] = useState<PaymentMethod>("wise");
  const [reference, setReference] = useState("");
  const [transactionFee, setTransactionFee] = useState("");
  const [note, setNote] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    if (!billing) return;
    setCurrency(billing.currency);
    if (!amount) setAmount(String(billing.monthlyFee));
  }, [billing?.currency, billing?.monthlyFee]);

  if (statusLoading) return <PageLoading label={t("student.loadingPaymentInfo")} />;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!screenshot) return;

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("currency", currency);
    formData.append("country", country || profile?.country || "");
    formData.append("paymentDate", paymentDate);
    formData.append("monthsCovered", monthsCovered);
    formData.append("method", method);
    formData.append("reference", reference);
    if (transactionFee) formData.append("transactionFee", transactionFee);
    if (note) formData.append("note", note);
    formData.append("screenshot", screenshot);

    submitPayment.mutate(formData, {
      onSuccess: () => {
        setReference("");
        setNote("");
        setTransactionFee("");
        setScreenshot(null);
      },
    });
  }

  function billingStatusLabel(status: string) {
    if (status === "current") return t("status.current");
    if (status === "due_soon") return t("status.due_soon");
    return statusLabel(status);
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t("student.tuitionPayments")}</h1>
        <p className="text-sm text-zinc-500">{t("student.paymentsSubtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-0 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t("tables.monthlyFee")}
          </p>
          <p className="mt-2 text-2xl font-bold text-navy">
            {billing ? formatMoney(billing.monthlyFee, billing.currency) : t("student.notSet")}
          </p>
        </Card>
        <Card className="rounded-2xl border-0 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t("tables.paidUntil")}
          </p>
          <p className="mt-2 text-xl font-bold text-navy">
            {billing?.paidUntil ? formatDate(billing.paidUntil) : "—"}
          </p>
          {billing ? (
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${billingBadge(billing.status)}`}
            >
              {billingStatusLabel(billing.status)}
            </span>
          ) : null}
        </Card>
        <Card className="rounded-2xl border-0 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t("student.pendingReview")}
          </p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-navy">
            <Clock className="size-5 text-gold" />
            {statusData?.pendingSubmissions ?? 0}
          </p>
        </Card>
      </div>

      {!billing ? (
        <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          {t("student.noBillingPlan")}
        </Card>
      ) : (
        <Card className="rounded-2xl border-0 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CreditCard className="size-5 text-navy" />
            <h2 className="text-lg font-bold text-navy">{t("student.submitPaymentProof")}</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder={t("student.amountPaid")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as BillingCurrency)}
              label={t("student.currency")}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <CountrySelect value={country || profile?.country || ""} onChange={setCountry} />
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
            <Input
              type="number"
              min="1"
              max="24"
              placeholder={t("student.monthsCovered")}
              value={monthsCovered}
              onChange={(e) => setMonthsCovered(e.target.value)}
              required
            />
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              label={t("filters.paymentMethod")}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {paymentMethod(m)}
                </option>
              ))}
            </Select>
            <Input
              placeholder={t("student.transactionReference")}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder={t("student.transactionFeeOptional")}
              value={transactionFee}
              onChange={(e) => setTransactionFee(e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                placeholder={t("student.noteOptional")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex cursor-pointer flex-col gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                <span className="flex items-center gap-2 text-sm font-medium text-navy">
                  <Upload className="size-4" />
                  {t("student.paymentScreenshotRequired")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                  required
                />
                {screenshot ? (
                  <span className="text-xs text-zinc-500">{screenshot.name}</span>
                ) : null}
              </label>
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={submitPayment.isPending || !screenshot}
                className="h-11 rounded-xl bg-navy text-white"
              >
                {submitPayment.isPending ? t("student.submitting") : t("student.submitForReview")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="text-lg font-bold text-navy">{t("student.paymentHistory")}</h2>
        </div>
        {historyLoading ? (
          <PageLoading label={t("student.loadingHistory")} />
        ) : payments.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500">{t("student.noPaymentsSubmitted")}</p>
        ) : (
          <>
            <div className="divide-y divide-zinc-100">
              {historyPagination.paginatedItems.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-navy">
                      {formatMoney(p.amount, p.currency)} · {p.monthsCovered}{" "}
                      {p.monthsCovered > 1 ? t("student.monthPlural") : t("student.monthSingular")}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(p.paymentDate)} · {paymentMethod(p.method)} · {p.reference}
                    </p>
                    {p.rejectionReason ? (
                      <p className="mt-1 text-xs text-red-600">{p.rejectionReason}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(p.status)}`}
                    >
                      {statusLabel(p.status)}
                    </span>
                    {p.status === "approved" ? (
                      <Link
                        to={`/student/payments/${p.id}/invoice`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <FileText className="size-3.5" />
                        {t("actions.invoice")}
                      </Link>
                    ) : null}
                    <a
                      href={p.screenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-gold hover:underline"
                    >
                      {t("tables.viewProof")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-100 p-3">
              <Pagination pagination={historyPagination} itemLabel="payments" />
            </div>
          </>
        )}
      </Card>

      <p className="flex items-start gap-2 text-xs text-zinc-500">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        {t("student.paymentsVerifiedManually")}
      </p>
      <p className="flex items-start gap-2 text-xs text-emerald-700">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        {t("student.includeTransferFee")}
      </p>
    </PageContainer>
  );
}
