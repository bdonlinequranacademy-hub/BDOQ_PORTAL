import { useState, useEffect, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Star,
} from "lucide-react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { formControlLgClass } from "@/lib/formControl";
import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { toast } from "@/stores/uiStore";
import {
  REGISTER_PATH,
  STAFF_ACCOUNT_NOTICE,
  authErrorMessage,
} from "@/lib/authMessages";

export function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    toast.error(authErrorMessage(error) ?? "Sign-in failed. Please try again.");
    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-6">
        <div className="mb-2 flex flex-col items-center gap-2 text-center lg:mb-4">
          <img
            src={BDOQ_BRAND.logoSrc}
            alt=""
            aria-hidden
            className="h-20 w-auto max-w-[240px] object-contain lg:hidden"
          />
          <h2 className="font-display text-2xl font-bold text-primary-dark">{BDOQ_BRAND.shortName}</h2>
          <p className="text-xs text-portal-muted">Assalamu Alaikum — sign in to continue your Quran journey</p>
        </div>

        <div className="portal-auth-card flex flex-col gap-6 px-8 py-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-display text-3xl font-bold text-primary-dark">Welcome back</h1>
            <p className="text-sm text-portal-muted">
              Use the email and password your academy gave you. We open the right dashboard for your
              role automatically.
            </p>
          </div>

          <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-center text-xs leading-relaxed text-primary-dark">
            {STAFF_ACCOUNT_NOTICE}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-primary-dark">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 ${formControlLgClass} pl-9 pr-4`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-primary-dark">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-12 ${formControlLgClass} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary-dark"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Link to="/forgot-password" className="mt-1 self-end text-xs font-medium text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-500">or continue with</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <GoogleAuthButton label="Continue with Google" />

          <p className="text-center text-xs text-zinc-400">
            Google creates a <strong className="font-medium text-zinc-500">student</strong> account
            only. Teachers and admins must use credentials from your administrator.
          </p>

          <p className="text-center text-sm text-zinc-500">
            New student?{" "}
            <Link to={REGISTER_PATH} className="font-bold text-primary hover:underline">
              Create student account
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-xs text-zinc-400">Secure Login</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-xs text-zinc-400">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-xs text-zinc-400">Trusted Platform</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
