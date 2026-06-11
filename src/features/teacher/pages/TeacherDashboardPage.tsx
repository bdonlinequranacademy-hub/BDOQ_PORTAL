import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  ClipboardCheck,
  FilePlus,
  Star,
  TrendingUp,
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  useTeacherClasses,
  useAtRiskStudents,
  useTeacherNotifications,
  useTeacherHomework,
  useTeacherTodaySchedule,
  useTeacherClassLogStats,
} from "@/features/teacher/hooks/useTeacher";
import { useLogSessionFlow } from "@/features/teacher/hooks/useLogSessionFlow";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SessionSlotCard } from "@/components/schedule/SessionSlotCard";
import { LogSessionSheet } from "@/components/schedule/LogSessionSheet";
import { sortSessionsByAcademyTime } from "@/lib/utils/schedule";
import type { SessionSlotView } from "@/types/models";

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
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
  const { data: atRisk = [] } = useAtRiskStudents();
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

  const highRiskCount = atRisk.filter(
    (s) => s.riskLevel === "high" || s.riskLevel === "medium"
  ).length;

  const studentCount = classes.reduce(
    (acc, cls) => acc + (cls.studentCount ?? cls.studentIds?.length ?? 0),
    0
  );

  const pendingGrades = homework.reduce(
    (acc, hw) => acc + (hw.submissionCount ?? 0),
    0
  );

  const dashboardNotifications = [
    ...notifications.slice(0, 3).map((n) => ({
      icon: <MessageCircle className="size-4 text-[#2b7fff]" />,
      bg: "bg-[#2b7fff]/10",
      title: n.title,
      time: new Date(n.createdAt).toLocaleDateString(),
    })),
    ...(pendingGrades > 0
      ? [
          {
            icon: <FileText className="size-4 text-amber-600" />,
            bg: "bg-amber-50",
            title: `${pendingGrades} homework submission${pendingGrades > 1 ? "s" : ""} to review`,
            time: "Homework",
          },
        ]
      : []),
  ].slice(0, 3);

  return (
    <>
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm text-zinc-500">Assalamu Alaikum,</span>
          <h1 className="text-2xl font-bold leading-8 text-[#2b7fff] lg:text-3xl">
            {user?.name ?? "Teacher"}
          </h1>
        </div>
        <span className="text-sm text-zinc-500">{todayLabel()}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-[#2b7fff]/10 px-4 py-2">
          <Calendar className="size-4 text-[#2b7fff]" />
          <span className="text-sm font-semibold text-[#2b7fff]">
            {isLoading ? "–" : `${classes.length} Classes`}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#C4922B]/12 px-4 py-2">
          <Users className="size-4 text-[#C4922B]" />
          <span className="text-sm font-semibold text-[#C4922B]">
            {isLoading ? "–" : `${studentCount} Students`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/teacher/class-logs")}
          className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2"
        >
          <FileText className="size-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">
            {logStats?.pending ?? 0} logs pending
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-[0_10px_30px_-12px_rgba(3,33,79,0.18)]">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#2b7fff]">
                Today&apos;s Schedule
                {todaySchedule?.day ? (
                  <span className="ml-2 text-xs font-normal text-zinc-400">
                    ({todaySchedule.day})
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => navigate("/teacher/schedule/today")}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
              >
                View all
              </button>
            </div>

            {scheduleLoading ? (
              <p className="text-sm text-zinc-400">Loading…</p>
            ) : todaySessions.length === 0 ? (
              <p className="text-sm text-zinc-400">No classes scheduled today.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {todaySessions.slice(0, 4).map((session) => (
                  <SessionSlotCard
                    key={session._id}
                    session={session}
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
          </Card>

          <div className="flex flex-col gap-3">
            <span className="text-base font-bold text-[#2b7fff]">Quick Actions</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {[
                {
                  icon: <ClipboardCheck className="size-5 text-teal-600" />,
                  bg: "bg-teal-50",
                  label: "Mark Attendance",
                  to: "/teacher/attendance",
                },
                {
                  icon: <FilePlus className="size-5 text-[#2b7fff]" />,
                  bg: "bg-[#2b7fff]/10",
                  label: "Assign Homework",
                  to: "/teacher/homework?new=1",
                },
                {
                  icon: <Star className="size-5 text-amber-500" />,
                  bg: "bg-amber-50",
                  label: "Grade Homework",
                  to: "/teacher/homework",
                },
                {
                  icon: <TrendingUp className="size-5 text-emerald-600" />,
                  bg: "bg-emerald-50",
                  label: "Update Progress",
                  to: "/teacher/progress",
                },
                {
                  icon: <MessageSquare className="size-5 text-emerald-600" />,
                  bg: "bg-emerald-50",
                  label: "Weekly Report",
                  to: "/teacher/weekly-report",
                },
                {
                  icon: <ShieldAlert className="size-5 text-orange-500" />,
                  bg: "bg-orange-50",
                  label: "Student Care",
                  to: "/teacher/student-care",
                },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.to)}
                  className="flex flex-col gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_6px_18px_-12px_rgba(3,33,79,0.2)] transition hover:shadow-md"
                >
                  <div className={`flex size-10 items-center justify-center rounded-xl ${a.bg}`}>
                    {a.icon}
                  </div>
                  <span className="text-sm font-semibold leading-5 text-zinc-900">
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {highRiskCount > 0 && (
            <div className="flex items-center gap-4 rounded-3xl bg-[#FDF3E0] p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#C4922B]/20">
                <AlertTriangle className="size-5 text-[#C4922B]" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-bold text-[#2b7fff]">Student Care Alert</span>
                <span className="text-xs text-amber-700">
                  {highRiskCount} student{highRiskCount > 1 ? "s" : ""} need attention
                </span>
              </div>
              <Button
                onClick={() => navigate("/teacher/student-care")}
                className="h-9 shrink-0 rounded-xl bg-[#2b7fff] px-4 py-0 text-xs text-white"
              >
                Review
              </Button>
            </div>
          )}

          <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-[0_10px_30px_-12px_rgba(3,33,79,0.18)]">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#2b7fff]">Notifications</span>
              <button
                type="button"
                onClick={() => navigate("/teacher/notifications")}
                className="text-xs font-semibold text-[#C4922B]"
              >
                View all
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {dashboardNotifications.length === 0 ? (
                <p className="text-sm text-zinc-400">No new notifications.</p>
              ) : (
                dashboardNotifications.map((n) => (
                  <div key={`${n.title}-${n.time}`} className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${n.bg}`}
                    >
                      {n.icon}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-zinc-900">{n.title}</span>
                      <span className="text-xs text-zinc-400">{n.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
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
