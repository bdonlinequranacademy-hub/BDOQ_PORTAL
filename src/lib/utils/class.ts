import type {
  AdminClass,
  ClassSchedule,
  PopulatedUserRef,
  ScheduleEntry,
} from "@/types/models";

export function classTitle(cls: { title?: string; name?: string }) {
  return cls.title ?? cls.name ?? "Untitled class";
}

export function teacherName(
  teacher: PopulatedUserRef | string | undefined
): string {
  if (!teacher) return "—";
  if (typeof teacher === "string") return "Teacher";
  return teacher.name;
}

export function studentList(
  students: PopulatedUserRef[] | string[] | undefined
): PopulatedUserRef[] {
  if (!students?.length) return [];
  if (typeof students[0] === "string") return [];
  return students as PopulatedUserRef[];
}

export function studentCount(cls: AdminClass & { students?: unknown[] }) {
  if (!cls.students?.length) return 0;
  if (typeof cls.students[0] === "string") return cls.students.length;
  return studentList(cls.students as PopulatedUserRef[]).length;
}

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export function getTodayWeekDay(): WeekDay {
  return WEEK_DAYS[new Date().getDay()];
}

export function isTodayScheduleDay(day?: string): boolean {
  if (!day) return false;
  return day.toLowerCase() === getTodayWeekDay().toLowerCase();
}

export type ScheduleLike =
  | ClassSchedule
  | ScheduleEntry
  | { day: string; time: string; duration?: number; repeatWeekly?: boolean }
  | ScheduleEntry[]
  | ClassSchedule[]
  | undefined;

export function primaryScheduleEntry(schedule?: ScheduleLike): ClassSchedule | undefined {
  if (!schedule) return undefined;
  if (Array.isArray(schedule)) {
    const first = schedule[0];
    return first
      ? {
          day: first.day,
          time: first.time,
          duration: (first as ClassSchedule).duration,
          repeatWeekly: (first as ClassSchedule).repeatWeekly,
        }
      : undefined;
  }
  return schedule as ClassSchedule;
}

export function formatScheduleLine(schedule?: ScheduleLike): string | null {
  const entry = primaryScheduleEntry(schedule);
  if (!entry?.day || !entry?.time) return null;
  const duration = entry.duration ? ` · ${formatDuration(entry.duration)}` : "";
  if (entry.repeatWeekly === false) {
    return `One ${entry.day} · ${entry.time}${duration}`;
  }
  return `Every ${entry.day} · ${entry.time}${duration}`;
}

export function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function classesScheduledToday<T extends { schedule?: ScheduleLike }>(classes: T[]): T[] {
  return classes.filter((c) => isTodayScheduleDay(primaryScheduleEntry(c.schedule)?.day));
}
