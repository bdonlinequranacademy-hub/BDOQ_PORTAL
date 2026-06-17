import type { SessionSlotView } from "@/types/models";

export const SCHEDULE_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

/** Parse stored schedule time for `<input type="time">` (HH:MM). */
export function toTimeInputValue(raw: string | undefined): string {
  if (!raw) return "09:00";
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "09:00";
  return `${match[1]!.padStart(2, "0")}:${match[2]}`;
}

export const CLASS_WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function groupSessionsByDay(sessions: SessionSlotView[]) {
  const map = new Map<string, SessionSlotView[]>();
  for (const day of SCHEDULE_DAYS) {
    map.set(day, []);
  }
  for (const session of sessions) {
    const list = map.get(session.day) ?? [];
    list.push(session);
    map.set(session.day, list);
  }
  return SCHEDULE_DAYS.map((day) => ({
    day,
    sessions: (map.get(day) ?? []).sort((a, b) =>
      a.times.academy.time.localeCompare(b.times.academy.time)
    ),
  }));
}

export function parseTimeSortKey(time12: string): number {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function sortSessionsByAcademyTime(sessions: SessionSlotView[]) {
  return [...sessions].sort(
    (a, b) =>
      parseTimeSortKey(a.times.academy.time) - parseTimeSortKey(b.times.academy.time)
  );
}

export function sortSessionsForTable(sessions: SessionSlotView[]) {
  return [...sessions].sort((a, b) => {
    const dayA = SCHEDULE_DAYS.indexOf(a.day as (typeof SCHEDULE_DAYS)[number]);
    const dayB = SCHEDULE_DAYS.indexOf(b.day as (typeof SCHEDULE_DAYS)[number]);
    if (dayA !== dayB) return dayA - dayB;
    return (
      parseTimeSortKey(a.times.academy.time) - parseTimeSortKey(b.times.academy.time)
    );
  });
}
