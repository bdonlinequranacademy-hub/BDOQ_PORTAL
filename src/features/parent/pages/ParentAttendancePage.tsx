import {
  useSelectedChildId,
  useParentChildAttendance,
} from "@/features/parent/hooks/useParent";
import { ChildSelector } from "@/features/parent/components/ChildSelector";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

import { PageLoading } from "@/components/ui/PageLoading";
const STATUS_STYLES = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
};

export function ParentAttendancePage() {
  const childId = useSelectedChildId() ?? "";
  const { data, isLoading } = useParentChildAttendance(childId);
  const summary = data?.summary;
  const records = data?.records ?? [];

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Attendance</h1>
        <p className="text-sm text-zinc-500">Your child&apos;s class attendance</p>
      </div>

      <ChildSelector />

      {!childId ? (
        <p className="text-sm text-zinc-400">Select a child to view attendance.</p>
      ) : isLoading ? (
        <PageLoading />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary-dark">{summary?.percentage ?? 0}%</p>
              <p className="text-xs text-zinc-400">Rate</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">{summary?.present ?? 0}</p>
              <p className="text-xs text-zinc-400">Present</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-red-500">{summary?.absent ?? 0}</p>
              <p className="text-xs text-zinc-400">Absent</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{summary?.late ?? 0}</p>
              <p className="text-xs text-zinc-400">Late</p>
            </Card>
          </div>

          <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
            {records.length === 0 ? (
              <p className="p-6 text-center text-sm text-zinc-400">No records yet.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {records.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-primary-dark">{r.class?.title ?? "Class"}</p>
                      <p className="text-xs text-zinc-400">
                        {new Date(r.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        STATUS_STYLES[r.status]
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  );
}
