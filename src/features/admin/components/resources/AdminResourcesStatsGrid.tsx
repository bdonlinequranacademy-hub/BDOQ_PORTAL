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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

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
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-5">
      <StatCard
        label={t("admin.cms.resources.statsTotal")}
        value={isLoading ? "—" : stats.total}
        icon={<FileText className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.newThisMonth) })
            : t("admin.cms.resources.hintAllResources")
        }
      />
      <StatCard
        label={t("admin.cms.resources.statsEbooks")}
        value={isLoading ? "—" : stats.ebook}
        icon={<BookOpen className="size-5 text-sky-600" />}
        iconBg="bg-sky-100"
        hint={pctOfTotal(stats.ebook, stats.total, t)}
        onClick={onEbookClick}
      />
      <StatCard
        label={t("admin.cms.testimonials.mediaAudio")}
        value={isLoading ? "—" : stats.audio}
        icon={<Headphones className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={pctOfTotal(stats.audio, stats.total, t)}
        onClick={onAudioClick}
      />
      <StatCard
        label={t("admin.cms.gallery.statsVideos")}
        value={isLoading ? "—" : stats.video}
        icon={<Video className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.video, stats.total, t)}
        onClick={onVideoClick}
      />
      <StatCard
        label={t("admin.common.statPublished")}
        value={isLoading ? "—" : stats.published}
        icon={<Eye className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={t("admin.cms.resources.featuredDraftHint", {
          featured: formatNumber(stats.featured),
          draft: formatNumber(stats.draft),
        })}
        onClick={onPublishedClick}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
