import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { homePathForRole, matchesAdminRoute } from "@/lib/utils/roles";
import { loginPathForPortal, registerPathForPortal, type PortalIntent } from "@/lib/portalAuth";
import type { Role } from "@/types/models";
import { cn } from "@/lib/utils/cn";

type PortalCardConfig = {
  role: PortalIntent;
  label: string;
  tagline: string;
  desc: string;
  icon: LucideIcon;
  features: string[];
  accentBar: string;
  iconWrap: string;
  ringHover: string;
};

const PORTALS: PortalCardConfig[] = [
  {
    role: "student",
    label: "Student",
    tagline: "Learners & guardians",
    desc: "One account for classes, homework, Quran progress, and weekly family reports.",
    icon: GraduationCap,
    features: ["Live classes", "Homework & curriculum", "Progress tracking"],
    accentBar: "from-teal-500 to-emerald-600",
    iconWrap: "bg-teal-50 text-teal-700 ring-teal-100",
    ringHover: "group-hover:ring-teal-200/80",
  },
  {
    role: "teacher",
    label: "Teacher",
    tagline: "Academy staff",
    desc: "Manage classes, attendance, grading, and verified weekly reports.",
    icon: BookOpen,
    features: ["Class management", "Attendance & logs", "Weekly family reports"],
    accentBar: "from-blue-500 to-indigo-600",
    iconWrap: "bg-blue-50 text-blue-700 ring-blue-100",
    ringHover: "group-hover:ring-blue-200/80",
  },
  {
    role: "admin",
    label: "Admin",
    tagline: "Academy operations",
    desc: "Users, curriculum, classes, trial leads, and academy-wide analytics.",
    icon: Shield,
    features: ["User management", "Curriculum & classes", "Analytics & reports"],
    accentBar: "from-[#03214F] to-[#1A4A8A]",
    iconWrap: "bg-navy-50 text-navy ring-navy-100",
    ringHover: "group-hover:ring-navy-200/80",
  },
];

function portalLinkForUser(
  portal: PortalIntent,
  isAuthenticated: boolean,
  user: { role: Role } | null
): { href: string; cta: string } {
  const matches =
    isAuthenticated &&
    user &&
    (portal === "admin" ? matchesAdminRoute(user.role) : user.role === portal);

  if (matches && user) {
    return { href: homePathForRole(user.role), cta: "Open dashboard" };
  }
  return { href: loginPathForPortal(portal), cta: "Sign in" };
}

function PortalCard({
  config,
  isAuthenticated,
  user,
}: {
  config: PortalCardConfig;
  isAuthenticated: boolean;
  user: { role: Role } | null;
}) {
  const Icon = config.icon;
  const { href, cta } = portalLinkForUser(config.role, isAuthenticated, user);

  return (
    <Link
      to={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[var(--portal-card-shadow)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-gold/30 hover:shadow-[var(--portal-card-shadow-hover)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--portal-bg)]",
        "dark:border-zinc-700/60 dark:bg-portal-surface"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90 transition-opacity group-hover:opacity-100",
          config.accentBar
        )}
        aria-hidden
      />

      <div className="mb-5 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-105",
            config.iconWrap,
            config.ringHover
          )}
        >
          <Icon className="size-6" strokeWidth={1.75} aria-hidden />
        </div>
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {config.tagline}
        </span>
      </div>

      <h3 className="text-xl font-bold text-portal-heading">{config.label}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {config.desc}
      </p>

      <ul className="mt-5 space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-700/60">
        {config.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <Sparkles className="size-3.5 shrink-0 text-gold" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
          "bg-navy text-white group-hover:bg-[#021a3d]",
          "dark:bg-gold dark:text-navy dark:group-hover:bg-gold-light"
        )}
      >
        {cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function PortalHomePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = Boolean(token && user);

  return (
    <div className="relative min-h-screen overflow-hidden bg-portal">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(196,146,43,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 size-72 rounded-full bg-navy/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-24 size-64 rounded-full bg-gold/[0.06] blur-3xl"
        aria-hidden
      />

      <header className="relative border-b border-portal bg-portal-header/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-portal-heading">Al Bayaan Academy</p>
              <p className="text-xs text-zinc-500">Secure learning portal</p>
            </div>
          </div>
          {isAuthenticated && user ? (
            <Link to={homePathForRole(user.role)}>
              <Button className="gap-2 rounded-xl bg-navy px-5 text-white shadow-sm hover:bg-[#021a3d]">
                <LayoutDashboard className="size-4" />
                My dashboard
              </Button>
            </Link>
          ) : (
            <Link to={loginPathForPortal("student")}>
              <Button
                variant="ghost"
                className="gap-2 rounded-xl border border-zinc-200 bg-white text-navy shadow-sm hover:border-gold/40 hover:bg-cream"
              >
                <LogIn className="size-4" />
                Quick sign in
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
            <Users className="size-3.5" aria-hidden />
            Choose your portal
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-portal-heading sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Welcome to your academy portal
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Select the role that matches your account. Students and guardians share one login;
            teachers and admins use credentials issued by the academy.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {PORTALS.map((portal) => (
            <PortalCard
              key={portal.role}
              config={portal}
              isAuthenticated={isAuthenticated}
              user={user}
            />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center sm:mt-16">
          <p className="text-sm text-zinc-500">
            New student?{" "}
            <Link
              to={registerPathForPortal("student")}
              className="font-semibold text-gold hover:text-gold-dark hover:underline"
            >
              Create a student account
            </Link>
          </p>
          <p className="max-w-md text-xs leading-relaxed text-zinc-400">
            Teacher and admin accounts are created by your academy administrator — not through
            public registration.
          </p>
        </div>
      </main>
    </div>
  );
}
