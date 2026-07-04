import type { LiveMonitorSession } from "@/types/models";

export function sessionHasIssue(session: LiveMonitorSession): boolean {
  return (
    session.alerts.teacherLate ||
    session.alerts.studentNoShow ||
    session.alerts.teacherNoShow
  );
}

export function sessionIssueMessage(session: LiveMonitorSession): string | null {
  if (session.alerts.teacherNoShow) return "Teacher did not join";
  if (session.alerts.teacherLate) return "Teacher joined late";
  if (session.alerts.studentNoShow) return "Student has not joined";
  return null;
}

export function formatSessionTiming(session: LiveMonitorSession, now: number): string {
  if (session.sessionPhase === "live") {
    const endsAt = new Date(session.endsAt).getTime();
    const mins = Math.max(1, Math.round((endsAt - now) / 60_000));
    return `${mins} min left`;
  }
  if (session.sessionPhase === "upcoming") {
    const mins = Math.max(1, Math.round(session.minutesUntilStart));
    return `Starts in ${mins} min`;
  }
  return "Completed";
}

export interface ILiveMonitorSection {
  id: string;
  label: string;
  sessions: LiveMonitorSession[];
}

export function groupLiveMonitorSessions(
  sessions: LiveMonitorSession[]
): ILiveMonitorSection[] {
  const live = sessions.filter((s) => s.sessionPhase === "live");
  const issues = sessions.filter(
    (s) => s.sessionPhase !== "live" && sessionHasIssue(s)
  );
  const upcoming = sessions.filter(
    (s) => s.sessionPhase === "upcoming" && !sessionHasIssue(s)
  );
  const completed = sessions.filter((s) => s.sessionPhase === "completed");

  return [
    { id: "live", label: "Live now", sessions: live },
    { id: "issues", label: "Needs attention", sessions: issues },
    { id: "upcoming", label: "Upcoming", sessions: upcoming },
    { id: "completed", label: "Completed", sessions: completed },
  ].filter((section) => section.sessions.length > 0);
}
