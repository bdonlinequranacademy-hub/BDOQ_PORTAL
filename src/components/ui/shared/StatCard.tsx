import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface IStatCardProps {
  label: string;
  value?: string | number | ReactNode;
  icon: ReactNode;
  iconBg?: string;
  hint?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg = "bg-primary/10",
  hint,
  className,
  onClick,
}: IStatCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Card
      className={cn(
        "portal-card--sm rounded-xl border border-portal/60 bg-white p-3 shadow-none transition-all sm:p-4 dark:bg-portal-surface dark:border-portal",
        onClick
          ? "cursor-pointer text-left hover:-translate-y-0.5 hover:border-portal-heading/30 hover:shadow-sm active:scale-[0.99]"
          : "",
        className
      )}
    >
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className="flex w-full flex-col gap-2 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-lg sm:size-8 [&>svg]:size-4",
              iconBg
            )}
          >
            {icon}
          </div>
        </div>
        <div className="min-w-0">
          <p className={cn(
            "font-medium uppercase tracking-wider",
            value === undefined ? "mt-2 text-xs text-portal-heading font-semibold sm:text-sm" : "mt-1 text-[10px] text-portal-muted sm:text-[11px]"
          )}>{label}</p>
          {value !== undefined && (
            <p className="mt-1 text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
              {value}
            </p>
          )}
          {hint ? (
            <p className="mt-1 text-[11px] font-medium leading-snug text-primary sm:text-xs">
              {hint}
            </p>
          ) : null}
        </div>
      </Wrapper>
    </Card>
  );
}
