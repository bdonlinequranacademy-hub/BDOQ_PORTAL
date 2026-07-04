import { Radio } from "lucide-react";
import type { LiveMonitorSummary } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface ILiveMonitorBannerProps {
  summary: LiveMonitorSummary;
  onOpenMonitor?: () => void;
  compact?: boolean;
}

export function LiveMonitorBanner({
  summary,
  onOpenMonitor,
  compact = false,
}: ILiveMonitorBannerProps) {
  const issueCount = summary.teacherLateCount + summary.studentNoShowCount;
  const isLive = summary.liveCount > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm sm:p-5",
        isLive
          ? "border-red-500/30 bg-gradient-to-r from-red-500/10 via-portal-surface to-orange-500/5 dark:from-red-500/15 dark:to-orange-500/10"
          : "border-portal bg-portal-surface"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              isLive
                ? "bg-red-500/15 text-red-600 dark:text-red-400"
                : "bg-portal-surface-muted text-portal-muted"
            )}
          >
            <Radio className={cn("size-5", isLive && "animate-pulse")} aria-hidden />
          </div>
          <div>
            <p className="font-semibold text-portal-heading">
              {isLive
                ? `${summary.liveCount} class${summary.liveCount === 1 ? "" : "es"} live now`
                : "No live classes right now"}
            </p>
            <p className="mt-0.5 text-sm text-portal-muted">
              {summary.upcomingCount} upcoming · {summary.totalToday} total today
              {summary.day ? ` · ${summary.day}` : ""}
              {issueCount > 0 ? (
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  {" "}
                  · {issueCount} issue{issueCount === 1 ? "" : "s"}
                </span>
              ) : null}
            </p>
            {!compact ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-300">
                  Live {summary.liveCount}
                </span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary dark:text-emerald-300">
                  Upcoming {summary.upcomingCount}
                </span>
                <span className="rounded-full border border-portal bg-portal-surface-muted px-2.5 py-0.5 text-[11px] font-semibold text-portal-muted">
                  Done {summary.completedCount}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {onOpenMonitor ? (
          <button
            type="button"
            onClick={onOpenMonitor}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",
              isLive
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                : "bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-500"
            )}
          >
            Open monitor →
          </button>
        ) : null}
      </div>
    </div>
  );
}
