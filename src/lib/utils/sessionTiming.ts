import type { SessionPhase, SessionSlotView } from "@/types/models";

export const ACADEMY_TIMEZONE = "Asia/Dhaka";

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

export function formatCountdown(ms: number): string {  if (ms <= 0) return "00:00:00";
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
  options?: { routineView?: boolean }
): string {
  if (options?.routineView && !isSessionToday(session, new Date(nowMs))) {
    return `Weekly · ${session.day}`;
  }

  const phase = resolveSessionPhase(session, nowMs);
  if (phase === "live") return "Session in progress";
  if (phase === "completed") return "Session finished";
  if (!session.startsAt) return "Scheduled";
  const ms = new Date(session.startsAt).getTime() - nowMs;
  return ms > 0 ? `Starts in ${formatCountdown(ms)}` : "Starting now";
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
