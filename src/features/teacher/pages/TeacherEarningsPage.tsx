import { useState } from "react";
import { Banknote, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTeacherEarnings } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ClassLogStatusBadge } from "@/components/schedule/ClassLogStatusBadge";
import { currentMonthValue, formatBdt, formatMonthLabel } from "@/lib/utils/month";
import { formControlClass } from "@/lib/formControl";

import { PageLoading } from "@/components/ui/PageLoading";
export function TeacherEarningsPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const { data, isLoading } = useTeacherEarnings(month);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">My Earnings</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Verified sessions from approved class logs — {formatMonthLabel(month)}
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={`${formControlClass} w-full sm:w-auto`}
        />
      </div>

      {isLoading ? (
        <PageLoading label="Loading earnings…" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="rounded-2xl border-0 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#C4922B]">
                <Banknote className="size-4" />
                <span className="text-xs text-zinc-400">Total verified</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-[#03214F]">
                {formatBdt(data?.totalBdt ?? 0)}
              </p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="size-4" />
                <span className="text-xs text-zinc-400">Verified</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {data?.verifiedSessions ?? 0}
              </p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="size-4" />
                <span className="text-xs text-zinc-400">Pending</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {data?.pendingSessions ?? 0}
              </p>
              <p className="text-xs text-zinc-400">Est. {formatBdt(data?.pendingBdt ?? 0)}</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="size-4" />
                <span className="text-xs text-zinc-400">Rejected</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-red-500">
                {data?.rejectedSessions ?? 0}
              </p>
            </Card>
          </div>

          {(data?.byCourse.length ?? 0) > 0 ? (
            <Card className="rounded-2xl border-0 p-5 shadow-sm">
              <h2 className="mb-4 font-bold text-[#03214F]">By course</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data!.byCourse.map((row) => (
                  <div
                    key={row.courseType}
                    className="rounded-xl bg-[#F8FAFF] p-4"
                  >
                    <p className="font-semibold text-[#03214F]">{row.courseType}</p>
                    <p className="text-sm text-zinc-500">{row.sessions} sessions</p>
                    <p className="text-lg font-bold text-[#C4922B]">{formatBdt(row.totalBdt)}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <Card className="rounded-2xl border-0 p-5 shadow-sm">
            <h2 className="mb-4 font-bold text-[#03214F]">Session breakdown</h2>
            {(data?.sessions.length ?? 0) === 0 ? (
              <p className="text-sm text-zinc-400">
                No sessions logged this month. Submit class logs from your schedule.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-portal text-xs uppercase text-portal-muted">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Student</th>
                      <th className="py-2 pr-4">Class</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.sessions.map((row) => (
                      <tr key={row.logId} className="border-b border-portal last:border-b-0">
                        <td className="py-3 pr-4">{row.sessionDate}</td>
                        <td className="py-3 pr-4">
                          {row.studentName}
                          {row.studentId ? (
                            <span className="block text-xs text-zinc-400">{row.studentId}</span>
                          ) : null}
                        </td>
                        <td className="py-3 pr-4">{row.classTitle}</td>
                        <td className="py-3 pr-4">
                          <ClassLogStatusBadge status={row.status} />
                        </td>
                        <td className="py-3 text-right font-semibold text-[#03214F]">
                          {row.status === "approved" ? formatBdt(row.earningsBdt) : "—"}
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
    </PageContainer>
  );
}
