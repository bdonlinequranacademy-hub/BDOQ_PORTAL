import type { SessionPhase, SessionSlotView } from "@/types/models";

export const ACADEMY_TIMEZONE = "Asia/Dhaka";

export interface ISessionTimingLabels {
  inProgress: string;
  finished: string;
  scheduled: string;
  startsIn: (time: string) => string;
  startingNow: string;
  weeklyDay: (day: string) => string;
  timeLeft: (time: string) => string;
}

export function getAcademyWeekday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: ACADEMY_TIMEZONE,
  }).format(now);
}

export function isSessionToday(
  session: Pick<SessionSlotView, "day">,
  now = new Date()
): boolean {
  return session.day === getAcademyWeekday(now);
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function resolveSessionPhase(
  session: Pick<SessionSlotView, "sessionPhase" | "startsAt" | "endsAt">,
  nowMs: number
): SessionPhase {
  if (session.startsAt && session.endsAt) {
    const start = new Date(session.startsAt).getTime();
    const end = new Date(session.endsAt).getTime();
    if (nowMs < start) return "upcoming";
    if (nowMs < end) return "live";
    return "completed";
  }
  return session.sessionPhase ?? "upcoming";
}

export function getSessionCountdownLabel(
  session: Pick<SessionSlotView, "sessionPhase" | "startsAt" | "endsAt" | "day">,
  nowMs: number,
  options?: { routineView?: boolean; compact?: boolean },
  labels?: ISessionTimingLabels
): string {
  const L = labels ?? {
    inProgress: "Session in progress",
    finished: "Session finished",
    scheduled: "Scheduled",
    startsIn: (time) => `Starts in ${time}`,
    startingNow: "Starting now",
    weeklyDay: (day) => `Weekly · ${day}`,
    timeLeft: (time) => `${time} left`,
  };

  if (options?.routineView && !isSessionToday(session, new Date(nowMs))) {
    if (options.compact) {
      return session.day.slice(0, 3);
    }
    return L.weeklyDay(session.day);
  }

  const phase = resolveSessionPhase(session, nowMs);
  if (phase === "live") return L.inProgress;
  if (phase === "completed") return L.finished;
  if (!session.startsAt) return L.scheduled;
  const ms = new Date(session.startsAt).getTime() - nowMs;
  return ms > 0 ? L.startsIn(formatCountdown(ms)) : L.startingNow;
}

export function resolveDisplayPhase(
  session: Pick<SessionSlotView, "sessionPhase" | "startsAt" | "endsAt" | "day">,
  nowMs: number,
  options?: { routineView?: boolean }
): SessionPhase | "scheduled" {
  if (options?.routineView && !isSessionToday(session, new Date(nowMs))) {
    return "scheduled";
  }
  return resolveSessionPhase(session, nowMs);
}

export function countSessionsByPhase(
  sessions: SessionSlotView[],
  nowMs: number
): { total: number; upcoming: number; live: number; completed: number } {
  let upcoming = 0;
  let live = 0;
  let completed = 0;
  for (const session of sessions) {
    const phase = resolveSessionPhase(session, nowMs);
    if (phase === "live") live += 1;
    else if (phase === "completed") completed += 1;
    else upcoming += 1;
  }
  return { total: sessions.length, upcoming, live, completed };
}
