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
        "portal-card--sm rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] transition-all sm:p-5",
        onClick
          ? "cursor-pointer text-left hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_12px_28px_-14px_rgba(50,201,145,0.28)] active:scale-[0.99]"
          : "",
        className
      )}
    >
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className="flex w-full flex-col gap-3 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-gold/25 sm:size-12",
              iconBg
            )}
          >
            {icon}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-portal-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-portal-heading sm:text-[1.75rem]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1.5 text-xs font-medium text-primary">{hint}</p>
          ) : null}
        </div>
      </Wrapper>
    </Card>
  );
}
