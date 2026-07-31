import { CalendarDays, Timer } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import {
  formatCountdown,
  getSessionCountdownLabel,
  resolveDisplayPhase,
} from "@/lib/utils/sessionTiming";
import { useSessionClock } from "@/hooks/useSessionClock";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

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
  const { t } = usePortalTranslation();
  const now = useSessionClock();
  const labels = {
    inProgress: t("session.inProgress"),
    finished: t("session.finished"),
    scheduled: t("session.scheduled"),
    startsIn: (time: string) => t("session.startsIn", { time }),
    startingNow: t("session.startingNow"),
    weeklyDay: (day: string) => t("session.weeklyDay", { day }),
    timeLeft: (time: string) => t("session.timeLeft", { time }),
  };
  const phase = resolveDisplayPhase(session, now, { routineView });
  const label = getSessionCountdownLabel(session, now, { routineView, compact }, labels);
  const endsInMs =
    session.endsAt && phase === "live"
      ? new Date(session.endsAt).getTime() - now
      : 0;

  const text =
    phase === "live" && endsInMs > 0
      ? labels.timeLeft(formatCountdown(endsInMs))
      : label;

  const sizeClass = compact
    ? "gap-1 px-2 py-1 text-[10px] leading-none"
    : "gap-1.5 px-2.5 py-1 text-[11px]";

  if (phase === "live") {
    return (
      <span
        className={`inline-flex shrink-0 items-center rounded-md bg-red-500 font-bold uppercase tracking-wide text-white shadow-sm ${sizeClass}`}
      >
        <span className="size-1.5 animate-pulse rounded-full bg-white" />
        {t("session.live")}
      </span>
    );
  }

  if (phase === "completed") {
    return (
      <span
        className={`inline-flex shrink-0 items-center rounded-md border border-portal bg-portal-muted font-medium text-portal-muted ${sizeClass}`}
      >
        {t("session.done")}
      </span>
    );
  }

  if (phase === "scheduled" && routineView) {
    return (
      <span
        className={`inline-flex shrink-0 items-center rounded-md border border-primary/15 bg-primary/10 font-semibold text-primary ${sizeClass}`}
      >
        <CalendarDays className="size-3 shrink-0 opacity-70" aria-hidden />
        {text}
      </span>
    );
  }

  if (phase === "scheduled") {
    return (
      <span
        className={`inline-flex shrink-0 items-center rounded-md border border-primary/15 bg-primary/10 font-semibold text-primary ${sizeClass}`}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border border-portal bg-portal-muted font-medium text-portal-heading ${sizeClass}`}
    >
      <Timer className="size-3 shrink-0 text-portal-muted" aria-hidden />
      {text}
    </span>
  );
}
