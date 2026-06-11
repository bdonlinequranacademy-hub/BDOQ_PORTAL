import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { classTitle } from "@/lib/utils/class";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export interface ScheduleClassItem {
  _id: string;
  title?: string;
  name?: string;
  schedule?: { day: string; time: string; duration?: number };
}

/** Normalizes API schedule (single object or legacy array) for the grid. */
export function toScheduleClassItem(cls: {
  _id: string;
  title?: string;
  name?: string;
  schedule?: { day: string; time: string; duration?: number } | { day: string; time: string }[];
}): ScheduleClassItem {
  let schedule: ScheduleClassItem["schedule"];
  if (cls.schedule && !Array.isArray(cls.schedule) && "day" in cls.schedule) {
    schedule = cls.schedule;
  } else if (Array.isArray(cls.schedule) && cls.schedule[0]) {
    schedule = cls.schedule[0];
  }
  return { _id: cls._id, title: cls.title, name: cls.name, schedule };
}

interface WeeklyScheduleProps {
  classes: ScheduleClassItem[];
  onClassClick?: (id: string) => void;
}

export function WeeklySchedule({ classes, onClassClick }: WeeklyScheduleProps) {
  const scheduled = classes.filter((c) => c.schedule?.day);

  if (scheduled.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No schedule yet"
        description="Classes with a day and time will appear in your weekly timetable."
      />
    );
  }

  const byDay = WEEK_DAYS.map((day) => ({
    day,
    items: scheduled.filter(
      (c) => c.schedule?.day?.toLowerCase() === day.toLowerCase()
    ),
  }));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {byDay.map(({ day, items }) => (
        <div
          key={day}
          className={`flex min-h-[120px] flex-col rounded-2xl border p-3 ${
            items.length > 0
              ? "border-gold/30 bg-portal-surface shadow-sm"
              : "border-dashed border-portal bg-portal-muted"
          }`}
        >
          <span className="mb-2 text-xs font-bold uppercase tracking-wide text-portal-heading">
            {day.slice(0, 3)}
          </span>
          {items.length === 0 ? (
            <span className="text-xs text-portal-muted">—</span>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((cls) => (
                <button
                  key={cls._id}
                  type="button"
                  onClick={() => onClassClick?.(cls._id)}
                  className="rounded-xl border border-transparent bg-portal-muted px-2.5 py-2 text-left transition hover:border-gold/25 hover:bg-portal-surface"
                >
                  <p className="line-clamp-2 text-xs font-semibold text-portal-heading">
                    {classTitle(cls)}
                  </p>
                  <p className="text-[10px] text-portal-muted">{cls.schedule?.time}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
