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
        "portal-islamic-hero rounded-xl border border-portal p-4 shadow-sm sm:rounded-2xl sm:p-6",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-primary dark:text-gold">{eyebrow}</span>
            {roleBadge ? (
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-dark dark:text-gold sm:text-xs">
                {roleBadge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-1 font-display text-xl font-bold tracking-tight text-portal-heading sm:text-2xl lg:text-3xl">
            {name}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-portal-muted sm:text-base">{subtitle}</p>
          ) : null}
        </div>

        {displayDate ? (
          <p className="shrink-0 text-left text-xs font-medium leading-relaxed text-portal-muted sm:text-right sm:text-sm">
            {displayDate}
          </p>
        ) : null}
      </div>

      {showQuote ? (
        <div className="mt-3 border-t border-portal pt-3 sm:mt-4 sm:pt-4">
          <p className="font-arabic text-base leading-loose text-primary-dark dark:text-gold/90 sm:text-lg">
            {quote.arabic}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-portal-muted sm:text-sm">
            {quote.translation}
            <span className="ml-1.5 font-medium text-gold-dark dark:text-gold">— {quote.source}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
