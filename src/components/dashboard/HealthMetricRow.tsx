import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface IHealthMetric {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: "primary" | "teal" | "gold";
}

interface IHealthMetricRowProps {
  metrics: IHealthMetric[];
}

const toneBg = {
  primary: "bg-primary/10 text-primary",
  teal: "bg-teal/10 text-teal",
  gold: "bg-gold/15 text-gold",
};

export function HealthMetricRow({ metrics }: IHealthMetricRowProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex items-center gap-3 rounded-xl border border-portal bg-portal-muted p-4"
        >
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              toneBg[m.tone ?? "primary"]
            )}
          >
            {m.icon}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-portal-muted">
              {m.label}
            </p>
            <p className="text-xl font-bold text-portal-heading">{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
