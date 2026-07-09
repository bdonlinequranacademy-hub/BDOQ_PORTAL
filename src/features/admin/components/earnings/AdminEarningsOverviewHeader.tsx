import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { formatMonthLabel } from "@/lib/utils/month";
import { cn } from "@/lib/utils/cn";

interface IAdminEarningsOverviewHeaderProps {
  month: string;
  onMonthChange: (month: string) => void;
  onExport: () => void;
}

export function AdminEarningsOverviewHeader({
  month,
  onMonthChange,
  onExport,
}: IAdminEarningsOverviewHeaderProps) {
  return (
    <div className="portal-card-islamic relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8 sm:py-8">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-56 rounded-full bg-primary/8 blur-2xl sm:size-72"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[min(100%,42rem)] -translate-x-1/2 opacity-[0.14] sm:h-40"
        style={{
          backgroundImage: "url('/brand/islamic-shape-bg.png')",
          backgroundSize: "contain",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Teacher pay
          </p>
          <h1 className="portal-page-title mt-1 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Earnings Overview
          </h1>
          <p className="portal-page-subtitle mt-2 max-w-2xl text-sm text-portal-muted sm:text-base">
            Verified pay comes from approved class logs — {formatMonthLabel(month)}.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="month"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            className={cn(formControlClass, "h-10 min-h-10 w-full py-2 text-sm shadow-none sm:w-auto")}
            aria-label="Select month"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm"
          >
            <Download className="size-4" aria-hidden />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
