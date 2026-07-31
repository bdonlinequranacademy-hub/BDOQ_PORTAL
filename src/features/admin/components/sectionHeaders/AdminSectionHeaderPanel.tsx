import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import {
  useAdminSectionHeaders,
  useUpsertSectionHeader,
} from "@/features/admin/hooks/useAdmin";
import {
  canSaveSectionHeader,
  getSectionHeaderConfig,
  mergeSectionHeaderFromApi,
  type SectionHeaderField,
} from "@/features/admin/components/sectionHeaders/adminSectionHeaderUtils";
import { Card } from "@/components/ui/Card";
import { formControlClass, formHintClass, formLabelClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";
import type {
  AdminSectionHeader,
  ISectionHeaderLocaleContent,
} from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const FIELD_LABELS: Record<SectionHeaderField, string> = {
  eyebrow: "Badge / Eyebrow",
  title: "Headline",
  subtitle: "Subheadline",
  titleHighlight: "Headline highlight (optional)",
  titleAccent: "Title accent (optional)",
  intro: "Intro text",
};

type ContentLocale = "en" | "bn";

interface IAdminSectionHeaderPanelProps {
  sectionKey: string;
  defaultOpen?: boolean;
}

export function AdminSectionHeaderPanel({
  sectionKey,
  defaultOpen = false,
}: IAdminSectionHeaderPanelProps) {
  const { t } = usePortalTranslation();

  const config = getSectionHeaderConfig(sectionKey);
  const { data: headers = [] } = useAdminSectionHeaders();
  const upsert = useUpsertSectionHeader();
  const [open, setOpen] = useState(defaultOpen);
  const [locale, setLocale] = useState<ContentLocale>("en");
  const [form, setForm] = useState<AdminSectionHeader | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existing = useMemo(
    () => headers.find((item) => item.sectionKey === sectionKey),
    [headers, sectionKey]
  );

  useEffect(() => {
    if (!config) return;
    setForm(mergeSectionHeaderFromApi(config, existing));
  }, [config, existing]);

  if (!config || !form) return null;

  const localeKey = locale === "bn" ? "contentBn" : "contentEn";
  const content = form[localeKey];

  function patchLocale(patch: Partial<ISectionHeaderLocaleContent>): void {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [localeKey]: { ...prev[localeKey], ...patch },
          }
        : prev
    );
  }

  async function handleSave(): Promise<void> {
    if (!form) return;
    if (!canSaveSectionHeader(form)) {
      setError("EN and BN headlines are required.");
      return;
    }

    setError(null);
    try {
      const res = await upsert.mutateAsync({
        header: {
          sectionKey: form.sectionKey,
          label: form.label,
          sortOrder: form.sortOrder,
          showOnWebsite: form.showOnWebsite,
          contentEn: form.contentEn,
          contentBn: form.contentBn,
        },
      });
      if (!res.success) {
        setError(res.message || "Failed to save section header.");
      }
    } catch {
      setError("Failed to save section header.");
    }
  }

  return (
    <Card className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Section header
          </p>
          <h2 className="mt-1 text-base font-bold text-primary-dark">
            {config.label}
          </h2>
          <p className={cn(formHintClass, "mt-1")}>{config.description}</p>
        </div>
        {open ? (
          <ChevronUp className="mt-1 size-5 shrink-0 text-portal-muted" />
        ) : (
          <ChevronDown className="mt-1 size-5 shrink-0 text-portal-muted" />
        )}
      </button>

      {open ? (
        <div className="mt-5 space-y-4 border-t border-primary/15 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-portal bg-white p-1">
              {(["en", "bn"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocale(item)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase transition",
                    locale === item
                      ? "bg-primary text-white"
                      : "text-portal-muted"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark">
              <input
                type="checkbox"
                checked={form.showOnWebsite}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, showOnWebsite: e.target.checked } : prev
                  )
                }
              />{t("admin.common.statPublished")}</label>
          </div>

          {config.fields.map((field) => (
            <label key={field} className="block">
              <span className={formLabelClass}>{FIELD_LABELS[field]}</span>
              {field === "subtitle" || field === "intro" ? (
                <textarea
                  className={cn(formControlClass, "min-h-[88px]")}
                  value={content[field] ?? ""}
                  onChange={(e) => patchLocale({ [field]: e.target.value })}
                />
              ) : (
                <input
                  className={formControlClass}
                  value={content[field] ?? ""}
                  onChange={(e) => patchLocale({ [field]: e.target.value })}
                />
              )}
            </label>
          ))}

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={upsert.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            <Save className="size-4" aria-hidden="true" />
            {upsert.isPending ? "Saving…" : "Save section header"}
          </button>
        </div>
      ) : null}
    </Card>
  );
}
