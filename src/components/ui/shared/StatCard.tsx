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
        "rounded-xl border border-portal p-4 shadow-sm transition-all sm:rounded-2xl sm:p-5",
        onClick
          ? "cursor-pointer text-left hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md active:scale-[0.99]"
          : "hover:shadow-md",
        className
      )}
    >
      <Wrapper
        type={onClick ? "button" : undefined}
        onClick={onClick}
        className="flex w-full items-start justify-between gap-3"
      >
        <div className="min-w-0 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-portal-muted sm:text-xs">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-portal-heading sm:mt-2 sm:text-2xl">{value}</p>
          {hint ? <p className="mt-1 text-xs text-portal-muted sm:text-[11px]">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl text-primary sm:size-11",
            iconBg
          )}
        >
          {icon}
        </div>
      </Wrapper>
    </Card>
  );
}
