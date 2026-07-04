import { env } from "@/config/env";
import { useOAuthProviders } from "@/features/auth/hooks/useOAuthProviders";

const GOOGLE_AUTH_URL = `${env.apiUrl}/auth/google`;

interface GoogleAuthButtonProps {
  label: string;
  className?: string;
}

export function GoogleAuthButton({ label, className = "" }: GoogleAuthButtonProps) {
  const { data: providers, isLoading } = useOAuthProviders();
  const googleEnabled = providers?.google ?? false;

  const baseClass =
    className ||
    "flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-navy shadow-sm transition hover:bg-cream";

  if (isLoading) {
    return (
      <div
        className={`${baseClass} cursor-wait opacity-60`}
        aria-busy="true"
        aria-label="Loading Google sign-in"
      >
        <GoogleIcon />
        Checking Google sign-in…
      </div>
    );
  }

  if (!googleEnabled) {
    return (
      <div
        className={`${baseClass} cursor-not-allowed opacity-50`}
        title="Google sign-in is not configured on the server. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to My-Academy/.env"
        aria-disabled="true"
      >
        <GoogleIcon />
        Google sign-in unavailable
      </div>
    );
  }

  return (
    <a href={GOOGLE_AUTH_URL} className={baseClass}>
      <GoogleIcon />
      {label}
    </a>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 4.75z"
      />
    </svg>
  );
}
