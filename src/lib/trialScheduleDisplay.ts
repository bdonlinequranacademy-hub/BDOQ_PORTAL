const BD_TIMEZONE = "Asia/Dhaka";
const DEFAULT_TIMEZONE = "Asia/Dhaka";

function getTimezoneOffsetMs(timeZone: string, date: Date): number {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const zoned = new Date(date.toLocaleString("en-US", { timeZone }));
  return zoned.getTime() - utc.getTime();
}

function zonedLocalToUtc(date: string, time: string, timeZone: string): Date {
  const local = new Date(`${date}T${time}:00`);
  return new Date(local.getTime() - getTimezoneOffsetMs(timeZone, local));
}

export function formatTrialParentSchedule(
  date: string | undefined,
  time: string | undefined,
  timeZone: string | undefined
): string | null {
  if (!date?.trim() || !time?.trim()) return null;
  const tz = timeZone?.trim() || DEFAULT_TIMEZONE;
  const utc = zonedLocalToUtc(date, time, tz);
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(utc);
  return `${label} (${tz})`;
}

export function formatTrialBangladeshSchedule(
  date: string | undefined,
  time: string | undefined,
  sourceTimeZone: string | undefined
): string | null {
  if (!date?.trim() || !time?.trim()) return null;
  const sourceTz = sourceTimeZone?.trim() || DEFAULT_TIMEZONE;
  const utc = zonedLocalToUtc(date, time, sourceTz);
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: BD_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(utc);
  return `${label} (Bangladesh Time)`;
}
