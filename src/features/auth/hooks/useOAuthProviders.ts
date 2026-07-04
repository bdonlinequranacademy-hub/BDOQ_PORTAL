"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOAuthProviders } from "@/features/auth/api/authApi";

export function useOAuthProviders() {
  return useQuery({
    queryKey: ["auth", "oauth-providers"],
    queryFn: fetchOAuthProviders,
    staleTime: 60_000,
  });
}
