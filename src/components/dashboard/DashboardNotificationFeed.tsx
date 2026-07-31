import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export interface INotificationFeedItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBg?: string;
  unread?: boolean;
  onClick?: () => void;
}

interface IDashboardNotificationFeedProps {
  items: INotificationFeedItem[];
  emptyMessage?: string;
}

export function DashboardNotificationFeed({
  items,
  emptyMessage,
}: IDashboardNotificationFeedProps) {
  const { t } = usePortalTranslation();
  const empty = emptyMessage ?? t("dashboard.noNotifications");

  if (items.length === 0) {
    return <p className="text-sm text-portal-muted">{empty}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const content = (
          <>
            {item.icon ? (
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  item.iconBg ?? "bg-primary/10"
                )}
              >
                {item.icon}
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-portal-heading">
                {item.title}
              </p>
              {item.subtitle ? (
                <p className="mt-0.5 line-clamp-2 text-xs text-portal-muted">{item.subtitle}</p>
              ) : null}
            </div>
          </>
        );

        if (item.onClick) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:opacity-90",
                item.unread ? "bg-primary/5 ring-1 ring-primary/10" : "bg-portal-muted"
              )}
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-xl p-3",
              item.unread ? "bg-primary/5" : "bg-portal-muted"
            )}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
