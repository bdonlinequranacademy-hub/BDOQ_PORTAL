import { Link } from "react-router-dom";
import {
  Download,
  GraduationCap,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { TrialBookingView } from "@/types/models";
import { TrialLeadStatusBadge } from "@/features/admin/components/trial-leads/TrialLeadStatusBadge";
import {
  computeTrialLeadsStats,
  exportTrialLeadsFile,
  getTodayLeads,
  groupLeadSources,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

const SOURCE_COLORS = ["#32C991", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#14B8A6"];

interface IAdminTrialLeadsSidebarProps {
  leads: TrialBookingView[];
  filteredLeads: TrialBookingView[];
  isFetching: boolean;
  onRefresh: () => void;
  onReviewNew: () => void;
}

function LeadSourcesChart({ leads }: { leads: TrialBookingView[] }) {
  const { t, formatNumber } = usePortalTranslation();
  const sources = groupLeadSources(leads, t).slice(0, 5);
  const total = Math.max(leads.length, 1);

  let cursor = 0;
  const gradient = sources
    .map((source, index) => {
      const pct = (source.count / total) * 100;
      const start = cursor;
      cursor += pct;
      const color = SOURCE_COLORS[index % SOURCE_COLORS.length];
      return `${color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.trialLeads.sidebarLeadSources")}
      </h2>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{formatNumber(leads.length)}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              {t("stats.total")}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
          {sources.length === 0 ? (
            <p className="text-portal-muted">{t("admin.trialLeads.sidebarNoSourceData")}</p>
          ) : (
            sources.map((source, index) => (
              <div key={source.label} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-portal-heading">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: SOURCE_COLORS[index % SOURCE_COLORS.length] }}
                  />
                  <span className="truncate">{source.label}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatNumber(source.count)} · {formatNumber(Math.round((source.count / total) * 100))}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function TodaysLeads({ leads }: { leads: TrialBookingView[] }) {
  const { t, formatDateTime } = usePortalTranslation();
  const todayLeads = getTodayLeads(leads).slice(0, 6);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.trialLeads.sidebarTodaysLeads")}
      </h2>
      {todayLeads.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">
          {t("admin.trialLeads.sidebarNoSubmissionsToday")}
        </p>
      ) : (
        <div className="mt-4 flex max-h-[260px] flex-col gap-3 overflow-y-auto pr-1">
          {todayLeads.map((lead) => (
            <div key={lead._id} className="flex items-center gap-3">
              <UserInitialAvatar name={lead.parentName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-portal-heading">
                  {lead.parentName}
                </p>
                <p className="text-xs text-portal-muted">{formatDateTime(lead.createdAt)}</p>
              </div>
              <TrialLeadStatusBadge status={lead.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ClosedOverview({ leads }: { leads: TrialBookingView[] }) {
  const { t, formatNumber } = usePortalTranslation();
  const stats = computeTrialLeadsStats(leads);
  const rate = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.trialLeads.sidebarClosedOverview")}
      </h2>
      <p className="mt-1 text-xs text-portal-muted">
        {t("admin.trialLeads.sidebarClosedDesc")}
      </p>
      <div className="mt-4">
        <div className="flex items-end justify-between gap-2">
          <p className="text-2xl font-bold text-portal-heading">
            {t("admin.trialLeads.sidebarClosedCount", {
              count: formatNumber(stats.closed),
            })}
          </p>
          <p className="text-sm font-semibold text-primary">{formatNumber(rate)}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-portal-muted/40">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${rate}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-portal-muted">
          {t("admin.trialLeads.sidebarClosedRatio", {
            closed: formatNumber(stats.closed),
            total: formatNumber(stats.total),
          })}
        </p>
      </div>
    </Card>
  );
}

export function AdminTrialLeadsSidebar({
  leads,
  filteredLeads,
  isFetching,
  onRefresh,
  onReviewNew,
}: IAdminTrialLeadsSidebarProps) {
  const { t } = usePortalTranslation();
  const newCount = leads.filter((lead) => lead.status === "new").length;

  const actions = [
    {
      id: "review",
      label: t("admin.trialLeads.actionReviewNew"),
      icon: UserPlus,
      onClick: onReviewNew,
      show: newCount > 0,
    },
    {
      id: "export",
      label: t("admin.common.export"),
      icon: Download,
      onClick: () => exportTrialLeadsFile(filteredLeads, "trial-leads-filtered", t),
    },
    {
      id: "refresh",
      label: t("admin.trialLeads.actionRefresh"),
      icon: RefreshCw,
      onClick: onRefresh,
      pending: isFetching,
    },
    {
      id: "admissions",
      label: t("admin.trialLeads.actionAdmissions"),
      icon: GraduationCap,
      to: "/admin/student-admissions",
    },
  ].filter((action) => action.show !== false);

  return (
    <aside className="flex flex-col gap-4">
      <LeadSourcesChart leads={leads} />
      <TodaysLeads leads={leads} />
      <ClosedOverview leads={leads} />
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">
          {t("admin.trialLeads.sidebarQuickActions")}
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map(({ id, label, icon: Icon, to, onClick, pending }) => {
            const className =
              "inline-flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 px-3 py-3 text-left text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary";

            if (to) {
              return (
                <Link key={id} to={to} className={className}>
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </Link>
              );
            }

            return (
              <button
                key={id}
                type="button"
                onClick={onClick}
                disabled={pending}
                className={className}
              >
                <Icon
                  className={cn("size-4 text-primary", pending && "animate-spin")}
                  aria-hidden
                />
                {pending ? t("admin.trialLeads.refreshing") : label}
              </button>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}
