import { Timer } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import {
  formatCountdown,
  getSessionCountdownLabel,
  resolveDisplayPhase,
} from "@/lib/utils/sessionTiming";
import { useSessionClock } from "@/hooks/useSessionClock";

interface SessionStatusBadgeProps {
  session: SessionSlotView;
  routineView?: boolean;
  compact?: boolean;
}

export function SessionStatusBadge({
  session,
  routineView = false,
  compact = false,
}: SessionStatusBadgeProps) {
  const now = useSessionClock();
  const phase = resolveDisplayPhase(session, now, { routineView });
  const label = getSessionCountdownLabel(session, now, { routineView });
  const endsInMs =
    session.endsAt && phase === "live"
      ? new Date(session.endsAt).getTime() - now
      : 0;

  const text =
    phase === "live" && endsInMs > 0
      ? `Live · ${formatCountdown(endsInMs)} left`
      : label;

  if (phase === "live") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-red-500 font-bold uppercase tracking-wide text-white ${
          compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[10px]"
        }`}
      >
        <span className="size-1.5 animate-pulse rounded-full bg-white" />
        Session live
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium ${
        phase === "completed"
          ? "bg-zinc-100 text-zinc-500"
          : phase === "scheduled"
            ? "bg-[#FDF3E0] text-[#9A6B1A]"
            : "bg-[#F8FAFF] text-[#03214F]"
      } ${compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"}`}
    >
      {phase !== "scheduled" ? <Timer className="size-3 shrink-0" /> : null}
      {text}
    </span>
  );
}
