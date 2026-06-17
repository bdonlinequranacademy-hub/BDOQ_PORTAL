import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminAttendance, useAdminClasses } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { ClipboardList } from "lucide-react";

export function AdminAttendancePage() {
  const [params, setParams] = useSearchParams();
  const initialClassId = params.get("classId") ?? "";
  const [classFilter, setClassFilter] = useState(initialClassId);

  const { data: overview = [], isLoading } = useAdminAttendance(
    classFilter || undefined
  );
  const { data: classes = [] } = useAdminClasses();

  useEffect(() => {
    const fromQuery = params.get("classId") ?? "";
    setClassFilter(fromQuery);
  }, [params]);

  function handleClassChange(value: string) {
    setClassFilter(value);
    if (value) {
      setParams({ classId: value });
    } else {
      setParams({});
    }
  }

  const avgPct =
    overview.length > 0
      ? Math.round(
          overview.reduce((sum, o) => sum + o.percentage, 0) / overview.length
        )
      : 0;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03214F]">
          Attendance Analytics
        </h1>
        <p className="text-sm text-zinc-500">Academy-wide attendance overview</p>
      </div>

      <Card className="rounded-2xl border-0 p-4 shadow-sm">
        <Select
          label="Filter by class"
          value={classFilter}
          onChange={(e) => handleClassChange(e.target.value)}
        >
          <option value="">All classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.title}
            </option>
          ))}
        </Select>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 p-4 shadow-sm">
          <span className="text-xs text-zinc-400">Classes tracked</span>
          <p className="text-2xl font-bold text-[#03214F]">{overview.length}</p>
        </Card>
        <Card className="rounded-2xl border-0 p-4 shadow-sm">
          <span className="text-xs text-zinc-400">Avg. attendance</span>
          <p className="text-2xl font-bold text-teal-600">{avgPct}%</p>
        </Card>
        <Card className="rounded-2xl border-0 p-4 shadow-sm">
          <span className="text-xs text-zinc-400">Total classes</span>
          <p className="text-2xl font-bold text-[#03214F]">{classes.length}</p>
        </Card>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : overview.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No attendance data yet"
          description={
            classFilter
              ? "No attendance records for this class yet."
              : "Overview appears once teachers start marking attendance in classes."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {overview.map((row, i) => (
            <Card key={i} className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#03214F]">{row.class.title}</span>
                <span className="font-bold text-teal-600">{row.percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-emerald-50 py-2">
                  <p className="font-bold text-emerald-600">{row.present}</p>
                  <p className="text-zinc-400">Present</p>
                </div>
                <div className="rounded-lg bg-red-50 py-2">
                  <p className="font-bold text-red-600">{row.absent}</p>
                  <p className="text-zinc-400">Absent</p>
                </div>
                <div className="rounded-lg bg-zinc-50 py-2">
                  <p className="font-bold text-[#03214F]">{row.total}</p>
                  <p className="text-zinc-400">Total</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
