import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import { loginRequest, type LoginPayload } from "@/features/auth/api/authApi";
import { homePathForRole } from "@/lib/utils/roles";
import { parsePortalIntent, roleMatchesPortal } from "@/lib/portalAuth";

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      const user =
        data.user.role === "parent"
          ? { ...data.user, role: "student" as const }
          : data.user;
      login(data.token, user);

      const portal = parsePortalIntent(
        new URLSearchParams(window.location.search).get("portal")
      );
      if (!roleMatchesPortal(user.role, portal)) {
        toast.error(
          `This email is a ${user.role} account, not ${portal}. Opening your ${user.role} dashboard.`
        );
      } else {
        toast.success(`Welcome back, ${user.name}!`);
      }

      navigate(homePathForRole(user.role), { replace: true });
    },
    onError: (err: Error) => {
      const e = err as Error & { code?: string; email?: string };
      if (e.code === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email first.");
        navigate(
          `/check-email?email=${encodeURIComponent(e.email ?? "")}`,
          { replace: true }
        );
        return;
      }
      toast.error(err.message ?? "Login failed. Please try again.");
    },
  });
}
