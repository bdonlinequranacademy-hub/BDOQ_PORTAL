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
        "rounded-2xl border border-portal p-5 shadow-sm transition-all",
        onClick
          ? "cursor-pointer text-left hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
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
          <p className="text-xs font-medium uppercase tracking-wide text-portal-muted">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-portal-heading">{value}</p>
          {hint ? <p className="mt-1 text-[11px] text-portal-muted">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary",
            iconBg
          )}
        >
          {icon}
        </div>
      </Wrapper>
    </Card>
  );
}
