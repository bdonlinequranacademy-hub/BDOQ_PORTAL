const DEFAULT_API_URL = "http://localhost:5000/api";

function resolveApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");

  if (import.meta.env.PROD) {
    console.error(
      "[env] VITE_API_URL is not set — production build will call localhost. Set it before `npm run build`."
    );
  }

  return DEFAULT_API_URL;
}

function resolvePublicSiteUrl(): string {
  const raw = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:4321";
}

function resolveSocketUrl(): string {
  const explicit = import.meta.env.VITE_SOCKET_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const api = resolveApiUrl();
  if (api.endsWith("/api")) return api.slice(0, -4);
  return api.replace(/\/api\/?$/, "");
}

export const env = {
  apiUrl: resolveApiUrl(),
  publicSiteUrl: resolvePublicSiteUrl(),
  socketUrl: resolveSocketUrl(),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
