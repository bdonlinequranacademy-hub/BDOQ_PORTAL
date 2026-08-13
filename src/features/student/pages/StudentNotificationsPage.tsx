import { Bell, Check } from "lucide-react";
import {
  useStudentNotifications,
  useMarkNotificationRead,
} from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentNotificationsPage() {
  const { t, formatDateTime } = usePortalTranslation();
  const { data: notifications = [], isLoading } = useStudentNotifications();
  const markRead = useMarkNotificationRead();

  const unread = notifications.filter((n) => !n.isRead);
  const pagination = usePaginatedList(notifications);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">{t("student.notifications")}</h1>
          <p className="text-sm text-zinc-500">
            {t("student.unreadOfTotal", {
              unread: String(unread.length),
              total: String(notifications.length),
            })}
          </p>
        </div>
        <Bell className="size-6 text-gold" />
      </div>

      {isLoading ? (
        <PageLoading />
      ) : notifications.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-sm text-zinc-400">{t("student.noNotificationsYet")}</p>
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
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-semibold text-primary-dark">{n.title}</p>
                  <p className="text-sm text-zinc-600">{n.message}</p>
                  <p className="text-xs text-zinc-400">
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markRead.mutate(n._id)}
                    disabled={markRead.isPending}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-dark text-white"
                    title={t("student.markAsRead")}
                  >
                    <Check className="size-4" />
                  </button>
                )}
              </Card>
            ))}
          </div>
          <Pagination pagination={pagination} itemLabel="notifications" />
        </>
      )}
    </PageContainer>
  );
}
