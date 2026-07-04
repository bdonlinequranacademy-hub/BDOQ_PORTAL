import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface IDashboardSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function DashboardSection({
  title,
  subtitle,
  badge,
  actionLabel,
  onAction,
  children,
  className,
  elevated = false,
}: IDashboardSectionProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-4 rounded-2xl border-0 p-5 sm:p-6",
        elevated
          ? "shadow-[var(--portal-card-shadow,0_10px_30px_-12px_rgba(3,33,79,0.18))]"
          : "shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-portal-heading">{title}</h2>
            {badge ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {badge}
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-portal-muted">{subtitle}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-gold hover:underline"
          >
            {actionLabel}
            <ChevronRight className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
