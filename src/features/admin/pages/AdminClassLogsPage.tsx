import { useMemo, useState } from "react";
import type { ClassLogStatus, ClassLogView } from "@/types/models";
import {
  useAdminClassLogs,
  useApproveClassLog,
  useRejectClassLog,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { ClassLogCard } from "@/components/schedule/ClassLogCard";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { matchesProgramFilter } from "@/lib/api/curriculumApi";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formControlClass } from "@/lib/formControl";
import { ClipboardCheck, Search } from "lucide-react";

import { PageLoading } from "@/components/ui/PageLoading";
type Filter = "pending" | "all" | ClassLogStatus;

const TABS: { id: Filter; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

function logSearchText(log: ClassLogView): string {
  return [
    log.student?.name,
    log.teacher?.name,
    log.classTitle,
    log.lessonReport,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function AdminClassLogsPage() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [programFilter, setProgramFilter] = useState("");
  const [search, setSearch] = useState("");
  const { data: logs = [], isLoading, isError, refetch } = useAdminClassLogs();
  const { data: curriculumTree = [] } = useCurriculumTree();
  const approve = useApproveClassLog();
  const reject = useRejectClassLog();

  const tabCounts = useMemo(
    () => ({
      pending: logs.filter((l) => l.status === "pending").length,
      approved: logs.filter((l) => l.status === "approved").length,
      rejected: logs.filter((l) => l.status === "rejected").length,
      all: logs.length,
    }),
    [logs]
  );

  const filteredByStatus = useMemo(() => {
    if (filter === "all") return logs;
    return logs.filter((log) => log.status === filter);
  }, [logs, filter]);

  const missingProgramCount = useMemo(
    () => filteredByStatus.filter((l) => !l.curriculumProgram).length,
    [filteredByStatus]
  );

  const visibleLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return filteredByStatus.filter((log) => {
      if (!matchesProgramFilter(log.curriculumProgram, programFilter)) return false;
      if (!q) return true;
      return logSearchText(log).includes(q);
    });
  }, [filteredByStatus, programFilter, search]);

  function handleApprove(log: ClassLogView) {
    approve.mutate(log._id);
  }

  function handleReject(log: ClassLogView) {
    const adminNote = window.prompt("Reason for rejection (optional):") ?? undefined;
    reject.mutate({ id: log._id, adminNote });
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Class Log Approval</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Review teacher session logs before they count toward verified sessions
        </p>
      </div>

      {filter === "pending" && tabCounts.pending > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            {tabCounts.pending} log{tabCounts.pending === 1 ? "" : "s"} awaiting your approval
          </p>
        </Card>
      ) : null}

      {missingProgramCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-zinc-50 p-4 shadow-sm">
          <p className="text-sm text-zinc-600">
            {missingProgramCount} log{missingProgramCount === 1 ? "" : "s"} have no study program
            (submitted before curriculum tracking).
          </p>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className={`${formControlClass} pl-10`}
            placeholder="Search student, teacher, class…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CurriculumProgramFilter
          tree={curriculumTree}
          value={programFilter}
          onChange={setProgramFilter}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === f.id
                ? "bg-[#03214F] text-white"
                : "border border-zinc-200 bg-white text-[#03214F]"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-80">({tabCounts[f.id]})</span>
          </button>
        ))}
      </div>

      {isError ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Could not load class logs"
          description="The server failed to return class logs. Try again in a moment."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading class logs…" />
      ) : visibleLogs.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={filteredByStatus.length === 0 ? "No class logs in this view" : "No logs match your filters"}
          description={
            filteredByStatus.length === 0
              ? filter === "pending"
                ? "No logs are waiting for approval. Approved and rejected logs appear in their tabs."
                : "Logs appear when teachers submit session reports from their schedule."
              : "Try clearing search or program filter."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleLogs.map((log) => (
            <ClassLogCard
              key={log._id}
              log={log}
              showTeacher
              onApprove={
                log.status === "pending" || log.status === "rejected"
                  ? handleApprove
                  : undefined
              }
              onReject={log.status === "pending" ? handleReject : undefined}
              approveLabel={log.status === "rejected" ? "Approve again" : undefined}
              actionPending={approve.isPending || reject.isPending}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
