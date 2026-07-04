import type { SessionPhase } from "@/types/models";

interface ILiveMonitorPhaseBadgeProps {
  phase: SessionPhase;
}

export function LiveMonitorPhaseBadge({ phase }: ILiveMonitorPhaseBadgeProps) {
  if (phase === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm dark:bg-red-500">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/80 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-white" />
        </span>
        Live
      </span>
    );
  }

  if (phase === "completed") {
    return (
      <span className="rounded-lg border border-portal bg-portal-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
        Done
      </span>
    );
  }

  return (
    <span className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary dark:border-primary/35 dark:bg-primary/15 dark:text-emerald-300">
      Upcoming
    </span>
  );
}
