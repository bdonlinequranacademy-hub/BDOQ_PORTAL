import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function VerifyEmailPage() {
  const { t } = usePortalTranslation();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const verify = useVerifyEmail();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(t("auth.missingVerifyToken"));
      return;
    }
    let cancelled = false;
    verify.mutate(token, {
      onSuccess: () => {
        if (!cancelled) navigate("/verify-email/success", { replace: true });
      },
      onError: (err: Error) => {
        if (!cancelled) setError(err.message ?? t("auth.verificationFailed"));
      },
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per token
  }, [token]);

  if (error) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <AlertCircle className="size-12 text-red-500" />
          <h1 className="text-xl font-bold text-navy">{t("auth.verificationFailed")}</h1>
          <p className="text-sm text-zinc-500">{error}</p>
          <Link to="/login" className="text-sm font-semibold text-gold hover:underline">
            {t("auth.signIn")}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 py-12">
        <Loader2 className="size-10 animate-spin text-navy" />
        <p className="text-sm text-zinc-500">{t("auth.verifyEmailLoading")}</p>
      </div>
    </AuthLayout>
  );
}
