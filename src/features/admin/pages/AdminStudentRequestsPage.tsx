import { useState } from "react";
import { UserPlus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { StudentRequestStatus, StudentRequestView } from "@/types/models";
import {
  useAdminStudentRequests,
  useApproveStudentRequest,
  useRejectStudentRequest,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type Filter = "pending" | "all" | StudentRequestStatus;

function statusStyles(status: StudentRequestStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export function AdminStudentRequestsPage() {
  const [filter, setFilter] = useState<Filter>("pending");
  const status = filter === "all" ? undefined : filter;
  const { data: requests = [], isLoading } = useAdminStudentRequests(status);
  const approve = useApproveStudentRequest();
  const reject = useRejectStudentRequest();

  const pendingCount =
    filter === "pending" ? requests.length : requests.filter((r) => r.status === "pending").length;

  function handleApprove(req: StudentRequestView) {
    const adminNote = window.prompt("Optional note for the teacher:") ?? undefined;
    approve.mutate({ id: req._id, adminNote });
  }

  function handleReject(req: StudentRequestView) {
    const adminNote = window.prompt("Reason for rejection (optional):") ?? undefined;
    reject.mutate({ id: req._id, adminNote });
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Student Requests</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Teachers asking for new student assignments
        </p>
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <p className="text-sm font-semibold text-[#03214F]">How this works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
          <li>Teacher submits a request with availability and course preference.</li>
          <li>You approve or reject with an optional note.</li>
          <li>
            After approval, enroll the student manually in{" "}
            <Link to="/admin/classes" className="font-semibold text-[#03214F] underline">
              Classes
            </Link>{" "}
            and assign them to that teacher.
          </li>
        </ol>
      </Card>

      {filter === "pending" && pendingCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            {pendingCount} request{pendingCount === 1 ? "" : "s"} awaiting review
          </p>
        </Card>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "pending" as const, label: "Pending" },
            { id: "approved" as const, label: "Approved" },
            { id: "rejected" as const, label: "Rejected" },
            { id: "all" as const, label: "All" },
          ] as const
        ).map((f) => (
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
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading requests…</p>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No student requests in this view"
          description="Requests appear when teachers ask for new students from their portal."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {requests.map((req) => (
            <Card
              key={req._id}
              className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles(req.status)}`}
                >
                  {req.status}
                </span>
                {req.preferredCourseType ? (
                  <span className="text-xs text-zinc-400">{req.preferredCourseType}</span>
                ) : null}
                <span className="text-xs text-zinc-400">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <p className="font-bold text-[#03214F]">{req.teacher.name}</p>
                {req.teacher.email ? (
                  <p className="text-xs text-zinc-500">{req.teacher.email}</p>
                ) : null}
              </div>

              <p className="text-sm text-zinc-700">{req.message}</p>

              {req.adminNote ? (
                <p className="rounded-xl bg-[#F8FAFF] px-3 py-2 text-xs text-zinc-600">
                  Note: {req.adminNote}
                </p>
              ) : null}

              {req.status === "pending" ? (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleApprove(req)}
                      disabled={approve.isPending || reject.isPending}
                      className="flex-1 rounded-xl"
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleReject(req)}
                      disabled={approve.isPending || reject.isPending}
                      className="flex-1 rounded-xl border border-red-200 text-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                  <Link
                    to="/admin/classes"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#03214F]"
                  >
                    Go to Classes to enroll
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              ) : req.status === "approved" ? (
                <Link
                  to="/admin/classes"
                  className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-[#03214F]"
                >
                  Assign student in Classes
                  <ArrowRight className="size-3" />
                </Link>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
