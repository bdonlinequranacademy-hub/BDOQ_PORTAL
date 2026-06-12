import { Bell, Check } from "lucide-react";
import {
  useTeacherNotifications,
  useMarkTeacherNotificationRead,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

import { PageLoading } from "@/components/ui/PageLoading";
export function TeacherNotificationsPage() {
  const { data: notifications = [], isLoading } = useTeacherNotifications();
  const markRead = useMarkTeacherNotificationRead();

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Notifications</h1>
          <p className="text-sm text-zinc-500">
            {unread.length} unread of {notifications.length}
          </p>
        </div>
        <Bell className="size-6 text-[#C4922B]" />
      </div>

      {isLoading ? (
        <PageLoading />
      ) : notifications.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-sm text-zinc-400">No notifications yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <Card
              key={n._id}
              className={`flex items-start gap-4 rounded-2xl border-0 p-4 shadow-sm ${
                !n.isRead ? "bg-[#F8FAFF]" : "bg-white"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#03214F]">{n.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{n.message}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead ? (
                <button
                  type="button"
                  onClick={() => markRead.mutate(n._id)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#03214F]/8 text-[#03214F]"
                  title="Mark as read"
                >
                  <Check className="size-4" />
                </button>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
