import { Link } from "react-router-dom";
import { Download, GraduationCap, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { StudentRequestView } from "@/types/models";
import {
  buildStudentRequestActivity,
  exportStudentRequestsFile,
  groupCoursesRequested,
  groupRequestsByStatus,
} from "@/features/admin/components/student-requests/adminStudentRequestsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminStudentRequestsSidebarProps {
  requests: StudentRequestView[];
  filteredRequests: StudentRequestView[];
  isFetching: boolean;
  onRefresh: () => void;
  onReviewPending: () => void;
  pendingCount: number;
}

function RequestOverview({ requests }: { requests: StudentRequestView[] }) {
  const { t } = usePortalTranslation();

  const segments = groupRequestsByStatus(requests);
  const total = Math.max(requests.length, 1);

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
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.studentRequests.sidebarStatusChart")}</h2>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{requests.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">{t("stats.total")}</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
          {segments.length === 0 ? (
            <p className="text-portal-muted">{t("admin.studentRequests.noRequests")}</p>
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

function TopCoursesRequested({ requests }: { requests: StudentRequestView[] }) {
  const { t } = usePortalTranslation();

  const courses = groupCoursesRequested(requests).slice(0, 6);
  const max = Math.max(...courses.map((item) => item.count), 1);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.studentRequests.sidebarByCourse")}</h2>
      {courses.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.cms.shared.noRecent")}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {courses.map((course) => (
            <div key={course.label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-portal-heading">{course.label}</span>
                <span className="font-semibold tabular-nums text-portal-muted">{course.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-portal-muted/40">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(course.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentActivity({ requests }: { requests: StudentRequestView[] }) {
  const { t } = usePortalTranslation();

  const activity = buildStudentRequestActivity(requests);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.studentRequests.sidebarActivity")}</h2>
      {activity.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.cms.shared.noRecent")}</p>
      ) : (
        <div className="mt-4 flex max-h-[260px] flex-col gap-3 overflow-y-auto pr-1">
          {activity.map((item) => (
            <div key={item.id} className="relative border-l-2 border-primary/25 pl-3">
              <p className="text-xs font-semibold tabular-nums text-primary">{item.timeLabel}</p>
              <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
              {item.detail ? <p className="text-xs text-portal-muted">{item.detail}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AdminStudentRequestsSidebar({
  requests,
  filteredRequests,
  isFetching,
  onRefresh,
  onReviewPending,
  pendingCount,
}: IAdminStudentRequestsSidebarProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <aside className="flex flex-col gap-4">
      <RequestOverview requests={requests} />
      <TopCoursesRequested requests={requests} />
      <RecentActivity requests={requests} />
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.cms.shared.quickActions")}</h2>
        <div className="flex flex-col gap-2.5">
          {pendingCount > 0 ? (
            <button
              type="button"
              onClick={onReviewPending}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-dark px-4 text-sm font-semibold text-white transition hover:bg-primary"
            >{t("admin.studentRequests.alertCta")} ({formatNumber(pendingCount)})</button>
          ) : null}
          <button
            type="button"
            onClick={() => exportStudentRequestsFile(filteredRequests, "student-requests-filtered")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary"
          >
            <Download className="size-4 text-primary" aria-hidden />{t("admin.common.export")}</button>
          <Link
            to="/admin/classes"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary"
          >
            <GraduationCap className="size-4 text-primary" aria-hidden />{t("admin.classes.title")}</Link>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw
              className={cn("size-4 text-primary", isFetching && "animate-spin")}
              aria-hidden
            />
            {isFetching ? t("admin.trialLeads.refreshing") : t("admin.trialLeads.actionRefresh")}
          </button>
        </div>
      </Card>
    </aside>
  );
}
