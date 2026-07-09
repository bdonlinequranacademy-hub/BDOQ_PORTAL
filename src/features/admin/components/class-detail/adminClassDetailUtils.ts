import type { ClassSchedule } from "@/types/models";
import { formatDuration, primaryScheduleEntry } from "@/lib/utils/class";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type AdminClassDetailTab = "overview" | "schedule" | "students" | "attendance" | "activity";

export function formatClassCreatedAt(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getNextScheduleInfo(schedule?: ClassSchedule | null): {
  label: string;
  hint: string;
} | null {
  const entry = primaryScheduleEntry(schedule ?? undefined);
  if (!entry?.day) return null;

  const targetIndex = WEEK_DAYS.findIndex(
    (day) => day.toLowerCase() === entry.day.toLowerCase()
  );
  if (targetIndex === -1) return null;

  const now = new Date();
  let diff = targetIndex - now.getDay();
  if (diff <= 0) diff += 7;

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + diff);

  const label =
    diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : `${diff} days`;

  const dateLabel = nextDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeLabel = entry.time ? ` · ${entry.time}` : "";
  const durationLabel = entry.duration ? ` · ${formatDuration(entry.duration)}` : "";

  return {
    label,
    hint: `${dateLabel}${timeLabel}${durationLabel}`,
  };
}

export function getUpcomingScheduleSessions(
  schedule?: ClassSchedule | null,
  count = 3
): { date: Date; dayLabel: string; time?: string }[] {
  const entry = primaryScheduleEntry(schedule ?? undefined);
  if (!entry?.day) return [];

  const targetIndex = WEEK_DAYS.findIndex(
    (day) => day.toLowerCase() === entry.day.toLowerCase()
  );
  if (targetIndex === -1) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let diff = targetIndex - today.getDay();
  if (diff < 0) diff += 7;

  const sessions: { date: Date; dayLabel: string; time?: string }[] = [];

  for (let index = 0; index < count; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + diff + index * 7);

    sessions.push({
      date,
      dayLabel: date
        .toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
        .toUpperCase(),
      time: entry.time,
    });
  }

  return sessions;
}

export function scheduleRepeatLabel(schedule?: ClassSchedule | null): string {
  const entry = primaryScheduleEntry(schedule ?? undefined);
  if (!entry?.day) return "Not scheduled";
  return entry.repeatWeekly === false ? "One-time session" : "Weekly recurring";
}
