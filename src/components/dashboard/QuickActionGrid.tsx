import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface IQuickAction {
  label: string;
  icon: ReactNode;
  iconBg?: string;
  onClick: () => void;
}

interface IQuickActionGridProps {
  actions: IQuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function QuickActionGrid({
  actions,
  columns = 3,
  className,
}: IQuickActionGridProps) {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={cn("grid gap-3", colClass, className)}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="group flex flex-col gap-3 rounded-2xl border border-portal bg-portal-surface p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
        >
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl transition group-hover:scale-105",
              action.iconBg ?? "bg-primary/10"
            )}
          >
            {action.icon}
          </div>
          <span className="text-sm font-semibold leading-snug text-portal-heading">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
