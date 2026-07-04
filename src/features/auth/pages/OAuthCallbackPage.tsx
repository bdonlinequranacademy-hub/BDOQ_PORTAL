import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { fetchMeRequest } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import { homePathForRole } from "@/lib/utils/roles";
import {
  LOGIN_PATH,
  authErrorMessage,
  googleSignInSuccessMessage,
} from "@/lib/authMessages";

export function OAuthCallbackPage() {
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
      toast.error(authErrorMessage("oauth") ?? "Google sign-in failed.");
      navigate(`${LOGIN_PATH}?error=oauth`, { replace: true });
      return;
    }

    fetchMeRequest(token)
      .then((user) => {
        const normalized =
          user.role === "parent" ? { ...user, role: "student" as const } : user;

        login(token, normalized);
        toast.success(
          googleSignInSuccessMessage(normalized.name, normalized.role)
        );
        navigate(homePathForRole(normalized.role), { replace: true });
      })
      .catch((err: Error) => {
        toast.error(
          err.message ??
            "We could not complete Google sign-in. Please try again or sign in with your email."
        );
        navigate(`${LOGIN_PATH}?error=oauth`, { replace: true });
      });
  }, [login, navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 py-12">
        <Loader2 className="size-10 animate-spin text-navy" />
        <p className="text-sm text-zinc-500">Completing Google sign-in…</p>
        <p className="max-w-xs text-center text-xs text-zinc-400">
          You will be taken to your dashboard based on your account role.
        </p>
      </div>
    </AuthLayout>
  );
}
