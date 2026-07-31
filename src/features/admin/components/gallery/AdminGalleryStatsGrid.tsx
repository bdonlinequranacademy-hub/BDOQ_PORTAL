import { Eye, ImageIcon, Mic, Video } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminGalleryStats,
} from "@/features/admin/components/gallery/adminGalleryUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminGalleryStatsGridProps {
  stats: IAdminGalleryStats;
  isLoading?: boolean;
}

export function AdminGalleryStatsGrid({
  stats,
  isLoading,
}: IAdminGalleryStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-5">
      <StatCard
        label={t("admin.cms.gallery.statsTotal")}
        value={isLoading ? "—" : stats.total}
        icon={<ImageIcon className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.newThisMonth) })
            : t("admin.cms.gallery.hintAllMedia")
        }
      />
      <StatCard
        label={t("admin.cms.gallery.statsPhotos")}
        value={isLoading ? "—" : stats.photo}
        icon={<ImageIcon className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={pctOfTotal(stats.photo, stats.total, t)}
      />
      <StatCard
        label={t("admin.cms.gallery.statsVideos")}
        value={isLoading ? "—" : stats.video}
        icon={<Video className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.video, stats.total, t)}
      />
      <StatCard
        label={t("admin.cms.gallery.statsAudios")}
        value={isLoading ? "—" : stats.audio}
        icon={<Mic className="size-5 text-rose-600" />}
        iconBg="bg-rose-100"
        hint={pctOfTotal(stats.audio, stats.total, t)}
      />
      <StatCard
        label={t("admin.cms.gallery.statsPublished")}
        value={isLoading ? "—" : stats.published}
        icon={<Eye className="size-5 text-sky-600" />}
        iconBg="bg-sky-100"
        hint={pctOfTotal(stats.published, stats.total, t)}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
