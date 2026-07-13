import { Eye, ImageIcon, Mic, Video } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminGalleryStats,
} from "@/features/admin/components/gallery/adminGalleryUtils";

interface IAdminGalleryStatsGridProps {
  stats: IAdminGalleryStats;
  isLoading?: boolean;
}

export function AdminGalleryStatsGrid({
  stats,
  isLoading,
}: IAdminGalleryStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      <StatCard
        label="Total Items"
        value={isLoading ? "—" : stats.total}
        icon={<ImageIcon className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} this month`
            : "All gallery media"
        }
      />
      <StatCard
        label="Photos"
        value={isLoading ? "—" : stats.photo}
        icon={<ImageIcon className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={pctOfTotal(stats.photo, stats.total)}
      />
      <StatCard
        label="Videos"
        value={isLoading ? "—" : stats.video}
        icon={<Video className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.video, stats.total)}
      />
      <StatCard
        label="Audios"
        value={isLoading ? "—" : stats.audio}
        icon={<Mic className="size-5 text-rose-600" />}
        iconBg="bg-rose-100"
        hint={pctOfTotal(stats.audio, stats.total)}
      />
      <StatCard
        label="Published"
        value={isLoading ? "—" : stats.published}
        icon={<Eye className="size-5 text-sky-600" />}
        iconBg="bg-sky-100"
        hint={pctOfTotal(stats.published, stats.total)}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
