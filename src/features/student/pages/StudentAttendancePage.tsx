import { useStudentAttendance } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { PercentageRing } from "@/components/ui/PercentageRing";
import { ClipboardList } from "lucide-react";

const STATUS_STYLES = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  late: "bg-amber-100 text-amber-700",
};

export function StudentAttendancePage() {
  const { data, isLoading } = useStudentAttendance();
  const summary = data?.summary;
  const records = data?.records ?? [];

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">My Attendance</h1>
        <p className="text-sm text-zinc-500">Your class attendance history</p>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#03214F]">{summary?.percentage ?? 0}%</p>
              <p className="text-xs text-zinc-400">Attendance rate</p>
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

          <PercentageRing
            percentage={summary?.percentage ?? 0}
            label="Attendance"
          />

          <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
            {records.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={ClipboardList}
                  title="No attendance records"
                  description="Records appear after your teacher marks attendance."
                />
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {records.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-[#03214F]">{r.class?.title ?? "Class"}</p>
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
