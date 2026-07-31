import { HardDrive, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { IAdminResourcesStats } from "@/features/admin/components/resources/adminResourcesUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminResourcesAssetsCardProps {
  stats: IAdminResourcesStats;
}

export function AdminResourcesAssetsCard({ stats }: IAdminResourcesAssetsCardProps) {
  const { t, formatNumber } = usePortalTranslation();

  const pct =
    stats.total > 0 ? Math.round((stats.withFile / stats.total) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center gap-2">
        <HardDrive className="size-4 text-primary" aria-hidden />
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.cms.resources.assetsOverview")}
        </h2>
      </div>
      <p className="mt-3 text-sm text-portal-muted">
        {t("admin.cms.resources.assetsDesc", {
          withFile: formatNumber(stats.withFile),
          total: formatNumber(stats.total),
        })}
      </p>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-portal-muted/40">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-portal-muted">
        {t("admin.cms.resources.withUploads", { pct: String(pct) })}
      </p>
    </Card>
  );
}

interface IAdminResourcesTipBannerProps {
  draftCount: number;
}

export function AdminResourcesTipBanner({
  draftCount,
}: IAdminResourcesTipBannerProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Lightbulb className="size-4 text-amber-700" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-900">
            {t("admin.cms.resources.tipsTitle")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/90">
            {draftCount > 0
              ? t("admin.cms.resources.tipDraftResources", {
                  count: formatNumber(draftCount),
                })
              : t("admin.cms.resources.tipDefaultResources")}
          </p>
        </div>
      </div>
    </Card>
  );
}
