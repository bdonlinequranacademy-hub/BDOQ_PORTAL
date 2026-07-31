import {
  Clock,
  Eye,
  FileCheck,
  FilePen,
  Layers,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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

export function AdminBlogStatsGrid({
  stats,
  isLoading,
  onPublishedClick,
  onDraftClick,
}: IAdminBlogStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  function formatDelta(delta: number | null): string | undefined {
    if (delta === null) return undefined;
    const sign = delta >= 0 ? "+" : "";
    return t("admin.cms.shared.hintVsLastMonth", {
      pct: `${sign}${formatNumber(delta)}`,
    });
  }

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.cms.shared.statTotalPosts")}
        value={isLoading ? "—" : stats.total}
        icon={<Layers className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.newThisMonth) })
            : t("admin.cms.shared.hintAllArticles")
        }
      />
      <StatCard
        label={t("admin.common.statPublished")}
        value={isLoading ? "—" : stats.published}
        icon={<FileCheck className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.published, stats.total, t)}
        onClick={onPublishedClick}
      />
      <StatCard
        label={t("admin.cms.shared.statDrafts")}
        value={isLoading ? "—" : stats.drafts}
        icon={<FilePen className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.drafts, stats.total, t)}
        onClick={onDraftClick}
      />
      <StatCard
        label={t("admin.cms.shared.statUpcoming")}
        value={isLoading ? "—" : stats.upcoming}
        icon={<Clock className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={t("admin.cms.shared.hintFuturePublish")}
      />
      <StatCard
        label={t("admin.cms.shared.statOnPublicBlog")}
        value={isLoading ? "—" : stats.publicVisible}
        icon={<Eye className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={formatDelta(stats.publishedDelta) ?? pctOfTotal(stats.publicVisible, stats.total, t)}
      />
    </div>
  );
}
