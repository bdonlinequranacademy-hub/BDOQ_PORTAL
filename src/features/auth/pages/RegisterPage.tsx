import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { toast } from "@/stores/uiStore";
import { formControlLgClass } from "@/lib/formControl";
import { loginPathForPortal, parsePortalIntent } from "@/lib/portalAuth";

export function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  const [searchParams] = useSearchParams();
  const portal = parsePortalIntent(searchParams.get("portal"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    register({ name, email, password });
  }

  const inputClass = `h-11 ${formControlLgClass} pl-9 pr-4 bg-white`;

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center gap-6 bg-white py-4">
        {/* Brand */}
        <BrandLogo size="md" />

        {/* Card */}
        <div className="w-full rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-xl shadow-navy/5 flex flex-col gap-6">
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-navy">Create Student Account</h1>
            <p className="text-sm leading-relaxed text-zinc-500">
              Public registration is for <strong className="font-semibold text-navy">students only</strong>.
              Teachers and admins receive accounts from your academy administrator.
            </p>
          </div>

          {portal !== "student" ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              You opened the {portal} portal, but this form still creates a{" "}
              <strong>student</strong> account. For a {portal} login, ask your admin to create one, then
              use{" "}
              <Link to={loginPathForPortal(portal)} className="font-semibold text-gold hover:underline">
                {portal} sign in
              </Link>
              .
            </p>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-medium text-navy">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-email" className="text-xs font-medium text-navy">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone — UI only (not sent to backend yet) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-medium text-navy">
                Phone / WhatsApp Number
              </label>
              <div className="flex items-center gap-2">
                <div className="flex h-11 shrink-0 items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-100 px-3">
                  <span className="text-base leading-none">🇬🇧</span>
                  <span className="text-sm font-medium text-navy">+44</span>
                  <ChevronDown className="size-3 text-zinc-400" aria-hidden="true" />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="7123 456789"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reg-password" className="text-xs font-medium text-navy">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-11 ${formControlLgClass} pl-9 pr-10 bg-white`}
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
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password" className="text-xs font-medium text-navy">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-11 ${formControlLgClass} pl-9 pr-10 bg-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-navy"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 rounded border-zinc-200 accent-navy"
              />
              <label htmlFor="terms" className="text-xs leading-relaxed text-zinc-500">
                I agree to the{" "}
                <a href="#" className="font-semibold text-gold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-gold hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-2xl bg-navy text-sm font-semibold text-white transition hover:bg-navy-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating account…" : "Create My Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-500">or sign up with</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <GoogleAuthButton
            label="Sign up with Google"
            portal={portal}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white text-sm font-medium text-navy shadow-sm transition hover:bg-cream"
          />

          {/* Login link */}
          <p className="pt-1 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link to={loginPathForPortal(portal)} className="font-bold text-gold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
          <span>No credit card required · Free trial included.</span>
        </div>
      </div>
    </AuthLayout>
  );
}
