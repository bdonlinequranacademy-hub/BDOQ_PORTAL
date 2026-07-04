import type { PaymentMethod } from "@/types/models";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod | string, string> = {
  zelle: "Zelle",
  wise: "Wise",
  bank_transfer: "Bank transfer",
  paypal: "PayPal",
  cash_app: "Cash App",
  bkash: "bKash",
  nagad: "Nagad",
  other: "Other",
};

export function paymentMethodLabel(method: string): string {
  return PAYMENT_METHOD_LABELS[method] ?? method.replace(/_/g, " ");
}

export function formatMoney(amount: number, currency: string): string {
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

export function formatInvoiceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
