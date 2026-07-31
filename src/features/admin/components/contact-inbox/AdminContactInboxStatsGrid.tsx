import { CheckCircle2, Inbox, MailCheck, MessageSquare } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminContactInboxStats } from "@/features/admin/components/contact-inbox/adminContactInboxUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminContactInboxStatsGridProps {
  stats: IAdminContactInboxStats;
  isLoading?: boolean;
}

export function AdminContactInboxStatsGrid({
  stats,
  isLoading,
}: IAdminContactInboxStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-4">
      <StatCard
        label={t("admin.contact.statsAll")}
        value={isLoading ? "—" : stats.total}
        icon={<Inbox className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newToday > 0
            ? t("stats.today", { count: formatNumber(stats.newToday) })
            : t("admin.trialLeads.sourceWebsite")
        }
      />
      <StatCard
        label={t("shared.status.unread")}
        value={isLoading ? "—" : stats.new}
        icon={<MessageSquare className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={t("admin.contact.statsNeedsReply")}
      />
      <StatCard
        label={t("admin.contact.statsReplied")}
        value={isLoading ? "—" : stats.replied}
        icon={<MailCheck className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={
          stats.repliedThisWeek > 0
            ? t("stats.thisWeek", { count: formatNumber(stats.repliedThisWeek) })
            : t("admin.contact.statsReplied")
        }
      />
      <StatCard
        label={t("admin.contact.statsArchived")}
        value={isLoading ? "—" : stats.closed}
        icon={<CheckCircle2 className="size-5 text-zinc-600" />}
        iconBg="bg-zinc-100"
        className="col-span-2 xl:col-span-1"
        hint={t("shared.status.resolved")}
      />
    </div>
  );
}
