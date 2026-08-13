import { Link } from "react-router-dom";
import { CalendarDays, Copy, ExternalLink, Radio, RefreshCw } from "lucide-react";
import type { LiveMonitorSummary } from "@/types/models";
import { computeIssueCount } from "@/features/admin/components/liveMonitor/adminLiveMonitorUtils";
import { formatAmPmTime } from "@/i18n/format";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface IAdminLiveMonitorHeroProps {
  summary: LiveMonitorSummary;
  updatedAt?: string;
  isFetching: boolean;
  onRefresh: () => void;
}

export function AdminLiveMonitorHero({
  summary,
  updatedAt,
  isFetching,
  onRefresh,
}: IAdminLiveMonitorHeroProps) {
  const { t } = usePortalTranslation();
  const isLive = summary.liveCount > 0;
  const issueCount = computeIssueCount(summary);

  const updatedTime = updatedAt ? formatAmPmTime(updatedAt) : null;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-6",
        isLive
          ? "border-red-500/25 bg-gradient-to-r from-red-500/8 via-portal-surface to-portal-surface"
          : "border-portal bg-portal-surface"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
              {t("admin.liveMonitor.title")}
            </h1>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                <span className="size-2 animate-pulse rounded-full bg-white" />
                {t("admin.liveMonitor.liveNow")}
              </span>
            ) : (
              <span className="rounded-full border border-portal bg-portal-muted/40 px-3 py-1 text-xs font-semibold text-portal-muted">
                {t("admin.liveMonitor.noLiveClasses")}
              </span>
            )}
          </div>
          <p className="portal-page-subtitle mt-2 max-w-3xl text-portal-muted">
            {t("admin.liveMonitor.heroSubtitle")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-portal-muted">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-portal bg-portal-muted/30 px-2.5 py-1.5">
              <CalendarDays className="size-3.5" aria-hidden />
              {summary.day}, {summary.sessionDate}
            </span>
            {updatedTime ? (
              <span className="rounded-lg border border-portal bg-portal-muted/30 px-2.5 py-1.5">
                {t("admin.liveMonitor.updatedAt", { time: updatedTime })}
              </span>
            ) : null}
            {issueCount > 0 ? (
              <span className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 font-semibold text-amber-800">
                {issueCount === 1
                  ? t("admin.liveMonitor.issuesNeedAttention", { count: String(issueCount) })
                  : t("admin.liveMonitor.issuesNeedAttentionPlural", {
                      count: String(issueCount),
                    })}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:bg-portal-muted/50 disabled:opacity-60"
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden />
            {t("admin.liveMonitor.refresh")}
          </button>
          <Link
            to="/admin/schedule/routine"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <Radio className="size-4" aria-hidden />
            {t("admin.liveMonitor.viewRoutine")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminLiveMonitorSessionCode({
  code,
  onCopy,
}: {
  code: string;
  onCopy: () => void;
}) {
  const { t } = usePortalTranslation();

  return (
    <div className="rounded-xl border border-portal bg-portal-muted/25 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-portal-muted">
        {t("admin.liveMonitor.sessionCode")}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="font-mono text-sm font-bold text-portal-heading">{code}</p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary"
          aria-label={t("admin.liveMonitor.copySessionCode")}
        >
          <Copy className="size-4" aria-hidden />
        </button>
      </div>
      <p className="mt-1 text-[11px] text-portal-muted">{t("admin.liveMonitor.sessionCodeHint")}</p>
    </div>
  );
}

export function AdminLiveMonitorOpenLink({
  href,
  label,
}: {
  href: string;
  label?: string;
}) {
  const { t } = usePortalTranslation();
  const linkLabel = label ?? t("admin.liveMonitor.openMeetingLink");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b7fff] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a6fe8]"
    >
      <ExternalLink className="size-4" aria-hidden />
      {linkLabel}
    </a>
  );
}
