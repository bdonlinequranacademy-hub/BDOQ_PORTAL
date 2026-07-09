import {
  Clock,
  Eye,
  FileCheck,
  FilePen,
  Layers,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminBlogStats,
} from "@/features/admin/components/blog/adminBlogUtils";

interface IAdminBlogStatsGridProps {
  stats: IAdminBlogStats;
  isLoading?: boolean;
  onPublishedClick?: () => void;
  onDraftClick?: () => void;
}

function formatDelta(delta: number | null): string | undefined {
  if (delta === null) return undefined;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}% vs last month`;
}

export function AdminBlogStatsGrid({
  stats,
  isLoading,
  onPublishedClick,
  onDraftClick,
}: IAdminBlogStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
      <StatCard
        label="Total Posts"
        value={isLoading ? "—" : stats.total}
        icon={<Layers className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} this month`
            : "All blog articles"
        }
      />
      <StatCard
        label="Published"
        value={isLoading ? "—" : stats.published}
        icon={<FileCheck className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.published, stats.total)}
        onClick={onPublishedClick}
      />
      <StatCard
        label="Drafts"
        value={isLoading ? "—" : stats.drafts}
        icon={<FilePen className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.drafts, stats.total)}
        onClick={onDraftClick}
      />
      <StatCard
        label="Upcoming"
        value={isLoading ? "—" : stats.upcoming}
        icon={<Clock className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint="Future publish date"
      />
      <StatCard
        label="On Public Blog"
        value={isLoading ? "—" : stats.publicVisible}
        icon={<Eye className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={formatDelta(stats.publishedDelta) ?? pctOfTotal(stats.publicVisible, stats.total)}
      />
    </div>
  );
}
