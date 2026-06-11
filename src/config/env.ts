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

export const env = {
  apiUrl: resolveApiUrl(),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
