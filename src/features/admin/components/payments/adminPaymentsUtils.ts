import type { BillingCurrency, OverdueBillingView, PaymentRecordView, PaymentStatus } from "@/types/models";
import type { LocaleType } from "@/i18n/types";
import { getStoredLocale } from "@/i18n/locale";
import { formatLocaleMoney } from "@/i18n/format";

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  zelle: "Zelle",
  wise: "Wise",
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  cash_app: "Cash App",
  bkash: "bKash",
  nagad: "Nagad",
  other: "Other",
};

export function formatPaymentAmount(
  amount: number,
  currency: string,
  locale: LocaleType = getStoredLocale() ?? "en"
) {
  return formatLocaleMoney(locale, amount, currency);
}

export function sumPaymentsByCurrency(
  payments: PaymentRecordView[],
  predicate: (payment: PaymentRecordView) => boolean
): string {
  const totals = new Map<string, number>();

  for (const payment of payments.filter(predicate)) {
    totals.set(payment.currency, (totals.get(payment.currency) ?? 0) + payment.amount);
  }

  const entries = [...totals.entries()];
  if (entries.length === 0) return "—";
  if (entries.length === 1) {
    return formatPaymentAmount(entries[0][1], entries[0][0]);
  }

  return entries
    .slice(0, 2)
    .map(([currency, amount]) => formatPaymentAmount(amount, currency))
    .join(" · ");
}

export function sumOverdueByCurrency(overdue: OverdueBillingView[]): string {
  const totals = new Map<string, number>();

  for (const row of overdue) {
    totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.monthlyFee);
  }

  const entries = [...totals.entries()];
  if (entries.length === 0) return "—";
  if (entries.length === 1) {
    return formatPaymentAmount(entries[0][1], entries[0][0]);
  }

  return entries
    .slice(0, 2)
    .map(([currency, amount]) => formatPaymentAmount(amount, currency))
    .join(" · ");
}

export function paymentsThisMonth(payments: PaymentRecordView[]): PaymentRecordView[] {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return payments.filter((payment) => {
    if (payment.status !== "approved") return false;
    const date = new Date(payment.paymentDate || payment.createdAt);
    return date >= monthStart;
  });
}

export function paymentStatusStyles(status: PaymentStatus) {
  if (status === "approved") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (status === "rejected") {
    return "bg-red-100 text-red-800";
  }
  return "bg-amber-100 text-amber-900";
}

export function formatPaymentDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const PAYMENT_CURRENCIES: BillingCurrency[] = ["USD", "GBP", "EUR", "BDT", "CAD", "AUD"];
