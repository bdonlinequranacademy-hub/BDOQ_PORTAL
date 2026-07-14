import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Bell,
  Radio,
  Calendar,
} from "lucide-react";
import {
  useParentChildren,
  useSelectedChildId,
  useParentChildClasses,
  useParentChildTodaySchedule,
  useParentChildHomework,
  useParentChildAttendance,
  useParentChildProgress,
  useParentNotifications,
} from "@/features/parent/hooks/useParent";
import { ChildSelector } from "@/features/parent/components/ChildSelector";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export function ParentDashboardPage() {
  const navigate = useNavigate();
  const { data: children = [] } = useParentChildren();
  const childId = useSelectedChildId() ?? "";

  const { data: classes = [] } = useParentChildClasses(childId);
  const { data: todaySchedule } = useParentChildTodaySchedule(childId);
  const { data: homework = [] } = useParentChildHomework(childId);
  const { data: attendance } = useParentChildAttendance(childId);
  const { data: progress = [] } = useParentChildProgress(childId);
  const { data: notifications = [] } = useParentNotifications();

  const pendingHw = homework.filter((h) => !h.submitted);
  const overdueHw = pendingHw.filter((h) => isOverdue(h.dueDate));
  const latestProgress = progress[0];
  const unread = notifications.filter((n) => !n.isRead).length;
  const todaySessions = todaySchedule?.sessions ?? [];
  const liveSessions = todaySessions.filter((s) => s.sessionPhase === "live");

  return (
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      <ChildSelector />

      {!childId && children.length === 0 ? null : !childId ? (
        <p className="text-sm text-zinc-400">Select a child to view their data.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
            {[
              { label: "Classes", value: classes.length, color: "text-primary" },
              { label: "Due homework", value: pendingHw.length, color: "text-amber-600" },
              { label: "Overdue", value: overdueHw.length, color: "text-red-500" },
              {
                label: "Attendance",
                value: `${attendance?.summary?.percentage ?? 0}%`,
                color: "text-teal-600",
              },
            ].map((s) => (
              <Card key={s.label} className="rounded-2xl border-0 p-4 shadow-sm">
                <span className="text-xs text-zinc-400">{s.label}</span>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </Card>
            ))}
          </div>

          {todaySessions.length > 0 ? (
            <Card className="rounded-3xl border-0 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  <span className="font-bold text-primary-dark">Today&apos;s classes</span>
                  {liveSessions.length > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      <Radio className="size-3" />
                      {liveSessions.length} live
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {todaySessions.map((session) => (
                  <div
                    key={session._id}
                    className={`rounded-2xl border p-4 ${
                      session.sessionPhase === "live"
                        ? "border-red-200 bg-red-50/50"
                        : "border-zinc-100 bg-zinc-50/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-primary-dark">{session.classTitle}</p>
                        <p className="text-xs text-zinc-500">
                          {session.times.academy.time} BD · {session.teacher.name}
                        </p>
                      </div>
                      <SessionStatusBadge session={session} compact />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-dark">Enrolled Classes</span>
                <button
                  onClick={() => navigate("/parent/homework")}
                  className="text-xs font-semibold text-gold"
                >
                  Homework →
                </button>
              </div>
              {classes.length === 0 ? (
                <p className="text-sm text-zinc-400">No classes yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {classes.slice(0, 4).map((cls) => (
                    <div
                      key={cls._id}
                      className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4"
                    >
                      <p className="font-semibold text-primary-dark">{cls.title}</p>
                      {cls.teacher && typeof cls.teacher === "object" && (
                        <p className="text-xs text-zinc-400">{cls.teacher.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div className="flex flex-col gap-4">
              {latestProgress && (
                <Card className="flex flex-col gap-3 rounded-3xl border-0 p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-5 text-gold" />
                    <span className="font-bold text-primary-dark">Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-dark">
                    {latestProgress.tajweedScore}% Tajweed
                  </p>
                  <button
                    onClick={() => navigate("/parent/progress")}
                    className="text-sm font-semibold text-gold"
                  >
                    View details →
                  </button>
                </Card>
              )}

              <button
                onClick={() => navigate("/parent/summary")}
                className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-5 text-left text-white"
              >
                <MessageSquare className="size-6 text-emerald-200" />
                <div>
                  <p className="font-bold">Weekly Summary</p>
                  <p className="text-xs text-white/70">View this week&apos;s verified report</p>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate("/parent/attendance")}
                  className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <ClipboardList className="size-5 text-teal-600" />
                  <span className="text-sm font-semibold text-primary-dark">Attendance</span>
                </button>
                <button
                  onClick={() => navigate("/parent/notifications")}
                  className="relative flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <Bell className="size-5 text-primary-dark" />
                  <span className="text-sm font-semibold text-primary-dark">Alerts</span>
                  {unread > 0 && (
                    <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {pendingHw.length > 0 && (
            <Card className="rounded-3xl border-0 p-6 shadow-sm">
              <span className="mb-3 block font-bold text-primary-dark">Homework due soon</span>
              <div className="flex flex-col gap-2">
                {pendingHw.slice(0, 3).map((hw) => (
                  <button
                    key={hw._id}
                    onClick={() => navigate("/parent/homework")}
                    className="flex items-center justify-between rounded-xl bg-[#F8FAFF] px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium text-primary-dark">{hw.title}</span>
                    <ChevronRight className="size-4 text-zinc-300" />
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  );
}
