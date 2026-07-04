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
import { useAuthStore } from "@/stores/authStore";
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
import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTwoColumn } from "@/components/dashboard/DashboardTwoColumn";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { DashboardNotificationFeed } from "@/components/dashboard/DashboardNotificationFeed";

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function TeacherDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
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
            title: `${pendingGrades} homework submission${pendingGrades > 1 ? "s" : ""} to review`,
            subtitle: "Tap to grade",
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
      label: "Mark attendance",
      to: "/teacher/attendance",
    },
    {
      icon: <FilePlus className="size-5 text-primary" />,
      bg: "bg-primary/10",
      label: "Assign homework",
      to: "/teacher/homework?new=1",
    },
    {
      icon: <Star className="size-5 text-amber-500" />,
      bg: "bg-amber-50",
      label: "Grade homework",
      to: "/teacher/homework",
    },
    {
      icon: <TrendingUp className="size-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      label: "Update progress",
      to: "/teacher/progress",
    },
    {
      icon: <MessageSquare className="size-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      label: "Weekly report",
      to: "/teacher/weekly-report",
    },
    {
      icon: <Calendar className="size-5 text-primary-dark" />,
      bg: "bg-bg-light",
      label: "Today's schedule",
      to: "/teacher/schedule/today",
    },
  ];

  return (
    <>
      <PageContainer className="flex flex-col gap-6 lg:gap-8">
        <DashboardHero
          name={user?.name ?? "Teacher"}
          subtitle={`${BDOQ_BRAND.shortName} — Quran teaching portal`}
          dateLabel={todayLabel()}
          roleBadge="Teacher"
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Today's classes"
            value={scheduleLoading ? "…" : todaySessions.length}
            icon={<Calendar className="size-5" />}
            iconBg="bg-primary/10"
            hint="Scheduled sessions"
            onClick={() => navigate("/teacher/schedule/today")}
          />
          <StatCard
            label="My students"
            value={isLoading ? "…" : studentCount}
            icon={<Users className="size-5" />}
            iconBg="bg-gold/15"
            hint="Across all classes"
            onClick={() => navigate("/teacher/students")}
          />
          <StatCard
            label="Homework to grade"
            value={pendingGrades}
            icon={<BookOpenCheck className="size-5" />}
            iconBg="bg-amber-50"
            hint="Pending submissions"
            onClick={() => navigate("/teacher/homework")}
          />
          <StatCard
            label="Logs pending"
            value={logStats?.pending ?? 0}
            icon={<FileText className="size-5" />}
            iconBg="bg-teal/10"
            hint="Awaiting admin review"
            onClick={() => navigate("/teacher/class-logs")}
          />
        </div>

        <DashboardTwoColumn
          main={
            <>
              <DashboardSection
                title="Today's schedule"
                badge={
                  scheduleLoading
                    ? "…"
                    : `${todaySessions.length} session${todaySessions.length === 1 ? "" : "s"}`
                }
                subtitle={todaySchedule?.day ? `Academy day: ${todaySchedule.day}` : undefined}
                actionLabel="Full schedule"
                onAction={() => navigate("/teacher/schedule/today")}
                elevated
              >
                {scheduleLoading ? (
                  <PageLoading />
                ) : todaySessions.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No classes today"
                    description="Use this time for lesson prep or update student progress."
                    actionLabel="View routine"
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

              <DashboardSection title="Quick actions" subtitle="Common tasks for today's teaching">
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
              title="Notifications"
              actionLabel="View all"
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
