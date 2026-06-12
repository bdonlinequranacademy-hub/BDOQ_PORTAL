import { Bell, Check } from "lucide-react";
import {
  useParentNotifications,
  useMarkParentNotificationRead,
} from "@/features/parent/hooks/useParent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

import { PageLoading } from "@/components/ui/PageLoading";
export function ParentNotificationsPage() {
  const { data: notifications = [], isLoading } = useParentNotifications();
  const markRead = useMarkParentNotificationRead();
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
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold text-[#03214F]">{n.title}</p>
                <p className="text-sm text-zinc-600">{n.message}</p>
                <p className="text-xs text-zinc-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead.mutate(n._id)}
                  disabled={markRead.isPending}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#03214F] text-white"
                  title="Mark as read"
                >
                  <Check className="size-4" />
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
