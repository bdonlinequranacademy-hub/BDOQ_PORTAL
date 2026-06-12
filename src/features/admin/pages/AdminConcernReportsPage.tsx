import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import type { ConcernCategory, ConcernReportStatus, ConcernReportView } from "@/types/models";
import {
  useAdminConcernReports,
  useUpdateConcernReportStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Textarea } from "@/components/ui/Textarea";

import { PageLoading } from "@/components/ui/PageLoading";
type Filter = "new" | "all" | ConcernReportStatus;

function categoryLabel(category: ConcernCategory) {
  switch (category) {
    case "poaching":
      return "Poaching / off-platform";
    case "safety":
      return "Safety";
    case "conduct":
      return "Conduct";
    default:
      return "Other";
  }
}

function statusStyles(status: ConcernReportStatus) {
  switch (status) {
    case "reviewed":
      return "bg-blue-100 text-blue-800";
    case "closed":
      return "bg-zinc-200 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function ReportActions({ report }: { report: ConcernReportView }) {
  const [note, setNote] = useState(report.adminNote ?? "");
  const update = useUpdateConcernReportStatus(report._id);

  if (report.status === "closed") {
    return report.adminNote ? (
      <p className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">{report.adminNote}</p>
    ) : null;
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder="Admin note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {report.status === "new" ? (
          <Button
            type="button"
            disabled={update.isPending}
            onClick={() => update.mutate({ status: "reviewed", adminNote: note.trim() || undefined })}
            className="rounded-xl bg-[#03214F] px-4 py-2 text-xs text-white"
          >
            Mark reviewed
          </Button>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          disabled={update.isPending}
          onClick={() => update.mutate({ status: "closed", adminNote: note.trim() || undefined })}
          className="rounded-xl px-4 py-2 text-xs"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export function AdminConcernReportsPage() {
  const [filter, setFilter] = useState<Filter>("new");
  const status = filter === "all" ? undefined : filter;
  const { data: reports = [], isLoading } = useAdminConcernReports(status);

  const newCount =
    filter === "new" ? reports.length : reports.filter((r) => r.status === "new").length;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Concern Reports</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Poaching, safety, and conduct reports from students and teachers
        </p>
      </div>

      {filter === "new" && newCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-red-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-red-800">
            {newCount} new report{newCount === 1 ? "" : "s"} awaiting review
          </p>
        </Card>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "new" as const, label: "New" },
            { id: "reviewed" as const, label: "Reviewed" },
            { id: "closed" as const, label: "Closed" },
            { id: "all" as const, label: "All" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              filter === f.id
                ? "bg-[#03214F] text-white"
                : "border border-zinc-200 bg-white text-[#03214F]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading label="Loading concern reports…" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No concern reports in this view"
          description="Reports appear when a student or teacher submits a concern about poaching, safety, or conduct."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reports.map((report) => (
            <Card key={report._id} className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusStyles(report.status)}`}
                >
                  {report.status}
                </span>
                <span className="rounded-full bg-[#F8FAFF] px-2.5 py-0.5 text-[11px] font-semibold text-[#03214F]">
                  {categoryLabel(report.category)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#03214F]">{report.reporter.name}</p>
                <p className="text-xs capitalize text-zinc-400">
                  {report.reporter.role} · {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="whitespace-pre-wrap text-sm text-zinc-700">{report.message}</p>
              <ReportActions report={report} />
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
