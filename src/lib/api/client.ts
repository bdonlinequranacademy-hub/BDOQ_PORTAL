import axios from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { getStoredLocale } from "@/i18n/locale";

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const locale = getStoredLocale();
  if (locale) {
    config.headers["Accept-Language"] = locale;
    config.headers["X-Locale"] = locale;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const hadToken = Boolean(useAuthStore.getState().token);

    // Only force a logout when an authenticated session expires (401 with a token).
    // Unauthenticated 401s (e.g. a failed login attempt) are handled by the caller.
    if (status === 401 && hadToken) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
