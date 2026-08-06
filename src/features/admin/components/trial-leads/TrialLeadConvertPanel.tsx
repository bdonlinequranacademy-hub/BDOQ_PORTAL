import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Copy, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TrialBookingView } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

export interface IConvertTrialResult {
  prefillUrl: string;
  portalAdmissionPath: string;
  user?: {
    _id: string;
    email: string;
    temporaryPassword?: string;
  };
  admission: {
    _id: string;
  };
}

interface ITrialLeadConvertPanelProps {
  lead: TrialBookingView;
  busy: boolean;
  lastResult: IConvertTrialResult | null;
  onConvert: (payload: { email: string; createUser: boolean }) => void;
}

const fieldClass = cn(formControlClass, "shadow-none");

export function TrialLeadConvertPanel({
  lead,
  busy,
  lastResult,
  onConvert,
}: ITrialLeadConvertPanelProps) {
  const { t, formatDateTime } = usePortalTranslation();
  const [email, setEmail] = useState(lead.email ?? "");
  const [createUser, setCreateUser] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setEmail(lead.email ?? "");
  }, [lead._id, lead.email]);

  const isConverted = Boolean(lead.convertedAdmissionId);

  async function copyText(label: string, value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  const resultForLead = useMemo(() => {
    if (!lastResult) return null;
    return lastResult;
  }, [lastResult]);

  if (isConverted) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
        <h3 className="text-sm font-semibold text-emerald-900">
          {t("admin.trialLeads.convertDoneTitle")}
        </h3>
        <p className="mt-1 text-xs text-emerald-800">
          {lead.convertedAt
            ? t("admin.trialLeads.convertDoneAt", {
                date: formatDateTime(lead.convertedAt),
              })
            : t("admin.trialLeads.convertDoneHint")}
        </p>
        {resultForLead?.prefillUrl ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-emerald-900">
              {t("admin.trialLeads.prefillLinkLabel")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input value={resultForLead.prefillUrl} readOnly className={fieldClass} />
              <Button
                type="button"
                variant="ghost"
                className="h-10 shrink-0 rounded-xl border border-emerald-200 px-3"
                onClick={() => void copyText("prefill", resultForLead.prefillUrl)}
              >
                <Copy className="size-4" aria-hidden />
                {copied === "prefill"
                  ? t("admin.trialLeads.copied")
                  : t("admin.trialLeads.copyLink")}
              </Button>
            </div>
          </div>
        ) : null}
        <Link
          to="/admin/student-admissions"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 hover:underline"
        >
          {t("admin.trialLeads.openAdmissions")}
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-portal bg-portal-muted/20 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserPlus className="size-4" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-portal-heading">
            {t("admin.trialLeads.convertTitle")}
          </h3>
          <p className="mt-1 text-xs text-portal-muted">{t("admin.trialLeads.convertHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.convertEmail")}
          </span>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
            placeholder={t("admin.trialLeads.convertEmailPlaceholder")}
            required
          />
        </label>

        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={createUser}
            onChange={(event) => setCreateUser(event.target.checked)}
            className="size-4 rounded border-portal text-primary"
          />
          <span className="text-sm text-portal-heading">
            {t("admin.trialLeads.convertCreateUser")}
          </span>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-portal pt-4 sm:flex-row sm:items-center">
        <Button
          type="button"
          disabled={busy || !email.trim()}
          onClick={() => onConvert({ email: email.trim(), createUser })}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-dark px-4 text-white"
        >
          <ArrowRight className="size-4" aria-hidden />
          {t("admin.trialLeads.convertAction")}
        </Button>
        <p className="text-xs text-portal-muted">{t("admin.trialLeads.convertActionHint")}</p>
      </div>

      {resultForLead ? (
        <div className="mt-4 rounded-xl border border-primary/20 bg-white p-3 text-xs text-portal-heading">
          <p className="font-semibold text-primary-dark">{t("admin.trialLeads.convertSuccess")}</p>
          {resultForLead.user?.temporaryPassword ? (
            <p className="mt-2">
              {t("admin.trialLeads.tempPassword", {
                password: resultForLead.user.temporaryPassword,
              })}
            </p>
          ) : null}
          <div className="mt-3 flex flex-col gap-2">
            <Input value={resultForLead.prefillUrl} readOnly className={fieldClass} />
            <Button
              type="button"
              variant="ghost"
              className="h-9 self-start rounded-xl border border-portal px-3"
              onClick={() => void copyText("prefill", resultForLead.prefillUrl)}
            >
              <Copy className="size-4" aria-hidden />
              {copied === "prefill"
                ? t("admin.trialLeads.copied")
                : t("admin.trialLeads.copyPrefillLink")}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
