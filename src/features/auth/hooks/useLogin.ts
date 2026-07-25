import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import { loginRequest, type LoginPayload } from "@/features/auth/api/authApi";
import { normalizeAuthUser } from "@/lib/assignableRoles";
import { homePathForRole } from "@/lib/utils/roles";
import { welcomeBackMessage } from "@/lib/authMessages";

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      const user = normalizeAuthUser(data.user);

      login(data.token, user);
      toast.success(welcomeBackMessage(user.name, user.role));
      navigate(homePathForRole(user.role), { replace: true });
    },
    onError: (err: Error) => {
      const e = err as Error & { code?: string; email?: string };
      if (e.code === "EMAIL_NOT_VERIFIED") {
        toast.error(
          "Your email is not verified yet. Open the link we sent you, or request a new verification email on the next screen."
        );
        navigate(
          `/check-email?email=${encodeURIComponent(e.email ?? "")}`,
          { replace: true }
        );
        return;
      }
      if (e.message?.toLowerCase().includes("invalid")) {
        toast.error(
          "Incorrect email or password. Double-check your details, or use Forgot Password if you need to reset."
        );
        return;
      }
      toast.error(err.message ?? "Sign-in failed. Please try again in a moment.");
    },
  });
}
