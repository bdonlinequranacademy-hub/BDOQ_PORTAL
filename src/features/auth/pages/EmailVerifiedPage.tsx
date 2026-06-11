import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Calendar, Globe, Shield, Star } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { homePathForRole } from "@/lib/utils/roles";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function EmailVerifiedPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const dashboardPath = user ? homePathForRole(user.role) : "/login";

  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-6 py-4">
        {/* Brand */}
        <div className="mb-12 flex items-center justify-center">
          <BrandLogo size="md" />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* Illustration */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="flex size-40 items-center justify-center rounded-full bg-[#FDF3E0]">
              <BadgeCheck className="size-20 text-gold" strokeWidth={1.5} aria-hidden="true" />
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-1 left-8 size-2 rounded-full bg-gold" />
            <div className="absolute right-3 top-2">
              <svg className="size-5 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 2l.618 1.902L12.5 4l-1.48 1.078.562 1.922L10 5.926l-1.582 1.074.562-1.922L7.5 4l1.882-.098z" />
              </svg>
            </div>
            <div className="absolute bottom-4 left-1">
              <svg className="size-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 2l.618 1.902L12.5 4l-1.48 1.078.562 1.922L10 5.926l-1.582 1.074.562-1.922L7.5 4l1.882-.098z" />
              </svg>
            </div>
            <div className="absolute -right-2 top-6 size-1.5 rounded-full bg-gold" />
            <div className="absolute bottom-2 right-6 size-2 rounded-full bg-gold/70" />
          </div>

          <h1 className="mb-4 text-center font-display text-3xl font-bold text-navy">
            Email Verified!
          </h1>
          <p className="mb-8 px-2 text-center text-sm leading-relaxed text-zinc-500">
            Welcome to Al Bayaan Academy. Your account is ready and your child's
            learning journey begins now.
          </p>

          {/* Account info card */}
          <div className="mb-8 w-full rounded-xl bg-[#EEF2F8] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield className="size-4 shrink-0 text-navy" aria-hidden="true" />
              <span className="text-xs text-navy">
                Account Holder: {user?.name ?? "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 shrink-0 text-navy" aria-hidden="true" />
              <span className="text-xs text-navy">{user?.email ?? "—"}</span>
            </div>
          </div>

          {/* CTAs */}
          <button
            onClick={() => navigate(dashboardPath, { replace: true })}
            className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white transition hover:bg-navy-500"
          >
            Go to My Dashboard
            <span aria-hidden="true">→</span>
          </button>
          <Link
            to="https://albayaan.com/book-trial"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gold text-sm font-semibold text-gold transition hover:bg-gold/5"
          >
            <Calendar className="size-4" aria-hidden="true" />
            Book My Free Trial Class
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex items-center justify-center gap-6 pt-2">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-[11px] text-zinc-400">Secure Account</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-[11px] text-zinc-400">12K+ Families</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span className="text-[11px] text-zinc-400">45+ Countries</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
