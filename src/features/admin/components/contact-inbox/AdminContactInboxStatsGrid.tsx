import { CheckCircle2, Inbox, MailCheck, MessageSquare } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminContactInboxStats } from "@/features/admin/components/contact-inbox/adminContactInboxUtils";

interface IAdminContactInboxStatsGridProps {
  stats: IAdminContactInboxStats;
  isLoading?: boolean;
}

export function AdminContactInboxStatsGrid({
  stats,
  isLoading,
}: IAdminContactInboxStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label="All messages"
        value={isLoading ? "—" : stats.total}
        icon={<Inbox className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={stats.newToday > 0 ? `+${stats.newToday} today` : "Website enquiries"}
      />
      <StatCard
        label="New"
        value={isLoading ? "—" : stats.new}
        icon={<MessageSquare className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint="Requires reply"
      />
      <StatCard
        label="Replied"
        value={isLoading ? "—" : stats.replied}
        icon={<MailCheck className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={
          stats.repliedThisWeek > 0
            ? `${stats.repliedThisWeek} this week`
            : "Follow-up sent"
        }
      />
      <StatCard
        label="Closed"
        value={isLoading ? "—" : stats.closed}
        icon={<CheckCircle2 className="size-5 text-zinc-600" />}
        iconBg="bg-zinc-100"
        className="col-span-2 xl:col-span-1"
        hint="Resolved"
      />
    </div>
  );
}
