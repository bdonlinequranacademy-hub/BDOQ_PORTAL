import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { forgotPasswordRequest } from "@/features/auth/api/authApi";
import { toast } from "@/stores/uiStore";
import { formControlLgClass } from "@/lib/formControl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function ForgotPasswordPage() {
  const { t } = usePortalTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordRequest(email);
      setSent(true);
      toast.success(t("auth.resetSent"));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("auth.requestFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-md flex-col gap-6 py-4">
        <h1 className="text-2xl font-bold text-navy">{t("auth.forgotPasswordTitle")}</h1>
        {sent ? (
          <p className="text-sm text-zinc-500">
            {t("auth.resetSentDetail", { email })}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                className={`h-11 ${formControlLgClass} pl-9 pr-4 bg-white`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-brand-red text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
            >
              {loading ? t("auth.sending") : t("auth.sendResetLink")}
            </button>
          </form>
        )}
        <Link to="/login" className="text-sm font-semibold text-gold hover:underline">
          {t("auth.backToSignIn")}
        </Link>
      </div>
    </AuthLayout>
  );
}
