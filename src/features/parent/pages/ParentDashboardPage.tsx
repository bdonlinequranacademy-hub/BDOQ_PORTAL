import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Bell,
} from "lucide-react";
import {
  useParentChildren,
  useSelectedChildId,
  useParentChildClasses,
  useParentChildHomework,
  useParentChildAttendance,
  useParentChildProgress,
  useParentNotifications,
} from "@/features/parent/hooks/useParent";
import { ChildSelector } from "@/features/parent/components/ChildSelector";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export function ParentDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: children = [] } = useParentChildren();
  const childId = useSelectedChildId() ?? "";

  const { data: classes = [] } = useParentChildClasses(childId);
  const { data: homework = [] } = useParentChildHomework(childId);
  const { data: attendance } = useParentChildAttendance(childId);
  const { data: progress = [] } = useParentChildProgress(childId);
  const { data: notifications = [] } = useParentNotifications();

  const pendingHw = homework.filter((h) => !h.submitted);
  const overdueHw = pendingHw.filter((h) => isOverdue(h.dueDate));
  const latestProgress = progress[0];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      <div>
        <span className="text-sm text-zinc-500">Assalamu Alaikum,</span>
        <h1 className="text-2xl font-bold text-[#03214F] lg:text-3xl">
          {user?.name ?? "Parent"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Your child&apos;s learning overview</p>
      </div>

      <ChildSelector />

      {!childId && children.length === 0 ? null : !childId ? (
        <p className="text-sm text-zinc-400">Select a child to view their data.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Classes", value: classes.length, color: "text-[#2b7fff]" },
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#03214F]">Enrolled Classes</span>
                <button
                  onClick={() => navigate("/parent/homework")}
                  className="text-xs font-semibold text-[#C4922B]"
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
                      <p className="font-semibold text-[#03214F]">{cls.title}</p>
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
                    <TrendingUp className="size-5 text-[#C4922B]" />
                    <span className="font-bold text-[#03214F]">Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-[#03214F]">
                    {latestProgress.tajweedScore}% Tajweed
                  </p>
                  <button
                    onClick={() => navigate("/parent/progress")}
                    className="text-sm font-semibold text-[#C4922B]"
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
                  <span className="text-sm font-semibold text-[#03214F]">Attendance</span>
                </button>
                <button
                  onClick={() => navigate("/parent/notifications")}
                  className="relative flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <Bell className="size-5 text-[#03214F]" />
                  <span className="text-sm font-semibold text-[#03214F]">Alerts</span>
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
              <span className="mb-3 block font-bold text-[#03214F]">Homework due soon</span>
              <div className="flex flex-col gap-2">
                {pendingHw.slice(0, 3).map((hw) => (
                  <button
                    key={hw._id}
                    onClick={() => navigate("/parent/homework")}
                    className="flex items-center justify-between rounded-xl bg-[#F8FAFF] px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium text-[#03214F]">{hw.title}</span>
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
