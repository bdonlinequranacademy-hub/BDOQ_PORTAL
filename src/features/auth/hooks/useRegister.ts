import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import {
  registerRequest,
  type RegisterPayload,
} from "@/features/auth/api/authApi";
import { homePathForRole } from "@/lib/utils/roles";

export function useRegister() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data) => {
      if ("requiresVerification" in data) {
        toast.success("Check your email to verify your account.");
        navigate(
          `/check-email?email=${encodeURIComponent(data.email)}`,
          { replace: true }
        );
        return;
      }
      const auth = data;
      login(auth.token, auth.user);
      toast.success("Account created! Welcome to Al Bayaan Academy.");
      navigate(homePathForRole(auth.user.role), { replace: true });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Registration failed. Please try again.");
    },
  });
}
