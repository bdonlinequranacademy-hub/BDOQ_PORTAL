import type { LocaleType } from "@/i18n/types";
import type { IPortalMessages } from "@/i18n/types";
import { enMessages } from "@/i18n/messages/en";
import { bnMessages } from "@/i18n/messages/bn";
import { formatLocaleDate as formatDateIntl } from "@/i18n/format";

export const messages: Record<LocaleType, IPortalMessages> = {
  en: enMessages,
  bn: bnMessages,
};

function resolveNestedValue(
  source: IPortalMessages,
  key: string
): string | undefined {
  const parts = key.split(".");
  let current: unknown = source;

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

function humanizeMissingKey(key: string): string {
  const last = key.split(".").pop() ?? key;
  const spaced = last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!spaced) return key;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function translate(
  locale: LocaleType,
  key: string,
  params?: Record<string, string>
): string {
  const value =
    resolveNestedValue(messages[locale], key) ??
    resolveNestedValue(messages.en, key) ??
    humanizeMissingKey(key);

  if (!params) return value;

  return Object.entries(params).reduce(
    (text, [paramKey, paramValue]) =>
      text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), paramValue),
    value
  );
}

export function translateNav(locale: LocaleType, path: string): string {
  return (
    messages[locale].nav[path] ??
    messages.en.nav[path] ??
    path.split("/").pop() ??
    path
  );
}

export function translateSection(locale: LocaleType, id: string): string {
  return (
    messages[locale].sections[id] ??
    messages.en.sections[id] ??
    id
  );
}

export function translateRole(locale: LocaleType, role: string): string {
  return messages[locale].roles[role] ?? messages.en.roles[role] ?? role;
}

export function translatePortalLabel(locale: LocaleType, role: string): string {
  return (
    messages[locale].portal[role] ??
    messages.en.portal[role] ??
    `${role} Portal`
  );
}

export function translateBrandingSubtitle(
  locale: LocaleType,
  role: string
): string {
  const key = `${role}_subtitle`;
  return (
    messages[locale].branding[key] ??
    messages.en.branding[key] ??
    messages.en.branding.student_subtitle
  );
}

export function translateStatus(locale: LocaleType, status: string): string {
  const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");
  const classLogPending =
    normalized === "pending" && status.toLowerCase().includes("approval")
      ? "pending_approval"
      : normalized;

  return (
    messages[locale].status[classLogPending] ??
    messages.en.status[classLogPending] ??
    messages[locale].status[normalized] ??
    messages.en.status[normalized] ??
    status.replace(/_/g, " ")
  );
}

export function translatePaymentMethod(
  locale: LocaleType,
  method: string
): string {
  return (
    messages[locale].payments.methods[method] ??
    messages.en.payments.methods[method] ??
    method.replace(/_/g, " ")
  );
}

export function formatLocaleDate(
  locale: LocaleType,
  iso: string
): string {
  return formatDateIntl(locale, iso);
}

export function translateDynamicLabel(
  locale: LocaleType,
  key: string
): string {
  const normalized = key.toLowerCase().replace(/[\s-]+/g, "_");
  return (
    messages[locale].labels[normalized] ??
    messages.en.labels[normalized] ??
    messages[locale].status[normalized] ??
    messages.en.status[normalized] ??
    key.replace(/_/g, " ")
  );
}
