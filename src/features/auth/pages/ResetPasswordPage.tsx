import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { resetPasswordRequest } from "@/features/auth/api/authApi";
import { toast } from "@/stores/uiStore";
import { formControlLgClass } from "@/lib/formControl";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function ResetPasswordPage() {
  const { t } = usePortalTranslation();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error(t("auth.invalidResetLink"));
      return;
    }
    if (password !== confirm) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      await resetPasswordRequest(token, password);
      toast.success(t("auth.passwordUpdated"));
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("auth.resetFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <p className="text-sm text-zinc-500">{t("auth.invalidResetToken")}</p>
        <Link to="/forgot-password" className="text-sm font-semibold text-gold">
          {t("auth.requestNewLink")}
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-md flex-col gap-6 py-4">
        <h1 className="text-2xl font-bold text-navy">{t("auth.resetPasswordTitle")}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.newPasswordPlaceholder")}
              className={`h-11 ${formControlLgClass} px-9 bg-white`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type={showConfirm ? "text" : "password"}
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t("auth.confirmPasswordShort")}
              className={`h-11 ${formControlLgClass} px-9 bg-white`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-brand-red text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
          >
            {loading ? t("common.loading") : t("auth.updatePassword")}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
