import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  LogIn,
  Shield,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { homePathForRole } from "@/lib/utils/roles";
import { LOGIN_PATH, REGISTER_PATH } from "@/lib/authMessages";
import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { cn } from "@/lib/utils/cn";

type PortalCardConfig = {
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
    label: "Student",
    tagline: "Learners & guardians",
    desc: "One account for classes, homework, Quran progress, and weekly family reports.",
    icon: GraduationCap,
    features: ["Live classes", "Homework & curriculum", "Progress tracking"],
    accentBar: "from-primary to-teal",
    iconWrap: "bg-bg-light text-primary ring-primary/20",
    ringHover: "group-hover:ring-primary/30",
  },
  {
    label: "Teacher",
    tagline: "Academy staff",
    desc: "Manage classes, attendance, grading, and verified weekly reports.",
    icon: BookOpen,
    features: ["Class management", "Attendance & logs", "Weekly family reports"],
    accentBar: "from-teal to-teal-accent",
    iconWrap: "bg-teal/10 text-teal ring-teal/20",
    ringHover: "group-hover:ring-teal/30",
  },
  {
    label: "Admin",
    tagline: "Academy operations",
    desc: "Users, curriculum, classes, trial leads, and academy-wide analytics.",
    icon: Shield,
    features: ["User management", "Curriculum & classes", "Analytics & reports"],
    accentBar: "from-primary-dark to-primary",
    iconWrap: "bg-primary/10 text-primary ring-primary/20",
    ringHover: "group-hover:ring-primary/30",
  },
];

function PortalCard({ config }: { config: PortalCardConfig }) {
  const Icon = config.icon;

  return (
    <Link
      to={LOGIN_PATH}
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
          "bg-primary text-white group-hover:bg-primary-dark",
          "dark:bg-gold dark:text-primary-dark dark:group-hover:bg-gold-light"
        )}
      >
        Sign in
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function PortalHomePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  if (token && user) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden portal-page-bg">
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
          <div>
            <p className="text-sm font-semibold text-portal-heading">{BDOQ_BRAND.shortName}</p>
            <p className="text-xs text-zinc-500">{BDOQ_BRAND.tagline}</p>
          </div>
          <Link to={LOGIN_PATH}>
            <Button
              variant="ghost"
              className="gap-2 border border-gray-200 bg-white text-primary-dark shadow-sm hover:border-primary/30 hover:bg-bg-light"
            >
              <LogIn className="size-4" />
              Quick sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
            <Sparkles className="size-3.5 text-gold" aria-hidden />
            Assalamu Alaikum
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-portal-heading sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Welcome to {BDOQ_BRAND.shortName}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {BDOQ_BRAND.portalTagline}. Students and guardians share one login; teachers and
            admins use credentials issued by BDOQ Academy.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {PORTALS.map((portal) => (
            <PortalCard key={portal.label} config={portal} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 text-center sm:mt-16">
          <p className="text-sm text-zinc-500">
            New student?{" "}
            <Link
              to={REGISTER_PATH}
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
