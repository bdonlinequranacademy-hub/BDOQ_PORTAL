import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import {
  registerRequest,
  type RegisterPayload,
} from "@/features/auth/api/authApi";
import { homePathForRole } from "@/lib/utils/roles";
import {
  registerInstantWelcome,
  registerSuccessMessage,
} from "@/lib/authMessages";

export function useRegister() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data, variables) => {
      if ("requiresVerification" in data) {
        toast.success(
          registerSuccessMessage(variables.name, true)
        );
        navigate(
          `/check-email?email=${encodeURIComponent(data.email)}`,
          { replace: true }
        );
        return;
      }
      const auth = data;
      login(auth.token, auth.user);
      toast.success(registerInstantWelcome(auth.user.name));
      navigate(homePathForRole(auth.user.role), { replace: true });
    },
    onError: (err: Error) => {
      const message = err.message ?? "";
      if (message.toLowerCase().includes("already exists")) {
        toast.error(
          "An account with this email already exists. Sign in instead, or use Forgot Password if you lost access."
        );
        return;
      }
      toast.error(message || "Registration failed. Please check your details and try again.");
    },
  });
}
