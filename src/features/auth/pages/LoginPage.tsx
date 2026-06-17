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
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { formControlLgClass } from "@/lib/formControl";
import { toast } from "@/stores/uiStore";
import {
  PORTAL_COPY,
  loginPathForPortal,
  parsePortalIntent,
  registerPathForPortal,
} from "@/lib/portalAuth";

export function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [searchParams, setSearchParams] = useSearchParams();
  const portal = parsePortalIntent(searchParams.get("portal"));
  const copy = PORTAL_COPY[portal];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    if (error === "oauth") {
      toast.error("Google sign-in failed. Please try again or use email.");
    } else if (error === "oauth_role") {
      toast.error(
        `This Google account is not a ${portal} account. Use the correct portal or contact your admin.`
      );
    } else if (error === "oauth_account_required") {
      toast.error(
        `${portal === "admin" ? "Admin" : "Teacher"} accounts must be created by your academy admin before Google sign-in.`
      );
    } else if (error === "deactivated") {
      toast.error("This account has been deactivated. Contact support.");
    }

    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, portal]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-6">
        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <BrandLogo size="lg" />
          <p className="text-xs text-zinc-500">Secure portal for students, teachers &amp; admins</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white px-8 py-8 shadow-xl shadow-navy/5 flex flex-col gap-6">
          {/* Heading */}
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-navy">{copy.signInTitle}</h1>
            <p className="text-sm text-zinc-500">{copy.signInSubtitle}</p>
          </div>

          {copy.registerNote ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs leading-relaxed text-amber-900">
              {copy.registerNote}
            </p>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-navy">
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-navy">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-navy"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Link to="/forgot-password" className="mt-1 self-end text-xs font-medium text-gold hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 h-12 w-full rounded-2xl bg-navy text-sm font-semibold text-white transition hover:bg-navy-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-500">or continue with</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <GoogleAuthButton label="Continue with Google" portal={portal} />

          {/* Footer link */}
          {portal === "student" ? (
            <p className="text-center text-sm text-zinc-500">
              New to Al Bayaan?{" "}
              <Link to={registerPathForPortal("student")} className="font-bold text-gold hover:underline">
                Create student account
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-zinc-500">
              Need a student account instead?{" "}
              <Link to={loginPathForPortal("student")} className="font-bold text-gold hover:underline">
                Student sign in
              </Link>
              {" · "}
              <Link to={registerPathForPortal("student")} className="font-bold text-gold hover:underline">
                Create student account
              </Link>
            </p>
          )}
        </div>

        {/* Trust badges */}
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
