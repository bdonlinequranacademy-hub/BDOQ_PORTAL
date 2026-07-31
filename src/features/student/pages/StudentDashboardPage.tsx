import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  Video,
  ChevronRight,
  Bell,
  MessageSquare,
  Calendar,
} from "lucide-react";
import {
  useStudentClasses,
  useStudentHomework,
  useStudentProgress,
  useStudentCurriculumPlan,
  useStudentNotifications,
  useMarkNotificationRead,
  useStudentTodaySchedule,
} from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { SessionSlotCard } from "@/components/schedule/SessionSlotCard";
import { sortSessionsByAcademyTime } from "@/lib/utils/schedule";
import { classTitle, teacherName } from "@/lib/utils/class";
import { StudentCurriculumPlan } from "@/components/curriculum/StudentCurriculumPlan";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { StatCard } from "@/components/ui/shared/StatCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTwoColumn } from "@/components/dashboard/DashboardTwoColumn";
import { DashboardNotificationFeed } from "@/components/dashboard/DashboardNotificationFeed";
import { ProgressMeter } from "@/components/dashboard/ProgressMeter";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { t, formatDate } = usePortalTranslation();
  const { data: classes = [], isLoading: classesLoading } = useStudentClasses();
  const { data: homework = [] } = useStudentHomework();
  const { data: progress = [] } = useStudentProgress();
  const { data: notifications = [] } = useStudentNotifications();
  const { data: todaySchedule, isLoading: scheduleLoading } = useStudentTodaySchedule();
  const markRead = useMarkNotificationRead();
  const { data: curriculumPlan = [] } = useStudentCurriculumPlan();

  const todaySessions = sortSessionsByAcademyTime(todaySchedule?.sessions ?? []);
  const nextSession = todaySessions[0];
  const pendingHw = homework.filter((h) => !h.submitted);
  const overdueHw = pendingHw.filter((h) => isOverdue(h.dueDate));
  const latestProgress = progress[0];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const notificationItems = notifications.slice(0, 4).map((n) => ({
    id: n._id,
    title: n.title,
    subtitle: n.message,
    unread: !n.isRead,
    onClick: () => {
      if (!n.isRead) markRead.mutate(n._id);
      navigate("/student/notifications");
    },
  }));

  return (
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      {nextSession ? (
        <button
          type="button"
          onClick={() => navigate("/student/classes")}
          className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-teal/5 p-4 text-left transition hover:border-primary/30 sm:p-5"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Calendar className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t("student.nextClassToday")}
            </p>
            <p className="truncate font-bold text-portal-heading">{nextSession.classTitle}</p>
            <p className="text-sm text-portal-muted">
              {nextSession.times.student.label} · {nextSession.day}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-portal-muted" aria-hidden />
        </button>
      ) : null}

      <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label={t("student.myClasses")}
          value={classesLoading ? "…" : classes.length}
          icon={<BookOpen className="size-5" />}
          iconBg="bg-primary/10"
          hint={t("student.enrolledCourses")}
          onClick={() => navigate("/student/classes")}
        />
        <StatCard
          label={t("student.homeworkDue")}
          value={pendingHw.length}
          icon={<ClipboardList className="size-5" />}
          iconBg="bg-gold/15"
          hint={t("student.notSubmittedYet")}
          onClick={() => navigate("/student/homework")}
        />
        <StatCard
          label={t("student.overdue")}
          value={overdueHw.length}
          icon={<ClipboardList className="size-5 text-red-500" />}
          iconBg="bg-red-50"
          hint={overdueHw.length > 0 ? t("student.needsAttention") : t("student.allOnTrack")}
          onClick={() => navigate("/student/homework")}
        />
        <StatCard
          label={t("student.notifications")}
          value={unreadCount}
          icon={<Bell className="size-5" />}
          iconBg="bg-teal/10"
          hint={t("student.unreadUpdates")}
          onClick={() => navigate("/student/notifications")}
        />
      </div>

      {curriculumPlan.length > 0 ? (
        <DashboardSection
          title={t("student.myStudyPlan")}
          actionLabel={t("student.viewProgress")}
          onAction={() => navigate("/student/progress")}
        >
          <StudentCurriculumPlan assignments={curriculumPlan} />
          {latestProgress?.curriculumLabels?.program ? (
            <p className="text-xs text-zinc-500">
              {t("student.latestClassUpdate", {
                path: formatCurriculumPath(latestProgress.curriculumLabels),
              })}
            </p>
          ) : null}
        </DashboardSection>
      ) : null}

      <DashboardTwoColumn
        main={
          <>
            <DashboardSection
              title={t("student.todaysClasses")}
              badge={
                scheduleLoading
                  ? "…"
                  : todaySessions.length === 1
                    ? t("student.sessionCount", { count: String(todaySessions.length) })
                    : t("student.sessionsCount", { count: String(todaySessions.length) })
              }
              subtitle={
                todaySchedule?.day
                  ? t("student.academyDay", { day: todaySchedule.day })
                  : undefined
              }
              elevated
            >
              {scheduleLoading ? (
                <PageLoading label={t("student.loadingSchedule")} />
              ) : todaySessions.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title={t("student.noClassesToday")}
                  description={t("student.noClassesTodayDesc")}
                  actionLabel={t("student.viewAllClasses")}
                  onAction={() => navigate("/student/classes")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {todaySessions.map((session) => (
                    <SessionSlotCard
                      key={session._id}
                      session={session}
                      showStudentMeta={false}
                      joinRole="student"
                    />
                  ))}
                </div>
              )}
            </DashboardSection>

            <DashboardSection
              title={t("student.myClasses")}
              actionLabel={t("student.viewAll")}
              onAction={() => navigate("/student/classes")}
            >
              {classesLoading ? (
                <PageLoading />
              ) : classes.length === 0 ? (
                <p className="text-sm text-zinc-400">{t("student.noClassesEnrolled")}</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {classes.slice(0, 4).map((cls) => (
                    <button
                      key={cls._id}
                      type="button"
                      onClick={() => navigate(`/student/classes/${cls._id}`)}
                      className="flex flex-col gap-2 rounded-2xl border border-portal bg-portal-muted p-4 text-left transition hover:border-primary/20 hover:shadow-sm"
                    >
                      <span className="font-semibold text-portal-heading">{classTitle(cls)}</span>
                      <span className="text-xs text-portal-muted">
                        {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
                      </span>
                      {cls.meetingLink ? (
                        <span className="inline-flex items-center gap-1 text-xs text-primary">
                          <Video className="size-3" aria-hidden />
                          {t("student.joinClass")}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </DashboardSection>

            <DashboardSection
              title={t("student.homeworkDue")}
              actionLabel={t("student.viewAll")}
              onAction={() => navigate("/student/homework")}
            >
              {pendingHw.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title={t("student.allCaughtUp")}
                  description={t("student.allCaughtUpDesc")}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingHw.slice(0, 3).map((hw) => (
                    <button
                      key={hw._id}
                      type="button"
                      onClick={() => navigate(`/student/homework/${hw._id}`)}
                      className={`flex items-center justify-between rounded-2xl border-l-4 p-3 text-left transition hover:opacity-90 ${
                        isOverdue(hw.dueDate)
                          ? "border-l-red-500 bg-red-50/50"
                          : "border-l-gold bg-gold/5"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-portal-heading">{hw.title}</p>
                        <p className="text-xs text-portal-muted">
                          {t("student.dueDate", {
                            date: formatDate(hw.dueDate),
                          })}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-zinc-300" aria-hidden />
                    </button>
                  ))}
                </div>
              )}
            </DashboardSection>
          </>
        }
        aside={
          <>
            {latestProgress ? (
              <DashboardSection title={t("student.myProgress")} elevated>
                <ProgressMeter
                  label={t("student.tajweedScore")}
                  value={latestProgress.tajweedScore}
                  hint={t("student.surahsMemorized", {
                    count: String(latestProgress.surahsCompleted?.length ?? 0),
                  })}
                />
                <button
                  type="button"
                  onClick={() => navigate("/student/progress")}
                  className="text-sm font-semibold text-gold hover:underline"
                >
                  {t("student.viewFullProgress")}
                </button>
              </DashboardSection>
            ) : null}

            <button
              type="button"
              onClick={() => navigate("/student/summary")}
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 p-5 text-left text-white shadow-md transition hover:shadow-lg"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/15">
                <MessageSquare className="size-5 text-emerald-100" aria-hidden />
              </div>
              <div>
                <p className="font-bold">{t("student.weeklySummary")}</p>
                <p className="text-xs text-white/70">{t("student.weeklySummaryDesc")}</p>
              </div>
            </button>

            <DashboardSection
              title={t("student.notifications")}
              actionLabel={t("student.seeAll")}
              onAction={() => navigate("/student/notifications")}
            >
              <DashboardNotificationFeed items={notificationItems} />
            </DashboardSection>

            <QuickActionGrid
              columns={2}
              actions={[
                {
                  label: t("student.attendance"),
                  icon: <ClipboardList className="size-5 text-teal-600" />,
                  iconBg: "bg-teal/10",
                  onClick: () => navigate("/student/attendance"),
                },
                {
                  label: t("student.allClasses"),
                  icon: <BookOpen className="size-5 text-primary" />,
                  iconBg: "bg-primary/10",
                  onClick: () => navigate("/student/classes"),
                },
                {
                  label: t("student.progress"),
                  icon: <TrendingUp className="size-5 text-gold" />,
                  iconBg: "bg-gold/15",
                  onClick: () => navigate("/student/progress"),
                },
                {
                  label: t("student.payments"),
                  icon: <Bell className="size-5 text-zinc-600" />,
                  iconBg: "bg-zinc-100",
                  onClick: () => navigate("/student/payments"),
                },
              ]}
            />
          </>
        }
      />
    </PageContainer>
  );
}
