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
        "portal-card--sm rounded-[14px] border border-portal/40 bg-gradient-to-br from-white to-gray-50/80 p-3 sm:p-4 shadow-sm transition-all duration-200 dark:from-portal-surface dark:to-[var(--portal-bg)] dark:border-portal-border/60 dark:shadow-md",
        onClick
          ? "cursor-pointer text-left hover:-translate-y-1 hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
          : "",
        className
      )}
    >
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className="flex w-full items-center gap-3.5 sm:gap-4 text-left"
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11 [&>svg]:size-5 sm:[&>svg]:size-[22px] shadow-sm",
            iconBg
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-bold uppercase tracking-wider truncate",
            value === undefined ? "text-sm text-portal-heading sm:text-base" : "text-[10px] text-portal-muted sm:text-[11px]"
          )}>{label}</p>
          {value !== undefined && (
            <p className="mt-0.5 text-xl font-black tracking-tight text-portal-heading sm:text-2xl drop-shadow-sm truncate">
              {value}
            </p>
          )}
          {hint ? (
            <p className="mt-0.5 text-[11px] font-semibold leading-snug text-primary truncate sm:text-xs">
              {hint}
            </p>
          ) : null}
        </div>
      </Wrapper>
    </Card>
  );
}
