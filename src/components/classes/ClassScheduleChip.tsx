import { Calendar, Sparkles } from "lucide-react";
import {
  formatScheduleLine,
  isTodayScheduleDay,
  primaryScheduleEntry,
  type ScheduleLike,
} from "@/lib/utils/class";

interface ClassScheduleChipProps {
  schedule?: ScheduleLike;
  className?: string;
  variant?: "default" | "onDark";
}

export function ClassScheduleChip({
  schedule,
  className = "",
  variant = "default",
}: ClassScheduleChipProps) {
  const line = formatScheduleLine(schedule);
  if (!line) return null;

  const entry = primaryScheduleEntry(schedule);
  const isToday =
    entry?.repeatDaily === true || isTodayScheduleDay(entry?.day);

  const tone =
    variant === "onDark"
      ? "bg-white/15 text-gold ring-1 ring-white/20"
      : isToday
        ? "bg-gold/15 text-gold-dark ring-1 ring-gold/30"
        : "bg-navy/5 text-navy-600";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tone} ${className}`}
    >
      {isToday ? <Sparkles className="size-3 shrink-0" /> : <Calendar className="size-3 shrink-0" />}
      {line}
      {isToday && variant === "default" ? (
        <span className="font-semibold">· Today</span>
      ) : null}
    </span>
  );
}
