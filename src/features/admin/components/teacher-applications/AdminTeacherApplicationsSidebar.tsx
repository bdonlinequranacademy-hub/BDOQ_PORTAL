import { Link } from "react-router-dom";
import {
  Download,
  GraduationCap,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { TeacherApplicationView } from "@/types/models";
import { TeacherApplicationStatusBadge } from "@/features/admin/components/teacher-applications/TeacherApplicationStatusBadge";
import {
  exportTeacherApplicationsFile,
  formatAppliedAt,
  getRecentTeacherApplications,
  groupTeacherApplicationsByStatus,
  groupTeacherSubjects,
} from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTeacherApplicationsSidebarProps {
  applications: TeacherApplicationView[];
  filteredApplications: TeacherApplicationView[];
  isFetching: boolean;
  onRefresh: () => void;
  onReviewNew: () => void;
  newCount: number;
}

function ApplicationOverview({ applications }: { applications: TeacherApplicationView[] }) {
  const { t } = usePortalTranslation();

  const segments = groupTeacherApplicationsByStatus(applications);
  const total = Math.max(applications.length, 1);

  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const pct = (segment.count / total) * 100;
      const start = cursor;
      cursor += pct;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.teacherApplications.sidebarConversion")}</h2>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{applications.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">{t("stats.total")}</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
          {segments.length === 0 ? (
            <p className="text-portal-muted">{t("admin.teacherApplications.noApplications")}</p>
          ) : (
            segments.map((segment) => (
              <div key={segment.label} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-portal-heading">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="truncate">{segment.label}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {segment.count} · {Math.round((segment.count / total) * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function RecentApplications({ applications }: { applications: TeacherApplicationView[] }) {
  const { t } = usePortalTranslation();

  const recent = getRecentTeacherApplications(applications);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.cms.shared.recentItems")}</h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.cms.shared.noRecent")}</p>
      ) : (
        <div className="mt-4 flex max-h-[260px] flex-col gap-3 overflow-y-auto pr-1">
          {recent.map((app) => {
            const applied = formatAppliedAt(app.createdAt);
            return (
              <div key={app._id} className="flex items-center gap-3">
                <UserInitialAvatar name={app.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {app.fullName}
                  </p>
                  <p className="text-xs text-portal-muted">{applied.time}</p>
                </div>
                <TeacherApplicationStatusBadge status={app.status} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function TopSubjects({ applications }: { applications: TeacherApplicationView[] }) {
  const { t } = usePortalTranslation();

  const subjects = groupTeacherSubjects(applications).slice(0, 6);
  const max = Math.max(...subjects.map((item) => item.count), 1);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.teacherApplications.sidebarSubjects")}</h2>
      {subjects.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.cms.shared.noRecent")}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {subjects.map((subject) => (
            <div key={subject.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-portal-heading">{subject.label}</span>
                <span className="font-semibold tabular-nums text-portal-muted">{subject.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-portal-muted/40">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(subject.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AdminTeacherApplicationsSidebar({
  applications,
  filteredApplications,
  isFetching,
  onRefresh,
  onReviewNew,
  newCount,
}: IAdminTeacherApplicationsSidebarProps) {
  const { t } = usePortalTranslation();

  const actions = [
    {
      label: t("admin.admissions.actionReviewNew"),
      icon: Inbox,
      onClick: onReviewNew,
      show: newCount > 0,
    },
    {
      label: t("admin.common.export"),
      icon: Download,
      onClick: () => exportTeacherApplicationsFile(filteredApplications, "teacher-apps-filtered"),
    },
    {
      label: t("admin.admissions.title"),
      icon: GraduationCap,
      to: "/admin/student-admissions",
    },
    {
      label: t("admin.contact.title"),
      icon: Inbox,
      to: "/admin/contact-messages",
    },
  ].filter((action) => action.show !== false);

  return (
    <aside className="flex flex-col gap-4">
      <ApplicationOverview applications={applications} />
      <RecentApplications applications={applications} />
      <TopSubjects applications={applications} />
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.cms.shared.quickActions")}</h2>
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
          {isFetching ? t("admin.trialLeads.refreshing") : t("admin.trialLeads.actionRefresh")}
        </button>
      </Card>
    </aside>
  );
}
