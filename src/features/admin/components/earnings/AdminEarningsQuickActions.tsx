import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface IAdminEarningsQuickActionsProps {
  pendingCount: number;
  isFetching: boolean;
  onExport: () => void;
  onRefresh: () => void;
  onReviewPending: () => void;
}

const actionTileClass =
  "flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 p-3.5 text-left transition hover:border-primary/25 hover:bg-primary/5";

export function AdminEarningsQuickActions({
  pendingCount,
  isFetching,
  onExport,
  onRefresh,
  onReviewPending,
}: IAdminEarningsQuickActionsProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">
        {t("admin.cms.shared.quickActions")}
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={onReviewPending} className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-amber-100">
            <CheckCircle2 className="size-4 text-amber-700" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">
            {t("admin.earnings.quickClassLogs")}
            {pendingCount > 0 ? ` (${formatNumber(pendingCount)})` : ""}
          </span>
        </button>
        <button type="button" onClick={onExport} className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Download className="size-4 text-primary" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">
            {t("admin.earnings.quickExport")}
          </span>
        </button>
        <Link to="/admin/class-logs" className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-100">
            <ClipboardCheck className="size-4 text-blue-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">
            {t("admin.classLogs.title")}
          </span>
        </Link>
        <Link to="/admin/class-logs" className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-violet-100">
            <FileText className="size-4 text-violet-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">
            {t("admin.earnings.sidebarRecentVerified")}
          </span>
        </Link>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary disabled:opacity-50"
      >
        <RefreshCw
          className={cn("size-4 text-primary", isFetching && "animate-spin")}
          aria-hidden
        />
        {isFetching ? t("admin.trialLeads.refreshing") : t("admin.earnings.quickRefresh")}
      </button>
    </Card>
  );
}
