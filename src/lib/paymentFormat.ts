import type { PaymentMethod } from "@/types/models";
import type { LocaleType } from "@/i18n/types";
import { getStoredLocale } from "@/i18n/locale";
import { formatLocaleMoney, formatLocaleDate } from "@/i18n/format";
import { translatePaymentMethod } from "@/i18n/messages";

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

export function paymentMethodLabel(
  method: string,
  locale: LocaleType = getStoredLocale() ?? "en"
): string {
  return translatePaymentMethod(locale, method);
}

export function formatMoney(
  amount: number,
  currency: string,
  locale: LocaleType = getStoredLocale() ?? "en"
): string {
  return formatLocaleMoney(locale, amount, currency);
}

export function formatInvoiceDate(
  iso: string,
  locale: LocaleType = getStoredLocale() ?? "en"
): string {
  return formatLocaleDate(locale, iso, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
