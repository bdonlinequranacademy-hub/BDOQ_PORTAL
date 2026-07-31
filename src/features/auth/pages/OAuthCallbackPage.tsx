import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { fetchMeRequest } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import { normalizeAuthUser } from "@/lib/assignableRoles";
import { homePathForRole } from "@/lib/utils/roles";
import {
  LOGIN_PATH,
  authErrorMessage,
  googleSignInSuccessMessage,
} from "@/lib/authMessages";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function OAuthCallbackPage() {
  const { t } = usePortalTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const token = new URLSearchParams(hash).get("token");

    window.history.replaceState(null, "", window.location.pathname);

    if (!token) {
      toast.error(authErrorMessage("oauth") ?? t("auth.oauthFailed"));
      navigate(`${LOGIN_PATH}?error=oauth`, { replace: true });
      return;
    }

    fetchMeRequest(token)
      .then((user) => {
        const normalized = normalizeAuthUser(user);

        login(token, normalized);
        toast.success(
          googleSignInSuccessMessage(normalized.name, normalized.role)
        );
        navigate(homePathForRole(normalized.role), { replace: true });
      })
      .catch((err: Error) => {
        toast.error(
          err.message ?? t("auth.oauthCompleteFailed")
        );
        navigate(`${LOGIN_PATH}?error=oauth`, { replace: true });
      });
  }, [login, navigate, t]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 py-12">
        <Loader2 className="size-10 animate-spin text-navy" />
        <p className="text-sm text-zinc-500">{t("auth.oauthCompleting")}</p>
        <p className="max-w-xs text-center text-xs text-zinc-400">
          {t("auth.oauthRedirectNote")}
        </p>
      </div>
    </AuthLayout>
  );
}
