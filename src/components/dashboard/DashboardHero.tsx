import { cn } from "@/lib/utils/cn";
import { dailyPortalQuote, hijriDateLabel } from "@/lib/islamicPortal";

interface IDashboardHeroProps {
  eyebrow?: string;
  name: string;
  subtitle?: string;
  dateLabel?: string;
  roleBadge?: string;
  showQuote?: boolean;
  className?: string;
}

export function DashboardHero({
  eyebrow = "Assalamu Alaikum,",
  name,
  subtitle,
  dateLabel,
  roleBadge,
  showQuote = true,
  className,
}: IDashboardHeroProps) {
  const quote = dailyPortalQuote();
  const hijri = hijriDateLabel();
  const displayDate = [dateLabel, hijri].filter(Boolean).join(" · ");

  return (
    <div
      className={cn(
        "portal-islamic-hero relative overflow-hidden rounded-2xl border border-primary/15 p-5 shadow-sm dark:border-portal-border sm:p-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-gold/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 left-1/3 size-28 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-primary dark:text-gold">{eyebrow}</span>
            {roleBadge ? (
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark dark:text-gold">
                {roleBadge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-portal-heading sm:text-3xl">
            {name}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-portal-muted">{subtitle}</p>
          ) : null}
        </div>

        {displayDate ? (
          <p className="shrink-0 text-right text-xs font-medium leading-relaxed text-portal-muted sm:text-sm">
            {displayDate}
          </p>
        ) : null}
      </div>

      {showQuote ? (
        <div className="relative mt-4 border-t border-primary/10 pt-4 dark:border-portal-border">
          <p className="font-arabic text-lg leading-loose text-primary-dark dark:text-gold/90">
            {quote.arabic}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-portal-muted">
            {quote.translation}
            <span className="ml-1.5 font-medium text-gold-dark dark:text-gold">— {quote.source}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
