import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface IStatCardProps {
  label: string;
  value: string | number;
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
        "portal-card--sm rounded-[8px] border border-portal bg-portal-surface p-3 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] transition-all sm:p-3.5",
        onClick
          ? "cursor-pointer text-left hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_12px_28px_-14px_rgba(50,201,145,0.28)] active:scale-[0.99]"
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
              "flex size-8 shrink-0 items-center justify-center rounded-[8px] ring-1 ring-gold/25 sm:size-9",
              iconBg
            )}
          >
            {icon}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-portal-muted sm:text-sm">{label}</p>
          <p className="mt-0.5 text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
            {value}
          </p>
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
