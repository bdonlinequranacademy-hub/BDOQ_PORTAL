import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, ClipboardCheck } from "lucide-react";
import {
  useAdminClassLogs,
  useAdminEarnings,
  useApproveClassLog,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClassLogCard } from "@/components/schedule/ClassLogCard";
import { currentMonthValue, formatBdt, formatMonthLabel } from "@/lib/utils/month";
import { formControlClass } from "@/lib/formControl";
import type { ClassLogView } from "@/types/models";

export function AdminEarningsPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(currentMonthValue());
  const { data, isLoading } = useAdminEarnings(month);
  const { data: pendingLogs = [], isLoading: pendingLoading } = useAdminClassLogs("pending");
  const approve = useApproveClassLog();

  function handleApprove(log: ClassLogView) {
    approve.mutate(log._id);
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Earnings Overview</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Verified pay comes from approved class logs — {formatMonthLabel(month)}
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={`${formControlClass} w-full sm:w-auto`}
        />
      </div>

      {!pendingLoading && pendingLogs.length > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-amber-900">
                {pendingLogs.length} session log{pendingLogs.length === 1 ? "" : "s"} awaiting
                approval
              </p>
              <p className="mt-1 text-sm text-amber-800/80">
                Approve logs to count sessions toward teacher earnings.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/class-logs")}
              className="rounded-xl"
            >
              <ClipboardCheck className="mr-2 size-4" />
              Review all
            </Button>
          </div>
        </Card>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading earnings…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#C4922B]">
                <Banknote className="size-5" />
                <span className="text-xs text-zinc-400">Total verified</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-[#03214F]">
                {formatBdt(data?.totalBdt ?? 0)}
              </p>
            </Card>
            <Card className="rounded-2xl border-0 p-5 shadow-sm">
              <span className="text-xs text-zinc-400">Verified sessions</span>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {data?.verifiedSessions ?? 0}
              </p>
            </Card>
            <Card className="rounded-2xl border-0 p-5 shadow-sm">
              <span className="text-xs text-zinc-400">Pending approval</span>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {data?.pendingSessions ?? 0}
              </p>
            </Card>
          </div>

          <Card className="rounded-2xl border-0 p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-[#03214F]">By teacher</h2>
            {(data?.teachers.length ?? 0) === 0 ? (
              <p className="text-sm text-zinc-400">No earnings data for this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-portal text-xs uppercase text-portal-muted">
                      <th className="py-2 pr-4">Teacher</th>
                      <th className="py-2 pr-4">Verified</th>
                      <th className="py-2 pr-4">Pending</th>
                      <th className="py-2 text-right">Paid</th>
                      <th className="py-2 text-right">Pending est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.teachers.map((row) => (
                      <tr key={row.teacherId} className="border-b border-portal last:border-b-0">
                        <td className="py-3 pr-4 font-medium text-[#03214F]">
                          {row.teacherName}
                        </td>
                        <td className="py-3 pr-4">{row.verifiedSessions}</td>
                        <td className="py-3 pr-4">{row.pendingSessions}</td>
                        <td className="py-3 text-right font-semibold text-[#C4922B]">
                          {formatBdt(row.totalBdt)}
                        </td>
                        <td className="py-3 text-right text-zinc-500">
                          {formatBdt(row.pendingBdt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {!pendingLoading && pendingLogs.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#03214F]">Approve for earnings</h2>
            <button
              type="button"
              onClick={() => navigate("/admin/class-logs")}
              className="text-xs font-semibold text-[#C4922B]"
            >
              Open class logs →
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pendingLogs.slice(0, 4).map((log) => (
              <ClassLogCard
                key={log._id}
                log={log}
                showTeacher
                onApprove={handleApprove}
                actionPending={approve.isPending}
              />
            ))}
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
