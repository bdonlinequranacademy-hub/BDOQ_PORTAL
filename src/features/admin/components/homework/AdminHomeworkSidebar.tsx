import { Card } from "@/components/ui/Card";
import type { AdminHomeworkItem } from "@/types/models";
import {
  buildHomeworkActivity,
  getHomeworkClassTitle,
  getUpcomingDeadlines,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { formatHomeworkDueLabel } from "@/lib/homeworkDue";

interface IAdminHomeworkSidebarProps {
  items: AdminHomeworkItem[];
}

function UpcomingDeadlines({ items }: { items: AdminHomeworkItem[] }) {
  const deadlines = getUpcomingDeadlines(items, 4);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Upcoming deadlines</h2>
      {deadlines.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">No upcoming due dates.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {deadlines.map((item) => (
            <div
              key={item._id}
              className="rounded-xl border border-portal/80 bg-portal-muted/20 px-3 py-2.5"
            >
              <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
              <p className="text-xs text-portal-muted">{getHomeworkClassTitle(item)}</p>
              <p className="mt-1 text-xs font-semibold text-primary">
                {formatHomeworkDueLabel(item.dueDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentActivity({ items }: { items: AdminHomeworkItem[] }) {
  const activity = buildHomeworkActivity(items);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Recent assignments</h2>
      {activity.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">No recent homework yet.</p>
      ) : (
        <div className="mt-4 flex max-h-[280px] flex-col gap-3 overflow-y-auto pr-1">
          {activity.map((item) => (
            <div key={item.id} className="relative border-l-2 border-primary/25 pl-3">
              <p className="text-xs font-semibold tabular-nums text-primary">{item.timeLabel}</p>
              <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
              {item.detail ? <p className="text-xs text-portal-muted">{item.detail}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AdminHomeworkSidebar({ items }: IAdminHomeworkSidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      <UpcomingDeadlines items={items} />
      <RecentActivity items={items} />
    </aside>
  );
}
