import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  ClipboardCheck,
  FilePlus,
  Star,
  TrendingUp,
  MessageSquare,
  MessageCircle,
  FileText,
  BookOpenCheck,
} from "lucide-react";
import {
  useTeacherClasses,
  useTeacherNotifications,
  useTeacherHomework,
  useTeacherTodaySchedule,
  useTeacherClassLogStats,
} from "@/features/teacher/hooks/useTeacher";
import { useLogSessionFlow } from "@/features/teacher/hooks/useLogSessionFlow";
import { PageContainer } from "@/components/layout/PageContainer";
import { SessionSlotCard } from "@/components/schedule/SessionSlotCard";
import { LogSessionSheet } from "@/components/schedule/LogSessionSheet";
import { sortSessionsByAcademyTime } from "@/lib/utils/schedule";
import type { SessionSlotView } from "@/types/models";
import { StatCard } from "@/components/ui/shared/StatCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTwoColumn } from "@/components/dashboard/DashboardTwoColumn";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { DashboardNotificationFeed } from "@/components/dashboard/DashboardNotificationFeed";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function TeacherDashboardPage() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const { data: classes = [], isLoading } = useTeacherClasses();
  const { data: notifications = [] } = useTeacherNotifications();
  const { data: homework = [] } = useTeacherHomework();
  const { data: todaySchedule, isLoading: scheduleLoading } = useTeacherTodaySchedule();
  const { data: logStats } = useTeacherClassLogStats();
  const {
    logSession,
    logSheetOpen,
    openLogSession,
    closeLogSession,
    submitLogSession,
    isSubmittingLog,
  } = useLogSessionFlow();

  const todaySessions = sortSessionsByAcademyTime(todaySchedule?.sessions ?? []);

  const studentCount = classes.reduce(
    (acc, cls) => acc + (cls.studentCount ?? cls.studentIds?.length ?? 0),
    0
  );

  const pendingGrades = homework.reduce(
    (acc, hw) => acc + (hw.submissionCount ?? 0),
    0
  );

  const notificationItems = [
    ...notifications.slice(0, 3).map((n) => ({
      id: n._id,
      title: n.title,
      subtitle: new Date(n.createdAt).toLocaleDateString(),
      icon: <MessageCircle className="size-4 text-primary" />,
      iconBg: "bg-primary/10",
      onClick: () => navigate("/teacher/notifications"),
    })),
    ...(pendingGrades > 0
      ? [
          {
            id: "hw-pending",
            title:
              pendingGrades === 1
                ? t("teacher.homeworkSubmissionsReview", { count: String(pendingGrades) })
                : t("teacher.homeworkSubmissionsReviewPlural", { count: String(pendingGrades) }),
            subtitle: t("teacher.tapToGrade"),
            icon: <FileText className="size-4 text-amber-600" />,
            iconBg: "bg-amber-50",
            onClick: () => navigate("/teacher/homework"),
          },
        ]
      : []),
  ].slice(0, 4);

  const quickActions = [
    {
      icon: <ClipboardCheck className="size-5 text-teal-600" />,
      bg: "bg-teal-50",
      label: t("teacher.markAttendance"),
      to: "/teacher/attendance",
    },
    {
      icon: <FilePlus className="size-5 text-primary" />,
      bg: "bg-primary/10",
      label: t("teacher.assignHomework"),
      to: "/teacher/homework?new=1",
    },
    {
      icon: <Star className="size-5 text-amber-500" />,
      bg: "bg-amber-50",
      label: t("teacher.gradeHomework"),
      to: "/teacher/homework",
    },
    {
      icon: <TrendingUp className="size-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      label: t("teacher.updateProgress"),
      to: "/teacher/progress",
    },
    {
      icon: <MessageSquare className="size-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      label: t("teacher.weeklyReport"),
      to: "/teacher/weekly-report",
    },
    {
      icon: <Calendar className="size-5 text-primary-dark" />,
      bg: "bg-bg-light",
      label: t("teacher.todaysSchedule"),
      to: "/teacher/schedule/today",
    },
  ];

  return (
    <>
      <PageContainer className="flex flex-col gap-6 lg:gap-8">
        <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
          <StatCard
            label={t("teacher.todaysClasses")}
            value={scheduleLoading ? "…" : todaySessions.length}
            icon={<Calendar className="size-5" />}
            iconBg="bg-primary/10"
            hint={t("teacher.scheduledSessions")}
            onClick={() => navigate("/teacher/schedule/today")}
          />
          <StatCard
            label={t("teacher.myStudents")}
            value={isLoading ? "…" : studentCount}
            icon={<Users className="size-5" />}
            iconBg="bg-gold/15"
            hint={t("teacher.acrossAllClasses")}
            onClick={() => navigate("/teacher/students")}
          />
          <StatCard
            label={t("teacher.homeworkToGrade")}
            value={pendingGrades}
            icon={<BookOpenCheck className="size-5" />}
            iconBg="bg-amber-50"
            hint={t("teacher.pendingSubmissions")}
            onClick={() => navigate("/teacher/homework")}
          />
          <StatCard
            label={t("teacher.logsPending")}
            value={logStats?.pending ?? 0}
            icon={<FileText className="size-5" />}
            iconBg="bg-teal/10"
            hint={t("teacher.awaitingAdminReview")}
            onClick={() => navigate("/teacher/class-logs")}
          />
        </div>

        <DashboardTwoColumn
          main={
            <>
              <DashboardSection
                title={t("teacher.todaysSchedule")}
                badge={
                  scheduleLoading
                    ? "…"
                    : todaySessions.length === 1
                      ? t("teacher.sessionCount", { count: String(todaySessions.length) })
                      : t("teacher.sessionsCount", { count: String(todaySessions.length) })
                }
                subtitle={
                  todaySchedule?.day
                    ? t("teacher.academyDay", { day: todaySchedule.day })
                    : undefined
                }
                actionLabel={t("teacher.fullSchedule")}
                onAction={() => navigate("/teacher/schedule/today")}
                elevated
              >
                {scheduleLoading ? (
                  <PageLoading />
                ) : todaySessions.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title={t("teacher.noClassesToday")}
                    description={t("teacher.noClassesTodayTeacherDesc")}
                    actionLabel={t("teacher.viewRoutine")}
                    onAction={() => navigate("/teacher/schedule/routine")}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {todaySessions.slice(0, 4).map((session) => (
                      <SessionSlotCard
                        key={session._id}
                        session={session}
                        joinRole="teacher"
                        onMarkAttendance={(s: SessionSlotView) =>
                          navigate(
                            `/teacher/attendance/sheet?classId=${s.classId}&date=${todayIsoDate()}`
                          )
                        }
                        onLogSession={openLogSession}
                      />
                    ))}
                  </div>
                )}
              </DashboardSection>

              <DashboardSection
                title={t("teacher.quickActionsTitle")}
                subtitle={t("teacher.commonTasksToday")}
              >
                <QuickActionGrid
                  columns={3}
                  actions={quickActions.map((a) => ({
                    label: a.label,
                    icon: a.icon,
                    iconBg: a.bg,
                    onClick: () => navigate(a.to),
                  }))}
                />
              </DashboardSection>
            </>
          }
          aside={
            <DashboardSection
              title={t("teacher.notifications")}
              actionLabel={t("teacher.viewAll")}
              onAction={() => navigate("/teacher/notifications")}
              elevated
            >
              <DashboardNotificationFeed items={notificationItems} />
            </DashboardSection>
          }
        />
      </PageContainer>

      <LogSessionSheet
        session={logSession}
        open={logSheetOpen}
        onClose={closeLogSession}
        onSubmit={submitLogSession}
        isSubmitting={isSubmittingLog}
      />
    </>
  );
}
