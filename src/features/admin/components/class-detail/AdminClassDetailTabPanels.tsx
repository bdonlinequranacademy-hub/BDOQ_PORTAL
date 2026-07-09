import {
  CalendarDays,
  Clock3,
  Globe,
  Link2,
  Repeat,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { AdminClass } from "@/types/models";
import { formatScheduleLine } from "@/lib/utils/class";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import {
  formatClassCreatedAt,
  getUpcomingScheduleSessions,
  scheduleRepeatLabel,
} from "@/features/admin/components/class-detail/adminClassDetailUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminClassDetailOverviewTabProps {
  cls: AdminClass;
  onOpenSchedule: () => void;
}

export function AdminClassDetailOverviewTab({
  cls,
  onOpenSchedule,
}: IAdminClassDetailOverviewTabProps) {
  const upcoming = getUpcomingScheduleSessions(cls.schedule, 3);
  const meetingLink = normalizeMeetingLink(cls.meetingLink);

  const meta = [
    { label: "Class status", value: cls.isActive === false ? "Inactive" : "Active" },
    { label: "Schedule type", value: scheduleRepeatLabel(cls.schedule) },
    { label: "Weekly slot", value: formatScheduleLine(cls.schedule) ?? "Not set" },
    { label: "Created", value: formatClassCreatedAt(cls.createdAt) },
    {
      label: "Session rate",
      value: cls.sessionRateBdt != null ? `BDT ${cls.sessionRateBdt}` : "Not set",
    },
    {
      label: "Meeting link",
      value: meetingLink ? "Configured" : "Not set",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">About This Class</h2>
        <p className="mt-3 text-sm leading-relaxed text-portal-muted">
          {cls.description ??
            "No description added yet. Edit the class to add learning goals and notes for admins."}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meta.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-portal/80 bg-portal-muted/20 px-4 py-3"
            >
              <p className="text-xs font-medium text-portal-muted">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-portal-heading">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-portal-heading">Upcoming Sessions</h2>
          <button
            type="button"
            onClick={onOpenSchedule}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View schedule
          </button>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-portal-muted">No recurring schedule configured for this class.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((session) => (
              <div
                key={session.date.toISOString()}
                className="flex flex-col gap-3 rounded-xl border border-portal/80 bg-portal-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 px-3 py-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                      {session.dayLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-portal-heading">{cls.title}</p>
                    <p className="text-xs text-portal-muted">
                      {session.time ?? "Time not set"} · Weekly session
                    </p>
                  </div>
                </div>
                {meetingLink ? (
                  <a
                    href={meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                  >
                    <Video className="size-3.5" aria-hidden />
                    Join Class
                  </a>
                ) : (
                  <span className="inline-flex rounded-xl border border-portal px-4 py-2 text-xs font-semibold text-portal-muted">
                    Upcoming
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

interface IAdminClassDetailScheduleTabProps {
  cls: AdminClass;
}

export function AdminClassDetailScheduleTab({ cls }: IAdminClassDetailScheduleTabProps) {
  const schedule = cls.schedule;
  const meetingLink = normalizeMeetingLink(cls.meetingLink);

  const items = [
    {
      icon: CalendarDays,
      label: "Weekly day",
      value: schedule?.day ?? "Not set",
    },
    {
      icon: Clock3,
      label: "Start time",
      value: schedule?.time ?? "Not set",
    },
    {
      icon: Repeat,
      label: "Repeat",
      value: scheduleRepeatLabel(schedule),
    },
    {
      icon: Globe,
      label: "Duration",
      value: schedule?.duration ? `${schedule.duration} minutes` : "Not set",
    },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Class Schedule</h2>
      <p className="mt-1 text-sm text-portal-muted">
        {formatScheduleLine(schedule) ?? "Add a weekly schedule from edit class settings."}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-xl border border-portal/80 bg-portal-muted/20 p-4"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-medium text-portal-muted">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-portal-heading">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {meetingLink ? (
        <a
          href={meetingLink}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
          )}
        >
          <Link2 className="size-4" aria-hidden />
          {meetingLink}
        </a>
      ) : null}
    </Card>
  );
}
