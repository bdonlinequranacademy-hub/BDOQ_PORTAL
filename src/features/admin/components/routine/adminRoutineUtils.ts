import type { SessionSlotView } from "@/types/models";
import {
  getAcademyWeekday,
  resolveDisplayPhase,
  resolveSessionPhase,
} from "@/lib/utils/sessionTiming";
import { groupSessionsByDay, SCHEDULE_DAYS } from "@/lib/utils/schedule";

export type AdminRoutineStatusFilter = "" | "live" | "upcoming" | "scheduled" | "completed";

export interface IAdminRoutineStats {
  total: number;
  activeDays: number;
  liveNow: number;
  upcomingToday: number;
  uniqueStudents: number;
  scheduledWeekly: number;
  completedToday: number;
}

export interface IAdminRoutineFilters {
  courseType: string;
  teacherId: string;
  country: string;
  status: AdminRoutineStatusFilter;
  day: "" | (typeof SCHEDULE_DAYS)[number];
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function computeAdminRoutineStats(
  sessions: SessionSlotView[],
  nowMs: number
): IAdminRoutineStats {
  const today = getAcademyWeekday(new Date(nowMs));
  let liveNow = 0;
  let upcomingToday = 0;
  let completedToday = 0;
  let scheduledWeekly = 0;

  for (const session of sessions) {
    if (session.day === today) {
      const phase = resolveSessionPhase(session, nowMs);
      if (phase === "live") liveNow += 1;
      else if (phase === "upcoming") upcomingToday += 1;
      else if (phase === "completed") completedToday += 1;
    } else {
      scheduledWeekly += 1;
    }
  }

  const activeDays = groupSessionsByDay(sessions).filter((group) => group.sessions.length > 0).length;
  const uniqueStudents = new Set(sessions.map((session) => session.student._id)).size;

  return {
    total: sessions.length,
    activeDays,
    liveNow,
    upcomingToday,
    uniqueStudents,
    scheduledWeekly,
    completedToday,
  };
}

export function extractCourseTypeOptions(sessions: SessionSlotView[]): string[] {
  const types = new Set<string>();
  for (const session of sessions) {
    if (session.courseType?.trim()) types.add(session.courseType.trim());
  }
  return [...types].sort((a, b) => a.localeCompare(b));
}

export function filterAdminRoutineSessions(
  sessions: SessionSlotView[],
  filters: IAdminRoutineFilters,
  nowMs: number
): SessionSlotView[] {
  return sessions.filter((session) => {
    if (filters.courseType && session.courseType !== filters.courseType) return false;
    if (filters.teacherId && session.teacher._id !== filters.teacherId) return false;
    if (filters.country) {
      const studentCountry = session.student.country?.trim();
      const teacherCountry = session.teacher.country?.trim();
      if (studentCountry !== filters.country && teacherCountry !== filters.country) return false;
    }
    if (filters.day && session.day !== filters.day) return false;
    if (filters.status) {
      const phase = resolveDisplayPhase(session, nowMs, { routineView: true });
      if (phase !== filters.status) return false;
    }
    return true;
  });
}

export function countSessionsByDay(sessions: SessionSlotView[]): Record<string, number> {
  const counts: Record<string, number> = { all: sessions.length };
  for (const day of SCHEDULE_DAYS) {
    counts[day] = sessions.filter((session) => session.day === day).length;
  }
  return counts;
}

export function getTodayRoutineSessions(
  sessions: SessionSlotView[],
  nowMs: number
): SessionSlotView[] {
  const today = getAcademyWeekday(new Date(nowMs));
  return sessions
    .filter((session) => session.day === today)
    .sort((a, b) => a.times.academy.time.localeCompare(b.times.academy.time));
}

export function exportRoutineFile(sessions: SessionSlotView[]): void {
  const filename = `academy-routine-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    "Day",
    "BD Time",
    "Student Time",
    "Teacher Time",
    "Class",
    "Course Type",
    "Duration",
    "Student",
    "Student Country",
    "Teacher",
    "Teacher Country",
  ];
  const lines = [
    header.join(","),
    ...sessions.map((session) =>
      [
        csvEscape(session.day),
        csvEscape(session.times.academy.time),
        csvEscape(session.times.student.time),
        csvEscape(session.times.teacher.time),
        csvEscape(session.classTitle),
        csvEscape(session.courseType),
        csvEscape(session.durationLabel),
        csvEscape(session.student.name),
        csvEscape(session.student.country ?? ""),
        csvEscape(session.teacher.name),
        csvEscape(session.teacher.country ?? ""),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
