import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  Video,
  ChevronRight,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
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
import { Card } from "@/components/ui/Card";
import { SessionSlotCard } from "@/components/schedule/SessionSlotCard";
import { sortSessionsByAcademyTime } from "@/lib/utils/schedule";
import { classTitle, teacherName } from "@/lib/utils/class";
import { StudentCurriculumPlan } from "@/components/curriculum/StudentCurriculumPlan";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";

import { PageLoading } from "@/components/ui/PageLoading";
function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: classes = [], isLoading: classesLoading } = useStudentClasses();
  const { data: homework = [] } = useStudentHomework();
  const { data: progress = [] } = useStudentProgress();
  const { data: notifications = [] } = useStudentNotifications();
  const { data: todaySchedule, isLoading: scheduleLoading } = useStudentTodaySchedule();
  const markRead = useMarkNotificationRead();
  const { data: curriculumPlan = [] } = useStudentCurriculumPlan();

  const todaySessions = sortSessionsByAcademyTime(todaySchedule?.sessions ?? []);

  const pendingHw = homework.filter((h) => !h.submitted);
  const overdueHw = pendingHw.filter((h) => isOverdue(h.dueDate));
  const latestProgress = progress[0];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      <div>
        <span className="text-sm text-zinc-500">Assalamu Alaikum,</span>
        <h1 className="text-2xl font-bold text-[#03214F] lg:text-3xl">
          {user?.name ?? "Student"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your student account — classes, progress & weekly summaries
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Classes", value: classes.length, color: "text-[#2b7fff]" },
          { label: "Due homework", value: pendingHw.length, color: "text-amber-600" },
          { label: "Overdue", value: overdueHw.length, color: "text-red-500" },
          { label: "Notifications", value: unreadCount, color: "text-[#03214F]" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-0 p-4 shadow-sm">
            <span className="text-xs text-zinc-400">{s.label}</span>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {curriculumPlan.length > 0 ? (
        <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#03214F]">My study plan</span>
            <button
              type="button"
              onClick={() => navigate("/student/progress")}
              className="text-xs font-semibold text-[#C4922B]"
            >
              View progress
            </button>
          </div>
          <StudentCurriculumPlan assignments={curriculumPlan} />
          {latestProgress?.curriculumLabels?.program ? (
            <p className="text-xs text-zinc-500">
              Latest class update: {formatCurriculumPath(latestProgress.curriculumLabels)}
            </p>
          ) : null}
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#03214F]">
                Today&apos;s Classes
                {todaySchedule?.day ? (
                  <span className="ml-2 text-xs font-medium text-zinc-400">
                    ({todaySchedule.day})
                  </span>
                ) : null}
              </span>
              <span className="rounded-full bg-[#2b7fff]/10 px-3 py-1 text-xs font-semibold text-[#2b7fff]">
                {scheduleLoading ? "…" : `${todaySessions.length} today`}
              </span>
            </div>
            {scheduleLoading ? (
              <PageLoading label="Loading schedule…" />
            ) : todaySessions.length === 0 ? (
              <p className="text-sm text-zinc-400">No classes scheduled for today.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {todaySessions.map((session) => (
                  <SessionSlotCard
                    key={session._id}
                    session={session}
                    showStudentMeta={false}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#03214F]">My Classes</span>
              <button
                onClick={() => navigate("/student/classes")}
                className="text-xs font-semibold text-[#C4922B]"
              >
                View all
              </button>
            </div>
            {classesLoading ? (
              <PageLoading />
            ) : classes.length === 0 ? (
              <p className="text-sm text-zinc-400">No classes enrolled yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {classes.slice(0, 4).map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => navigate(`/student/classes/${cls._id}`)}
                    className="flex flex-col gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-left"
                  >
                    <span className="font-semibold text-[#03214F]">{classTitle(cls)}</span>
                    <span className="text-xs text-zinc-400">
                      {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
                    </span>
                    {cls.meetingLink && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#2b7fff]">
                        <Video className="size-3" />
                        Join class
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#03214F]">Homework Due</span>
              <button
                onClick={() => navigate("/student/homework")}
                className="text-xs font-semibold text-[#C4922B]"
              >
                View all
              </button>
            </div>
            {pendingHw.length === 0 ? (
              <p className="text-sm text-zinc-400">You're all caught up!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingHw.slice(0, 3).map((hw) => (
                  <button
                    key={hw._id}
                    onClick={() => navigate(`/student/homework/${hw._id}`)}
                    className={`flex items-center justify-between rounded-2xl border-l-4 p-3 text-left ${
                      isOverdue(hw.dueDate)
                        ? "border-l-red-500 bg-red-50/50"
                        : "border-l-[#C4922B] bg-[#FDF3E0]/40"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#03214F]">{hw.title}</p>
                      <p className="text-xs text-zinc-400">
                        Due {new Date(hw.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-zinc-300" />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {latestProgress && (
            <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-[#C4922B]" />
                <span className="font-bold text-[#03214F]">My Progress</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm text-zinc-500">Tajweed score</span>
                <span className="text-2xl font-bold text-[#03214F]">
                  {latestProgress.tajweedScore}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-[#C4922B]"
                  style={{ width: `${latestProgress.tajweedScore}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400">
                {latestProgress.surahsCompleted?.length ?? 0} surahs memorized
              </p>
              <button
                onClick={() => navigate("/student/progress")}
                className="text-sm font-semibold text-[#C4922B]"
              >
                View progress →
              </button>
            </Card>
          )}

          <button
            onClick={() => navigate("/student/summary")}
            className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 p-5 text-left text-white"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/15">
              <MessageSquare className="size-5 text-emerald-100" />
            </div>
            <div>
              <p className="font-bold">Weekly Summary</p>
              <p className="text-xs text-white/70">Verified weekly update from portal records</p>
            </div>
          </button>

          <Card className="flex flex-col gap-3 rounded-3xl border-0 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-[#03214F]" />
              <span className="font-bold text-[#03214F]">Notifications</span>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-zinc-400">No notifications.</p>
            ) : (
              notifications.slice(0, 4).map((n) => (
                <button
                  key={n._id}
                  onClick={() => {
                    if (!n.isRead) markRead.mutate(n._id);
                  }}
                  className={`rounded-xl p-3 text-left ${
                    n.isRead ? "bg-zinc-50" : "bg-[#EEF2F8]"
                  }`}
                >
                  <p className="text-sm font-medium text-[#03214F]">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-zinc-400">{n.message}</p>
                </button>
              ))
            )}
            <button
              onClick={() => navigate("/student/notifications")}
              className="text-sm font-semibold text-[#C4922B]"
            >
              See all →
            </button>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate("/student/attendance")}
              className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
            >
              <ClipboardList className="size-5 text-teal-600" />
              <span className="text-sm font-semibold text-[#03214F]">Attendance</span>
            </button>
            <button
              onClick={() => navigate("/student/classes")}
              className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
            >
              <BookOpen className="size-5 text-[#2b7fff]" />
              <span className="text-sm font-semibold text-[#03214F]">Classes</span>
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
