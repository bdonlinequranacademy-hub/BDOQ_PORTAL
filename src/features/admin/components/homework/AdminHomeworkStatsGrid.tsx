import {
  AlertCircle,
  BookOpenCheck,
  ClipboardCheck,
  Send,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminHomeworkStats } from "@/features/admin/components/homework/adminHomeworkUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkStatsGridProps {
  stats: IAdminHomeworkStats;
  isLoading?: boolean;
  onAwaitingGradeClick?: () => void;
  onOverdueClick?: () => void;
  onSubmittedClick?: () => void;
}

export function AdminHomeworkStatsGrid({
  stats,
  isLoading,
  onAwaitingGradeClick,
  onOverdueClick,
  onSubmittedClick,
}: IAdminHomeworkStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  const pctOfTotal = (part: number, total: number): string => {
    const pctValue =
      total <= 0 ? 0 : Math.round((part / total) * 100);
    return t("labels.of_total", { pct: `${formatNumber(pctValue)}%` });
  };

  const totalDelta =
    stats.submissionRateDelta !== null
      ? t("admin.homework.statsVsLastMonth", {
          delta: `${stats.submissionRateDelta >= 0 ? "+" : ""}${formatNumber(stats.submissionRateDelta)}`,
        })
      : undefined;

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-4">
      <StatCard
        label={t("admin.homework.statsTotalAssignments")}
        value={isLoading ? "—" : formatNumber(stats.total)}
        icon={<BookOpenCheck className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("admin.homework.statsNewThisMonth", {
                count: String(stats.newThisMonth),
              })
            : totalDelta ?? t("admin.homework.statsAcademyWide")
        }
      />
      <StatCard
        label={t("admin.homework.statsSubmitted")}
        value={isLoading ? "—" : formatNumber(stats.totalSubmissions)}
        icon={<Send className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={pctOfTotal(stats.totalSubmissions, Math.max(stats.totalStudents, 1))}
        onClick={onSubmittedClick}
      />
      <StatCard
        label={t("admin.homework.statsAwaitingGrade")}
        value={isLoading ? "—" : formatNumber(stats.awaitingGrade)}
        icon={<ClipboardCheck className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={
          stats.totalSubmissions > 0
            ? pctOfTotal(stats.awaitingGrade, stats.totalSubmissions)
            : t("admin.homework.statsNoSubmissionsYet")
        }
        onClick={onAwaitingGradeClick}
      />
      <StatCard
        label={t("admin.homework.statsOverdue")}
        value={isLoading ? "—" : formatNumber(stats.overdue)}
        icon={<AlertCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={pctOfTotal(stats.overdue, stats.total)}
        onClick={onOverdueClick}
      />
    </div>
  );
}
