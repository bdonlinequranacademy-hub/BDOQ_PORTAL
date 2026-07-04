import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Radio, RefreshCw } from "lucide-react";
import { useAdminLiveMonitor } from "@/features/admin/hooks/useAdmin";
import { LiveMonitorBanner } from "@/features/admin/components/liveMonitor/LiveMonitorBanner";
import {
  LiveMonitorFilterTabs,
  type LiveMonitorFilter,
} from "@/features/admin/components/liveMonitor/LiveMonitorFilterTabs";
import { LiveMonitorSessionCard } from "@/features/admin/components/liveMonitor/LiveMonitorSessionCard";
import { LiveMonitorSummaryGrid } from "@/features/admin/components/liveMonitor/LiveMonitorSummaryGrid";
import {
  groupLiveMonitorSessions,
  sessionHasIssue,
} from "@/features/admin/components/liveMonitor/liveMonitorUtils";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSessionClock } from "@/hooks/useSessionClock";
import { cn } from "@/lib/utils/cn";

const SECTION_ACCENT: Record<string, string> = {
  live: "border-red-500/40 bg-red-500/5 dark:bg-red-500/10",
  issues: "border-amber-500/35 bg-amber-500/5 dark:bg-amber-500/10",
  upcoming: "border-primary/25 bg-primary/5 dark:bg-primary/10",
  completed: "border-portal bg-portal-surface-muted/50",
};

export function AdminLiveMonitorPage() {
  const navigate = useNavigate();
  const now = useSessionClock();
  const { data, isLoading, isFetching, refetch } = useAdminLiveMonitor();
  const [filter, setFilter] = useState<LiveMonitorFilter>("all");

  const filteredSessions = useMemo(() => {
    const list = data?.sessions ?? [];
    if (filter === "all") return list;
    if (filter === "issues") {
      return list.filter((s) => sessionHasIssue(s));
    }
    return list.filter((s) => s.sessionPhase === filter);
  }, [data?.sessions, filter]);

  const groupedSections = useMemo(() => {
    if (filter !== "all") return null;
    return groupLiveMonitorSessions(filteredSessions);
  }, [filter, filteredSessions]);

  const summary = data?.summary;

  const filters: Array<{
    id: LiveMonitorFilter;
    label: string;
    count?: number;
  }> = [
    { id: "all", label: "All", count: summary?.totalToday },
    { id: "live", label: "Live", count: summary?.liveCount },
    { id: "upcoming", label: "Upcoming", count: summary?.upcomingCount },
    { id: "completed", label: "Done", count: summary?.completedCount },
    {
      id: "issues",
      label: "Issues",
      count:
        (summary?.teacherLateCount ?? 0) +
        (summary?.studentNoShowCount ?? 0) +
        (summary?.teacherNoShowCount ?? 0),
    },
  ];

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
              <Radio className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-portal-heading">Live class monitor</h1>
              <p className="text-sm text-portal-muted">
                Asia/Dhaka · join tracking via portal Launch
              </p>
            </div>
          </div>
          {summary ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-lg border border-portal bg-portal-surface-muted px-3 py-1.5 text-xs text-portal-muted">
              <CalendarDays className="size-3.5" />
              {summary.day}, {summary.sessionDate}
              {data?.updatedAt
                ? ` · Updated ${new Date(data.updatedAt).toLocaleTimeString()}`
                : ""}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading shadow-sm transition hover:bg-portal-surface-muted disabled:opacity-60"
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Refresh
        </button>
      </div>

      {summary ? (
        <>
          <LiveMonitorBanner summary={summary} />
          <LiveMonitorSummaryGrid summary={summary} />
        </>
      ) : null}

      <LiveMonitorFilterTabs filters={filters} active={filter} onChange={setFilter} />

      {isLoading ? (
        <PageLoading label="Loading live sessions…" />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={Radio}
          title={filter === "all" ? "No sessions today" : "No sessions in this filter"}
          description="Sessions appear from the academy routine when students are scheduled."
          actionLabel="View routine"
          onAction={() => navigate("/admin/schedule/routine")}
        />
      ) : filter === "all" && groupedSections ? (
        <div className="space-y-6">
          {groupedSections.map((section) => (
            <section key={section.id} className="space-y-3">
              <div
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-2.5",
                  SECTION_ACCENT[section.id] ?? "border-portal bg-portal-surface-muted"
                )}
              >
                <h2 className="text-sm font-bold uppercase tracking-wide text-portal-heading">
                  {section.label}
                </h2>
                <span className="rounded-full bg-portal-surface px-2.5 py-0.5 text-xs font-semibold tabular-nums text-portal-muted shadow-sm">
                  {section.sessions.length}
                </span>
              </div>
              <div className="space-y-3">
                {section.sessions.map((session) => (
                  <LiveMonitorSessionCard
                    key={session._id}
                    session={session}
                    now={now}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <LiveMonitorSessionCard key={session._id} session={session} now={now} />
          ))}
        </div>
      )}

      <p className="rounded-xl border border-dashed border-portal bg-portal-surface-muted/50 px-4 py-3 text-xs text-portal-muted">
        Portal clock: {new Date(now).toLocaleTimeString()} · Teacher/student join is recorded when
        they click <strong className="text-portal-heading">Launch</strong> on their schedule.
      </p>
    </PageContainer>
  );
}
