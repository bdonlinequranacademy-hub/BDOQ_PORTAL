import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { verifyEmailRequest } from "@/features/auth/api/authApi";

export function useVerifyEmail() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) => verifyEmailRequest(token),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}
