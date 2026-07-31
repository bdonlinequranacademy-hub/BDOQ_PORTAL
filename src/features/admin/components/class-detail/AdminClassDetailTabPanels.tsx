import {
  CalendarDays,
  Clock3,
  Globe,
  Link2,
  Repeat,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AdminClass, ClassSchedule } from "@/types/models";
import { formatScheduleLine } from "@/lib/utils/class";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import {
  getUpcomingScheduleSessions,
  scheduleRepeatLabel,
} from "@/features/admin/components/class-detail/adminClassDetailUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminClassDetailOverviewTabProps {
  cls: AdminClass;
  onOpenSchedule: () => void;
}

function translateScheduleRepeat(
  schedule: ClassSchedule | null | undefined,
  t: (key: string) => string
): string {
  const raw = scheduleRepeatLabel(schedule);
  if (raw === "Not scheduled") return t("admin.classDetail.notScheduled");
  if (raw === "One-time session") return t("admin.classDetail.oneTimeSession");
  if (raw === "Weekly recurring") return t("admin.classDetail.weeklyRecurring");
  return raw;
}

export function AdminClassDetailOverviewTab({
  cls,
  onOpenSchedule,
}: IAdminClassDetailOverviewTabProps) {
  const { t, statusLabel, formatDate, formatBdt } = usePortalTranslation();
  const upcoming = getUpcomingScheduleSessions(cls.schedule, 3);
  const meetingLink = normalizeMeetingLink(cls.meetingLink);
  const isActive = cls.isActive !== false;

  const meta = [
    {
      label: t("admin.classDetail.classStatus"),
      value: statusLabel(isActive ? "active" : "inactive"),
    },
    {
      label: t("admin.classDetail.scheduleType"),
      value: translateScheduleRepeat(cls.schedule, t),
    },
    {
      label: t("admin.classDetail.weeklySlot"),
      value: formatScheduleLine(cls.schedule) ?? t("admin.classDetail.notSet"),
    },
    {
      label: t("admin.classDetail.created"),
      value: cls.createdAt ? formatDate(cls.createdAt) : "—",
    },
    {
      label: t("admin.classDetail.sessionRateLabel"),
      value: cls.sessionRateBdt != null ? formatBdt(cls.sessionRateBdt) : t("admin.classDetail.notSet"),
    },
    {
      label: t("admin.classDetail.meetingLink"),
      value: meetingLink ? t("admin.classDetail.configured") : t("admin.classDetail.notSet"),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.aboutClass")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-portal-muted">
          {cls.description ?? t("admin.classDetail.noDescription")}
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
          <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.upcomingSessions")}</h2>
          <button
            type="button"
            onClick={onOpenSchedule}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t("admin.classDetail.viewSchedule")}
          </button>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-portal-muted">{t("admin.classDetail.noRecurringSchedule")}</p>
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
                      {formatDate(session.date.toISOString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-portal-heading">{cls.title}</p>
                    <p className="text-xs text-portal-muted">
                      {session.time ?? t("admin.classDetail.timeNotSet")} · {t("admin.classDetail.weeklySession")}
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
                    {t("admin.classDetail.joinClass")}
                  </a>
                ) : (
                  <span className="inline-flex rounded-xl border border-portal px-4 py-2 text-xs font-semibold text-portal-muted">
                    {t("admin.classDetail.upcoming")}
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
  const { t } = usePortalTranslation();
  const schedule = cls.schedule;
  const meetingLink = normalizeMeetingLink(cls.meetingLink);
  const notSet = t("admin.classDetail.notSet");

  const items = [
    {
      icon: CalendarDays,
      label: t("admin.classDetail.weeklyDay"),
      value: schedule?.day ?? notSet,
    },
    {
      icon: Clock3,
      label: t("admin.classDetail.startTime"),
      value: schedule?.time ?? notSet,
    },
    {
      icon: Repeat,
      label: t("admin.classDetail.repeat"),
      value: translateScheduleRepeat(schedule, t),
    },
    {
      icon: Globe,
      label: t("admin.classDetail.duration"),
      value: schedule?.duration
        ? t("admin.classDetail.minutesDuration", { count: String(schedule.duration) })
        : notSet,
    },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.classSchedule")}</h2>
      <p className="mt-1 text-sm text-portal-muted">
        {formatScheduleLine(schedule) ?? t("admin.classDetail.addScheduleHint")}
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
