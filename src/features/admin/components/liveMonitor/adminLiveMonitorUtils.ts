import type { LiveMonitorSession, LiveMonitorSummary } from "@/types/models";
import { formatAmPmTime } from "@/i18n/format";
import { sessionHasIssue, sessionIssueMessage } from "./liveMonitorUtils";

export type LiveMonitorDetailTab = "overview" | "participants";

export interface ILiveMonitorJoinOverview {
  teacherJoined: number;
  teacherLate: number;
  teacherNotJoined: number;
  studentJoined: number;
  studentLate: number;
  studentNotJoined: number;
  total: number;
}

export interface ILiveMonitorActivityItem {
  id: string;
  timeLabel: string;
  title: string;
  detail?: string;
  tone: "neutral" | "success" | "warning" | "danger" | "live";
}

export function computeIssueCount(summary: LiveMonitorSummary): number {
  return (
    summary.teacherLateCount +
    summary.studentNoShowCount +
    summary.teacherNoShowCount
  );
}

export function computeJoinOverview(
  sessions: LiveMonitorSession[]
): ILiveMonitorJoinOverview {
  let teacherJoined = 0;
  let teacherLate = 0;
  let teacherNotJoined = 0;
  let studentJoined = 0;
  let studentLate = 0;
  let studentNotJoined = 0;

  for (const session of sessions) {
    if (session.joins.teacherStatus === "joined") teacherJoined += 1;
    else if (session.joins.teacherStatus === "late") teacherLate += 1;
    else teacherNotJoined += 1;

    if (session.joins.studentStatus === "joined") studentJoined += 1;
    else if (session.joins.studentStatus === "late") studentLate += 1;
    else studentNotJoined += 1;
  }

  return {
    teacherJoined,
    teacherLate,
    teacherNotJoined,
    studentJoined,
    studentLate,
    studentNotJoined,
    total: sessions.length,
  };
}

export function formatLiveElapsed(session: LiveMonitorSession, nowMs: number): string {
  if (session.sessionPhase !== "live") return "—";
  const start = new Date(session.startsAt).getTime();
  const elapsedSec = Math.max(0, Math.floor((nowMs - start) / 1000));
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatTimeLabel(iso?: string): string {
  if (!iso) return "—";
  return formatAmPmTime(iso);
}

export function buildSessionActivity(
  session: LiveMonitorSession
): ILiveMonitorActivityItem[] {
  const items: ILiveMonitorActivityItem[] = [
    {
      id: `${session._id}-scheduled`,
      timeLabel: session.startTimeLabel,
      title: "Session scheduled",
      detail: `${session.day} · ${session.durationLabel}`,
      tone: "neutral",
    },
  ];

  if (session.joins.teacherJoinedAt) {
    items.push({
      id: `${session._id}-teacher`,
      timeLabel: formatTimeLabel(session.joins.teacherJoinedAt),
      title: "Teacher joined",
      detail: session.teacher.name,
      tone: session.joins.teacherStatus === "late" ? "warning" : "success",
    });
  }

  if (session.joins.studentJoinedAt) {
    items.push({
      id: `${session._id}-student`,
      timeLabel: formatTimeLabel(session.joins.studentJoinedAt),
      title: "Student joined",
      detail: session.student.name,
      tone: session.joins.studentStatus === "late" ? "warning" : "success",
    });
  }

  const issue = sessionIssueMessage(session);
  if (issue) {
    items.push({
      id: `${session._id}-issue`,
      timeLabel: "Alert",
      title: issue,
      tone: "danger",
    });
  }

  if (session.sessionPhase === "live") {
    items.push({
      id: `${session._id}-live`,
      timeLabel: "Now",
      title: "Session in progress",
      tone: "live",
    });
  }

  if (session.sessionPhase === "completed") {
    items.push({
      id: `${session._id}-done`,
      timeLabel: formatTimeLabel(session.endsAt),
      title: "Session completed",
      tone: "neutral",
    });
  }

  return items;
}

export function buildTodayActivity(
  sessions: LiveMonitorSession[]
): ILiveMonitorActivityItem[] {
  return sessions
    .flatMap((session) => buildSessionActivity(session))
    .slice(0, 12);
}

export function pickDefaultSession(
  sessions: LiveMonitorSession[]
): LiveMonitorSession | undefined {
  return (
    sessions.find((session) => session.sessionPhase === "live") ??
    sessions.find((session) => sessionHasIssue(session)) ??
    sessions[0]
  );
}

export function sessionShortCode(session: LiveMonitorSession): string {
  const source = session.student.studentId ?? session.classId;
  return source.slice(-8).toUpperCase();
}
