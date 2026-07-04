import { Bell, Check } from "lucide-react";
import {
  useTeacherNotifications,
  useMarkTeacherNotificationRead,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";

export function TeacherNotificationsPage() {
  const { data: notifications = [], isLoading } = useTeacherNotifications();
  const markRead = useMarkTeacherNotificationRead();

  const unread = notifications.filter((n) => !n.isRead);
  const pagination = usePaginatedList(notifications);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Notifications</h1>
          <p className="text-sm text-zinc-500">
            {unread.length} unread of {notifications.length}
          </p>
        </div>
        <Bell className="size-6 text-gold" />
      </div>

      {isLoading ? (
        <PageLoading />
      ) : notifications.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-sm text-zinc-400">No notifications yet.</p>
        </Card>
      ) : (
        <>
        <div className="flex flex-col gap-3">
          {pagination.paginatedItems.map((n) => (
            <Card
              key={n._id}
              className={`flex items-start gap-4 rounded-2xl border-0 p-4 shadow-sm ${
                !n.isRead ? "bg-[#F8FAFF]" : "bg-white"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-primary-dark">{n.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{n.message}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead ? (
                <button
                  type="button"
                  onClick={() => markRead.mutate(n._id)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-dark/8 text-primary-dark"
                  title="Mark as read"
                >
                  <Check className="size-4" />
                </button>
              ) : null}
            </Card>
          ))}
        </div>
        <Pagination pagination={pagination} itemLabel="notifications" />
        </>
      )}
    </PageContainer>
  );
}
