import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { AuthUser } from "@/types/models";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export interface RegisterVerificationRequired {
  requiresVerification: true;
  email: string;
}

export type RegisterResult = AuthData | RegisterVerificationRequired;

function parseApiError(res: ApiResponse<unknown>): string {
  return res.message ?? "Request failed";
}

export async function loginRequest(payload: LoginPayload): Promise<AuthData> {
  try {
    const res = await api.post<ApiResponse<AuthData>>("/auth/login", payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(parseApiError(res.data));
    }
    return res.data.data;
  } catch (err: unknown) {
    const ax = err as {
      response?: { status?: number; data?: ApiResponse<{ email?: string }> };
    };
    if (ax.response?.status === 403) {
      const e = new Error(ax.response.data?.message ?? "Email not verified") as Error & {
        code?: string;
        email?: string;
      };
      e.code = "EMAIL_NOT_VERIFIED";
      e.email = ax.response.data?.data?.email ?? payload.email;
      throw e;
    }
    if (ax.response?.data?.message) {
      throw new Error(ax.response.data.message);
    }
    throw err;
  }
}

export interface OAuthProviders {
  google: boolean;
}

export async function fetchOAuthProviders(): Promise<OAuthProviders> {
  const res = await api.get<ApiResponse<OAuthProviders>>("/auth/oauth-providers");
  if (!res.data.success || !res.data.data) {
    return { google: false };
  }
  return res.data.data;
}

export async function registerRequest(
  payload: RegisterPayload
): Promise<RegisterResult> {
  const res = await api.post<
    ApiResponse<AuthData | RegisterVerificationRequired>
  >("/auth/register", { ...payload, role: "student" });
  if (!res.data.success || !res.data.data) {
    throw new Error(parseApiError(res.data));
  }
  const data = res.data.data;
  if ("requiresVerification" in data && data.requiresVerification) {
    return data;
  }
  return data as AuthData;
}

export async function verifyEmailRequest(token: string): Promise<AuthData> {
  const res = await api.post<ApiResponse<AuthData>>("/auth/verify-email", { token });
  if (!res.data.success || !res.data.data) {
    throw new Error(parseApiError(res.data));
  }
  return res.data.data;
}

export async function resendVerificationRequest(email: string): Promise<void> {
  const res = await api.post<ApiResponse<null>>("/auth/resend-verification", { email });
  if (!res.data.success) {
    throw new Error(parseApiError(res.data));
  }
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  const res = await api.post<ApiResponse<null>>("/auth/forgot-password", { email });
  if (!res.data.success) {
    throw new Error(parseApiError(res.data));
  }
}

export async function resetPasswordRequest(
  token: string,
  newPassword: string
): Promise<void> {
  const res = await api.post<ApiResponse<null>>("/auth/reset-password", {
    token,
    newPassword,
  });
  if (!res.data.success) {
    throw new Error(parseApiError(res.data));
  }
}

export async function fetchMeRequest(token: string): Promise<AuthUser> {
  const res = await api.get<ApiResponse<AuthUser>>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.data.success || !res.data.data) {
    throw new Error(parseApiError(res.data));
  }
  return res.data.data;
}
