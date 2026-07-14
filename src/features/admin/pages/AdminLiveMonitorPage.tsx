import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio } from "lucide-react";
import { useAdminLiveMonitor } from "@/features/admin/hooks/useAdmin";
import {
  LiveMonitorFilterTabs,
  type LiveMonitorFilter,
} from "@/features/admin/components/liveMonitor/LiveMonitorFilterTabs";
import { AdminLiveMonitorHero } from "@/features/admin/components/liveMonitor/AdminLiveMonitorHero";
import { AdminLiveMonitorStatsGrid } from "@/features/admin/components/liveMonitor/AdminLiveMonitorStatsGrid";
import { AdminLiveMonitorDetailPanel } from "@/features/admin/components/liveMonitor/AdminLiveMonitorDetailPanel";
import { AdminLiveMonitorSessionList } from "@/features/admin/components/liveMonitor/AdminLiveMonitorSessionList";
import { AdminLiveMonitorSidebar } from "@/features/admin/components/liveMonitor/AdminLiveMonitorSidebar";
import { pickDefaultSession } from "@/features/admin/components/liveMonitor/adminLiveMonitorUtils";
import { sessionHasIssue } from "@/features/admin/components/liveMonitor/liveMonitorUtils";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSessionClock } from "@/hooks/useSessionClock";
import type { LiveMonitorSession } from "@/types/models";

export function AdminLiveMonitorPage() {
  const navigate = useNavigate();
  const now = useSessionClock();
  const { data, isLoading, isFetching, refetch } = useAdminLiveMonitor();
  const [filter, setFilter] = useState<LiveMonitorFilter>("all");
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const allSessions = data?.sessions ?? [];
  const summary = data?.summary;

  const filteredSessions = useMemo(() => {
    if (filter === "all") return allSessions;
    if (filter === "issues") {
      return allSessions.filter((session) => sessionHasIssue(session));
    }
    return allSessions.filter((session) => session.sessionPhase === filter);
  }, [allSessions, filter]);

  const selectedSession = useMemo(() => {
    if (selectedId) {
      return filteredSessions.find((session) => session._id === selectedId);
    }
    return pickDefaultSession(filteredSessions);
  }, [filteredSessions, selectedId]);

  useEffect(() => {
    if (filteredSessions.length === 0) {
      setSelectedId(undefined);
      return;
    }

    if (selectedId && filteredSessions.some((session) => session._id === selectedId)) {
      return;
    }

    setSelectedId(pickDefaultSession(filteredSessions)?._id);
  }, [filteredSessions, selectedId]);

  const filters: Array<{
    id: LiveMonitorFilter;
    label: string;
    count?: number;
  }> = [
    { id: "all", label: "Overview", count: summary?.totalToday },
    { id: "live", label: "Live", count: summary?.liveCount },
    { id: "upcoming", label: "Upcoming", count: summary?.upcomingCount },
    {
      id: "issues",
      label: "Issues",
      count: summary
        ? summary.teacherLateCount +
          summary.studentNoShowCount +
          summary.teacherNoShowCount
        : undefined,
    },
    {
      id: "completed",
      label: "Completed",
      count: summary?.completedCount,
    },
  ];

  function handleSelectSession(session: LiveMonitorSession) {
    setSelectedId(session._id);
  }

  return (
    <PageContainer>
      {summary ? (
        <AdminLiveMonitorHero
          summary={summary}
          updatedAt={data?.updatedAt}
          isFetching={isFetching}
          onRefresh={() => void refetch()}
        />
      ) : (
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Live Class Monitor
          </h1>
          <p className="portal-page-subtitle mt-1 text-portal-muted">
            Track today&apos;s sessions and join status in real time.
          </p>
        </div>
      )}

      {summary ? <AdminLiveMonitorStatsGrid summary={summary} isLoading={isLoading} /> : null}

      <div className="rounded-2xl border border-portal bg-portal-surface px-4 pt-2 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-5">
        <LiveMonitorFilterTabs filters={filters} active={filter} onChange={setFilter} />
      </div>

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
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            {selectedSession ? (
              <AdminLiveMonitorDetailPanel session={selectedSession} now={now} />
            ) : null}
            <AdminLiveMonitorSessionList
              sessions={filteredSessions}
              selectedId={selectedSession?._id}
              now={now}
              onSelect={handleSelectSession}
            />
            <p className="rounded-xl border border-dashed border-portal bg-portal-muted/30 px-4 py-3 text-xs text-portal-muted">
              Portal clock: {new Date(now).toLocaleTimeString()} · Teacher/student join is
              recorded when they click <strong className="text-portal-heading">Launch</strong> on
              their schedule.
            </p>
          </div>

          <AdminLiveMonitorSidebar
            sessions={allSessions}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
          />
        </div>
      )}
    </PageContainer>
  );
}
