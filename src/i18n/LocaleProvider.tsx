import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LocaleType } from "@/i18n/types";
import { defaultLocale } from "@/i18n/types";
import { getStoredLocale, setLocalePreference } from "@/i18n/locale";
import { pickLocaleField } from "@/i18n/pickContent";
import {
  formatLocaleBdt,
  formatLocaleDateTime,
  formatLocaleMoney,
  formatLocaleNumber,
  formatLocaleTime,
  formatLocaleUsd,
} from "@/i18n/format";
import {
  translate,
  translateBrandingSubtitle,
  translateDynamicLabel,
  translateNav,
  translatePaymentMethod,
  translatePortalLabel,
  translateRole,
  translateSection,
  translateStatus,
  formatLocaleDate,
} from "@/i18n/messages";
import { queryClient } from "@/app/queryClient";

interface ILocaleContextValue {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string, params?: Record<string, string>) => string;
  nav: (path: string) => string;
  section: (id: string) => string;
  role: (roleKey: string) => string;
  portalLabel: (roleKey: string) => string;
  brandingSubtitle: (roleKey: string) => string;
  statusLabel: (status: string) => string;
  dynamicLabel: (key: string) => string;
  paymentMethod: (method: string) => string;
  formatDate: (iso: string) => string;
  formatTime: (iso: string) => string;
  formatDateTime: (iso: string) => string;
  formatMoney: (amount: number, currency: string) => string;
  formatBdt: (amount: number) => string;
  formatUsd: (amount: number) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  pickField: (
    en: string | undefined | null,
    bn: string | undefined | null,
    fallback?: string
  ) => string;
}

const LocaleContext = createContext<ILocaleContextValue | null>(null);

function readInitialLocale(): LocaleType {
  return getStoredLocale() ?? defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleType>(readInitialLocale);

  const setLocale = useCallback((next: LocaleType) => {
    setLocaleState((prev) => {
      if (prev !== next) {
        setLocalePreference(next);
        void queryClient.invalidateQueries();
      }
      return next;
    });
  }, []);

  const value = useMemo<ILocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => translate(locale, key, params),
      nav: (path) => translateNav(locale, path),
      section: (id) => translateSection(locale, id),
      role: (roleKey) => translateRole(locale, roleKey),
      portalLabel: (roleKey) => translatePortalLabel(locale, roleKey),
      brandingSubtitle: (roleKey) => translateBrandingSubtitle(locale, roleKey),
      statusLabel: (status) => translateStatus(locale, status),
      dynamicLabel: (key) => translateDynamicLabel(locale, key),
      paymentMethod: (method) => translatePaymentMethod(locale, method),
      formatDate: (iso) => formatLocaleDate(locale, iso),
      formatTime: (iso) => formatLocaleTime(locale, iso),
      formatDateTime: (iso) => formatLocaleDateTime(locale, iso),
      formatMoney: (amount, currency) => formatLocaleMoney(locale, amount, currency),
      formatBdt: (amount) => formatLocaleBdt(locale, amount),
      formatUsd: (amount) => formatLocaleUsd(locale, amount),
      formatNumber: (value, options) => formatLocaleNumber(locale, value, options),
      pickField: (en, bn, fallback = "") => pickLocaleField(locale, en, bn, fallback),
    }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocaleContext(): ILocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return ctx;
}

/** Shorthand hook for portal translations and locale-aware formatting */
export function usePortalTranslation() {
  return useLocaleContext();
}
