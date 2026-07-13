import { HardDrive, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { IAdminResourcesStats } from "@/features/admin/components/resources/adminResourcesUtils";

interface IAdminResourcesAssetsCardProps {
  stats: IAdminResourcesStats;
}

export function AdminResourcesAssetsCard({ stats }: IAdminResourcesAssetsCardProps) {
  const pct =
    stats.total > 0 ? Math.round((stats.withFile / stats.total) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center gap-2">
        <HardDrive className="size-4 text-primary" aria-hidden />
        <h2 className="text-sm font-bold text-portal-heading">Assets Overview</h2>
      </div>
      <p className="mt-3 text-sm text-portal-muted">
        <span className="font-bold text-portal-heading">{stats.withFile}</span> of{" "}
        <span className="font-bold text-portal-heading">{stats.total}</span> resources
        have media files
      </p>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-portal-muted/40">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-portal-muted">{pct}% with uploads</p>
    </Card>
  );
}

interface IAdminResourcesTipBannerProps {
  draftCount: number;
}

export function AdminResourcesTipBanner({
  draftCount,
}: IAdminResourcesTipBannerProps) {
  return (
    <Card className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Lightbulb className="size-4 text-amber-700" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-900">Tips</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/90">
            {draftCount > 0
              ? `${draftCount} draft resource${draftCount === 1 ? "" : "s"} waiting to publish. Mark as Featured for homepage / hero placement.`
              : "Use clear titles and short descriptions. Featured items appear in hero players on audio and video pages."}
          </p>
        </div>
      </div>
    </Card>
  );
}
