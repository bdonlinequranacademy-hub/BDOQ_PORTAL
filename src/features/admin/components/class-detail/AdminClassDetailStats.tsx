import {
  Banknote,
  CalendarClock,
  Clock,
  ClipboardList,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AdminClass } from "@/types/models";
import { formatDuration, studentCount } from "@/lib/utils/class";
import { getNextScheduleInfo } from "@/features/admin/components/class-detail/adminClassDetailUtils";

interface IAdminClassDetailStatsProps {
  cls: AdminClass;
  sessionLogCount: number;
}

function translateNextLabel(
  label: string,
  t: (key: string, params?: Record<string, string>) => string
): string {
  if (label === "Today") return t("admin.classes.today");
  if (label === "Tomorrow") return t("admin.classDetail.tomorrow");
  const match = /^(\d+) days$/.exec(label);
  if (match) return t("admin.classDetail.daysUntil", { count: match[1] ?? "0" });
  return label;
}

export function AdminClassDetailStats({ cls, sessionLogCount }: IAdminClassDetailStatsProps) {
  const { t, formatBdt, formatNumber } = usePortalTranslation();
  const enrolled = studentCount(cls);
  const nextSession = getNextScheduleInfo(cls.schedule);

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.classDetail.enrolledStudents")}
        value={formatNumber(enrolled)}
        icon={<Users className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.classDetail.studentsInClass", { count: formatNumber(enrolled) })}
      />
      {cls.sessionRateBdt != null ? (
        <StatCard
          label={t("admin.classDetail.sessionRate")}
          value={formatBdt(cls.sessionRateBdt)}
          icon={<Banknote className="size-5 text-amber-600" />}
          iconBg="bg-amber-100"
          hint={t("admin.classDetail.perSession")}
        />
      ) : null}
      {cls.schedule?.duration ? (
        <StatCard
          label={t("admin.classDetail.duration")}
          value={formatDuration(cls.schedule.duration)}
          icon={<Clock className="size-5 text-blue-600" />}
          iconBg="bg-blue-100"
          hint={t("admin.classDetail.perSession")}
        />
      ) : null}
      <StatCard
        label={t("admin.classDetail.sessionLogs")}
        value={formatNumber(sessionLogCount)}
        icon={<ClipboardList className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={t("admin.classDetail.recordedSessions")}
      />
      {nextSession ? (
        <StatCard
          label={t("admin.classDetail.nextSession")}
          value={translateNextLabel(nextSession.label, t)}
          icon={<CalendarClock className="size-5 text-teal-600" />}
          iconBg="bg-teal/10"
          className="col-span-2 xl:col-span-1"
          hint={nextSession.hint}
        />
      ) : (
        <StatCard
          label={t("admin.classDetail.schedule")}
          value="—"
          icon={<CalendarClock className="size-5 text-teal-600" />}
          iconBg="bg-teal/10"
          className="col-span-2 xl:col-span-1"
          hint={t("admin.classDetail.noWeeklySchedule")}
        />
      )}
    </div>
  );
}
