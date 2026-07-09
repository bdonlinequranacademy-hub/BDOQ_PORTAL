import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Download,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { StudentAdmissionView } from "@/types/models";
import {
  exportStudentAdmissionsFile,
  groupAdmissionPrograms,
  groupAdmissionSources,
  type IAdminStudentAdmissionsStats,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { cn } from "@/lib/utils/cn";

const SOURCE_COLORS = ["#32C991", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#14B8A6"];

interface IAdminStudentAdmissionsSidebarProps {
  applications: StudentAdmissionView[];
  filteredApplications: StudentAdmissionView[];
  stats: IAdminStudentAdmissionsStats;
  isFetching: boolean;
  onRefresh: () => void;
  onReviewNew: () => void;
}

function ApplicationsBySource({ applications }: { applications: StudentAdmissionView[] }) {
  const sources = groupAdmissionSources(applications).slice(0, 5);
  const total = Math.max(applications.length, 1);

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
      <h2 className="text-sm font-bold text-portal-heading">Applications by source</h2>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{applications.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              Total
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
          {sources.length === 0 ? (
            <p className="text-portal-muted">No source data yet.</p>
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
                  {source.count} · {Math.round((source.count / total) * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function ProgramsInterested({ applications }: { applications: StudentAdmissionView[] }) {
  const programs = groupAdmissionPrograms(applications).slice(0, 6);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Programs interested</h2>
      {programs.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">No program data yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {programs.map((program) => (
            <div key={program.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-portal-heading">{program.label}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary-dark">
                {program.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ConversionOverview({ stats }: { stats: IAdminStudentAdmissionsStats }) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Conversion overview</h2>
      <p className="mt-1 text-xs text-portal-muted">
        Approved applications compared to total submissions.
      </p>
      <div className="mt-4">
        <div className="flex items-end justify-between gap-2">
          <p className="text-2xl font-bold text-portal-heading">{stats.approved} approved</p>
          <p className="text-sm font-semibold text-primary">{stats.conversionRate}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-portal-muted/40">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${stats.conversionRate}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-portal-muted">
          {stats.approved} / {stats.total} total applications
        </p>
      </div>
    </Card>
  );
}

export function AdminStudentAdmissionsSidebar({
  applications,
  filteredApplications,
  stats,
  isFetching,
  onRefresh,
  onReviewNew,
}: IAdminStudentAdmissionsSidebarProps) {
  const actions = [
    {
      label: "Review new",
      icon: Inbox,
      onClick: onReviewNew,
      show: stats.new > 0,
    },
    {
      label: "Export",
      icon: Download,
      onClick: () => exportStudentAdmissionsFile(filteredApplications, "admissions-filtered"),
    },
    {
      label: "Trial leads",
      icon: CalendarCheck,
      to: "/admin/trial-bookings",
    },
    {
      label: "Contact inbox",
      icon: Inbox,
      to: "/admin/contact-messages",
    },
  ].filter((action) => action.show !== false);

  return (
    <aside className="flex flex-col gap-4">
      <ApplicationsBySource applications={applications} />
      <ProgramsInterested applications={applications} />
      <ConversionOverview stats={stats} />
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">Quick actions</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map(({ label, icon: Icon, to, onClick }) => {
            const className =
              "inline-flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 px-3 py-3 text-left text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary";

            if (to) {
              return (
                <Link key={label} to={to} className={className}>
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </Link>
              );
            }

            return (
              <button key={label} type="button" onClick={onClick} className={className}>
                <Icon className="size-4 text-primary" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-portal px-3 py-2.5 text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw
            className={cn("size-4 text-primary", isFetching && "animate-spin")}
            aria-hidden
          />
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </Card>
    </aside>
  );
}
