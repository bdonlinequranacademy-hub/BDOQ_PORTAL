import { CalendarDays, CheckCircle2, Clock, Radio, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { LiveMonitorSummary } from "@/types/models";
import { computeIssueCount } from "@/features/admin/components/liveMonitor/adminLiveMonitorUtils";

interface IAdminLiveMonitorStatsGridProps {
  summary: LiveMonitorSummary;
  isLoading?: boolean;
}

export function AdminLiveMonitorStatsGrid({
  summary,
  isLoading,
}: IAdminLiveMonitorStatsGridProps) {
  const { t } = usePortalTranslation();
  const issueCount = computeIssueCount(summary);

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.liveMonitor.stats.liveNow")}
        value={isLoading ? "—" : summary.liveCount}
        icon={<Radio className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={
          summary.liveCount === 1
            ? t("admin.liveMonitor.stats.classRunning")
            : t("admin.liveMonitor.stats.classesRunning")
        }
      />
      <StatCard
        label={t("admin.liveMonitor.stats.totalToday")}
        value={isLoading ? "—" : summary.totalToday}
        icon={<CalendarDays className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.liveMonitor.stats.daySessions", { day: summary.day })}
      />
      <StatCard
        label={t("admin.liveMonitor.stats.needsAttention")}
        value={isLoading ? "—" : issueCount}
        icon={<AlertTriangle className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={t("admin.liveMonitor.stats.lateOrNoShow")}
      />
      <StatCard
        label={t("admin.liveMonitor.stats.upcoming")}
        value={isLoading ? "—" : summary.upcomingCount}
        icon={<Clock className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={t("admin.liveMonitor.stats.startingSoon")}
      />
      <StatCard
        label={t("admin.liveMonitor.stats.completed")}
        value={isLoading ? "—" : summary.completedCount}
        icon={<CheckCircle2 className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint={t("admin.liveMonitor.stats.finishedToday")}
      />
    </div>
  );
}
