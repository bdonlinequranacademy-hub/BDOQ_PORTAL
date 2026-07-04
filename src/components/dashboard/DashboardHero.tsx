import { cn } from "@/lib/utils/cn";

interface IDashboardHeroProps {
  eyebrow?: string;
  name: string;
  subtitle?: string;
  dateLabel?: string;
  roleBadge?: string;
  className?: string;
}

export function DashboardHero({
  eyebrow = "Assalamu Alaikum,",
  name,
  subtitle,
  dateLabel,
  roleBadge,
  className,
}: IDashboardHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-portal-surface via-portal-bg to-primary/5 p-5 shadow-sm dark:border-portal-border sm:p-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-portal-muted">{eyebrow}</span>
            {roleBadge ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark">
                {roleBadge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-portal-heading sm:text-3xl">
            {name}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-portal-muted">{subtitle}</p>
          ) : null}
        </div>
        {dateLabel ? (
          <p className="shrink-0 text-sm font-medium text-portal-muted">{dateLabel}</p>
        ) : null}
      </div>
    </div>
  );
}
