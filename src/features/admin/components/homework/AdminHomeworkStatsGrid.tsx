import {
  AlertCircle,
  BookOpenCheck,
  ClipboardCheck,
  Send,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminHomeworkStats } from "@/features/admin/components/homework/adminHomeworkUtils";

interface IAdminHomeworkStatsGridProps {
  stats: IAdminHomeworkStats;
  isLoading?: boolean;
  onAwaitingGradeClick?: () => void;
  onOverdueClick?: () => void;
  onSubmittedClick?: () => void;
}

function pct(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 100)}% of total`;
}

export function AdminHomeworkStatsGrid({
  stats,
  isLoading,
  onAwaitingGradeClick,
  onOverdueClick,
  onSubmittedClick,
}: IAdminHomeworkStatsGridProps) {
  const totalDelta =
    stats.submissionRateDelta !== null
      ? `${stats.submissionRateDelta >= 0 ? "+" : ""}${stats.submissionRateDelta}% vs last month`
      : undefined;

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-4">
      <StatCard
        label="Total Assignments"
        value={isLoading ? "—" : stats.total}
        icon={<BookOpenCheck className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} this month`
            : totalDelta ?? "Academy-wide homework"
        }
      />
      <StatCard
        label="Submitted"
        value={isLoading ? "—" : stats.totalSubmissions}
        icon={<Send className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={pct(stats.totalSubmissions, Math.max(stats.totalStudents, 1))}
        onClick={onSubmittedClick}
      />
      <StatCard
        label="Awaiting Grade"
        value={isLoading ? "—" : stats.awaitingGrade}
        icon={<ClipboardCheck className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={
          stats.totalSubmissions > 0
            ? pct(stats.awaitingGrade, stats.totalSubmissions)
            : "No submissions yet"
        }
        onClick={onAwaitingGradeClick}
      />
      <StatCard
        label="Overdue"
        value={isLoading ? "—" : stats.overdue}
        icon={<AlertCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={pct(stats.overdue, stats.total)}
        onClick={onOverdueClick}
      />
    </div>
  );
}
