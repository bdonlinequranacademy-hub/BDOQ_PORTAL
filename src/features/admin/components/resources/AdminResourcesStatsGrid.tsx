import {
  BookOpen,
  Eye,
  FileText,
  Headphones,
  Video,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminResourcesStats,
} from "@/features/admin/components/resources/adminResourcesUtils";

interface IAdminResourcesStatsGridProps {
  stats: IAdminResourcesStats;
  isLoading?: boolean;
  onEbookClick?: () => void;
  onAudioClick?: () => void;
  onVideoClick?: () => void;
  onPublishedClick?: () => void;
}

export function AdminResourcesStatsGrid({
  stats,
  isLoading,
  onEbookClick,
  onAudioClick,
  onVideoClick,
  onPublishedClick,
}: IAdminResourcesStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      <StatCard
        label="Total Resources"
        value={isLoading ? "—" : stats.total}
        icon={<FileText className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} this month`
            : "All CMS resources"
        }
      />
      <StatCard
        label="E-books"
        value={isLoading ? "—" : stats.ebook}
        icon={<BookOpen className="size-5 text-sky-600" />}
        iconBg="bg-sky-100"
        hint={pctOfTotal(stats.ebook, stats.total)}
        onClick={onEbookClick}
      />
      <StatCard
        label="Audio"
        value={isLoading ? "—" : stats.audio}
        icon={<Headphones className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={pctOfTotal(stats.audio, stats.total)}
        onClick={onAudioClick}
      />
      <StatCard
        label="Videos"
        value={isLoading ? "—" : stats.video}
        icon={<Video className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.video, stats.total)}
        onClick={onVideoClick}
      />
      <StatCard
        label="Published"
        value={isLoading ? "—" : stats.published}
        icon={<Eye className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={`${stats.featured} featured · ${stats.draft} draft`}
        onClick={onPublishedClick}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
