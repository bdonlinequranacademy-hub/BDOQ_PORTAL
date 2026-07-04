import { cn } from "@/lib/utils/cn";

interface IProgressMeterProps {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  hint?: string;
  className?: string;
}

export function ProgressMeter({
  label,
  value,
  max = 100,
  suffix = "%",
  hint,
  className,
}: IProgressMeterProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm text-portal-muted">{label}</span>
        <span className="text-2xl font-bold text-portal-heading">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-portal-muted">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
      {hint ? <p className="text-xs text-portal-muted">{hint}</p> : null}
    </div>
  );
}
