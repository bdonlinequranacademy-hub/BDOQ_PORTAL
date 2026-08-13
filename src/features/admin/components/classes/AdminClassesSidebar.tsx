import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formatClockTime } from "@/i18n/format";
import type { AdminClass } from "@/types/models";
import {
  classTitle,
  classesScheduledToday,
  getTodayWeekDay,
  primaryScheduleEntry,
  teacherName,
} from "@/lib/utils/class";
import {
  computeAdminClassesStats,
  scheduledWeekDays,
} from "@/features/admin/components/classes/adminClassesUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminClassesSidebarProps {
  classes: AdminClass[];
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function AdminClassesTodaySchedule({ classes }: { classes: AdminClass[] }) {
  const { t, dynamicLabel } = usePortalTranslation();
  const todayClasses = classesScheduledToday(classes).filter((cls) => cls.isActive !== false);
  const todayDayLabel = dynamicLabel(getTodayWeekDay().toLowerCase());

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.classes.todaySchedule")}</h2>
        <Link to="/admin/live-monitor" className="text-xs font-semibold text-primary hover:underline">
          {t("actions.viewAll")}
        </Link>
      </div>
      {todayClasses.length === 0 ? (
        <p className="text-sm text-portal-muted">
          {t("admin.classes.noClassesScheduled", { day: todayDayLabel })}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {todayClasses.slice(0, 4).map((cls) => {
            const time = formatClockTime(primaryScheduleEntry(cls.schedule)?.time ?? "—");
            return (
              <div
                key={cls._id}
                className="relative border-l-2 border-primary/30 pl-3"
              >
                <p className="text-xs font-semibold text-primary">{time}</p>
                <p className="text-sm font-semibold text-portal-heading">{classTitle(cls)}</p>
                <p className="text-xs text-portal-muted">
                  {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function AdminClassesCalendar({ classes }: { classes: AdminClass[] }) {
  const { t, formatDate } = usePortalTranslation();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayDay =
    today.getFullYear() === year && today.getMonth() === month ? today.getDate() : null;
  const scheduledDays = useMemo(() => scheduledWeekDays(classes), [classes]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = formatDate(new Date(year, month, 1).toISOString());

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  function shiftMonth(delta: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
            aria-label={t("admin.classes.previousMonth")}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary"
            aria-label={t("admin.classes.nextMonth")}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-portal-muted">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day == null) {
            return <span key={`empty-${index}`} />;
          }

          const date = new Date(year, month, day);
          const hasClass = scheduledDays.has(date.getDay());

          return (
            <span
              key={`${year}-${month}-${day}`}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                day === todayDay
                  ? "bg-primary text-white"
                  : hasClass
                    ? "bg-primary/15 text-primary-dark"
                    : "text-portal-heading"
              )}
            >
              {day}
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-portal-muted">{t("admin.classes.calendarHint")}</p>
    </Card>
  );
}

function AdminClassesOverview({ classes }: { classes: AdminClass[] }) {
  const { t, formatNumber } = usePortalTranslation();
  const stats = computeAdminClassesStats(classes);
  const noSchedule = stats.total - stats.scheduled;

  const items = [
    { label: t("admin.classes.activeClassesOverview"), value: stats.active, tone: "bg-emerald-500" },
    {
      label: t("admin.classes.inactiveClassesOverview"),
      value: stats.total - stats.active,
      tone: "bg-amber-500",
    },
    { label: t("admin.classes.withSchedule"), value: stats.scheduled, tone: "bg-primary" },
    { label: t("admin.classes.noScheduleOverview"), value: noSchedule, tone: "bg-portal-muted" },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.classes.classOverview")}</h2>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={cn("size-2.5 rounded-sm", item.tone)} />
              <span className="text-portal-heading">{item.label}</span>
            </div>
            <span className="font-bold tabular-nums text-portal-heading">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AdminClassesQuickActions() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.classes.quickActions")}</h2>
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/classes/new")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          <Plus className="size-4" aria-hidden />
          {t("admin.classes.addNewClass")}
        </button>
        <Link
          to="/admin/class-logs"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          <FileText className="size-4" aria-hidden />
          {t("admin.classes.classReports")}
        </Link>
      </div>
    </Card>
  );
}

export function AdminClassesSidebar({ classes }: IAdminClassesSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <AdminClassesTodaySchedule classes={classes} />
      <AdminClassesCalendar classes={classes} />
      <AdminClassesOverview classes={classes} />
      <AdminClassesQuickActions />
    </div>
  );
}
