import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Gift, Upload } from "lucide-react";
import type {
  OptionalPaymentCategory,
  OptionalPaymentCurrency,
  OptionalPaymentMethod,
  OptionalPaymentView,
  PaymentStatus,
} from "@/types/models";
import {
  OPTIONAL_PAYMENT_CATEGORIES,
  OPTIONAL_PAYMENT_METHODS,
} from "@/lib/optionalPayments";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { toViewableUploadUrl } from "@/lib/toViewableUploadUrl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IOptionalPaymentsPanelProps {
  title: string;
  subtitle: string;
  tuitionHref?: string;
  payerName?: string;
  payerWhatsapp?: string;
  payments: OptionalPaymentView[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

function statusBadge(status: PaymentStatus): string {
  if (status === "approved") return "bg-emerald-100 text-emerald-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

export function OptionalPaymentsPanel({
  title,
  subtitle,
  tuitionHref,
  payerName,
  payerWhatsapp,
  payments,
  isLoading,
  isError,
  onRetry,
  onSubmit,
  isSubmitting,
}: IOptionalPaymentsPanelProps) {
  const { t, paymentMethod, statusLabel, formatDate, formatMoney } =
    usePortalTranslation();
  const pagination = usePaginatedList(payments);

  const [category, setCategory] = useState<OptionalPaymentCategory>("sadaqah");
  const [customLabel, setCustomLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<OptionalPaymentCurrency>("BDT");
  const [method, setMethod] = useState<OptionalPaymentMethod>("bkash");
  const [name, setName] = useState(payerName ?? "");
  const [whatsapp, setWhatsapp] = useState(payerWhatsapp ?? "");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [note, setNote] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    if (payerName) setName(payerName);
    if (payerWhatsapp) setWhatsapp(payerWhatsapp);
  }, [payerName, payerWhatsapp]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!screenshot) return;

    const formData = new FormData();
    formData.append("category", category);
    if (customLabel) formData.append("customLabel", customLabel);
    formData.append("amount", amount);
    formData.append("currency", currency);
    formData.append("method", method);
    formData.append("payerName", name);
    if (whatsapp) formData.append("whatsapp", whatsapp);
    formData.append("reference", reference);
    formData.append("paymentDate", paymentDate);
    if (note) formData.append("note", note);
    formData.append("screenshot", screenshot);
    onSubmit(formData);
    setReference("");
    setNote("");
    setCustomLabel("");
    setScreenshot(null);
  }

  if (isLoading) {
    return <PageLoading label={t("payments.optional.submitTitle")} />;
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        {tuitionHref ? (
          <Link
            to={tuitionHref}
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            {t("payments.optional.tuitionLink")} →
          </Link>
        ) : null}
      </div>

      <Card className="rounded-2xl border-0 p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Gift className="size-5 text-navy" />
          <h2 className="text-lg font-bold text-navy">
            {t("payments.optional.submitTitle")}
          </h2>
        </div>
        <p className="mb-5 text-sm text-zinc-500">{t("payments.optional.submitHint")}</p>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Select
            label={t("payments.optional.category")}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as OptionalPaymentCategory)
            }
            required
          >
            {OPTIONAL_PAYMENT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {t(`payments.categories.${item}`)}
              </option>
            ))}
          </Select>

          {category === "custom" ? (
            <Input
              label={t("payments.optional.customLabel")}
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder={t("payments.optional.customPlaceholder")}
              required
            />
          ) : null}

          <Input
            label={t("payments.optional.payerName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label={t("payments.optional.whatsapp")}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <Select
            label={t("payments.optional.method")}
            value={method}
            onChange={(e) => setMethod(e.target.value as OptionalPaymentMethod)}
            required
          >
            {OPTIONAL_PAYMENT_METHODS.map((item) => (
              <option key={item} value={item}>
                {paymentMethod(item)}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            min="1"
            step="0.01"
            label={t("payments.optional.amount")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Select
            label={t("payments.optional.currency")}
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value as OptionalPaymentCurrency)
            }
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
          </Select>
          <Input
            label={t("payments.optional.reference")}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
          />
          <Input
            type="date"
            label={t("payments.optional.paymentDate")}
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
          <div className="md:col-span-2">
            <Input
              label={t("payments.optional.note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("payments.optional.notePlaceholder")}
            />
          </div>
          <label className="md:col-span-2 flex flex-col gap-1.5">
            <span className="text-sm font-medium text-navy">
              {t("payments.optional.screenshot")}
            </span>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting || !screenshot}>
              <Upload className="mr-2 size-4" />
              {isSubmitting
                ? t("payments.optional.submitting")
                : t("payments.optional.submit")}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="rounded-2xl border-0 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-navy">
          {t("payments.optional.historyTitle")}
        </h2>
        {isError ? (
          <EmptyState
            icon={Gift}
            title={t("payments.optional.loadError")}
            actionLabel={t("common.retry")}
            onAction={onRetry}
          />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={Gift}
            title={t("payments.optional.empty")}
            description={t("payments.optional.emptyDesc")}
          />
        ) : (
          <div className="mt-4 space-y-3">
            {pagination.paginatedItems.map((payment) => (
              <div
                key={payment._id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-navy">
                    {t(`payments.categories.${payment.category}`)}
                    {payment.customLabel ? ` · ${payment.customLabel}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatMoney(payment.amount, payment.currency)} ·{" "}
                    {paymentMethod(payment.method)} · {payment.reference}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {formatDate(payment.createdAt)}
                  </p>
                  {payment.rejectionReason ? (
                    <p className="mt-1 text-xs text-red-600">
                      {payment.rejectionReason}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(payment.status)}`}
                  >
                    {statusLabel(payment.status)}
                  </span>
                  <a
                    href={toViewableUploadUrl(payment.screenshotUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {t("payments.optional.viewProof")}
                  </a>
                </div>
              </div>
            ))}
            <Pagination pagination={pagination} itemLabel="payments" />
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
