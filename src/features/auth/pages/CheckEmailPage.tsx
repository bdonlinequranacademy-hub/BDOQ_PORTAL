import { Link, useSearchParams } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { resendVerificationRequest } from "@/features/auth/api/authApi";
import { toast } from "@/stores/uiStore";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function CheckEmailPage() {
  const { t } = usePortalTranslation();
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const [sending, setSending] = useState(false);

  async function handleResend() {
    if (!email) return;
    setSending(true);
    try {
      await resendVerificationRequest(email);
      toast.success(t("auth.resendSuccess"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("auth.resendFailed"));
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center gap-6 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#EEF2F8]">
          <Mail className="size-8 text-primary-dark" />
        </div>
        <h1 className="text-2xl font-bold text-navy">{t("auth.checkEmailTitle")}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
          {t("auth.checkEmailBody", { email: email || t("auth.yourInbox") })}
        </p>
        <p className="text-xs text-zinc-400">
          {t("auth.devSmtpHint")}
        </p>
        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="text-sm font-semibold text-gold hover:underline disabled:opacity-50"
          >
            {sending ? t("auth.sending") : t("auth.resendVerification")}
          </button>
        )}
        <Link to="/login" className="text-sm font-semibold text-navy hover:underline">
          {t("auth.backToSignIn")}
        </Link>
      </div>
    </AuthLayout>
  );
}
