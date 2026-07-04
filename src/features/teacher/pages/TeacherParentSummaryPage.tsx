import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText } from "lucide-react";
import {
  useTeacherStudents,
  useTeacherWeeklyReport,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { WeeklyReportPanel } from "@/components/reports/WeeklyReportPanel";
import type { WeeklyFamilyReport } from "@/types/models";

export function TeacherParentSummaryPage() {
  const [params] = useSearchParams();
  const { data: students = [] } = useTeacherStudents();
  const buildReport = useTeacherWeeklyReport();

  const [studentId, setStudentId] = useState(params.get("studentId") ?? "");
  const [report, setReport] = useState<WeeklyFamilyReport | null>(null);

  useEffect(() => {
    const fromQuery = params.get("studentId");
    if (fromQuery) setStudentId(fromQuery);
  }, [params]);

  async function handleBuild() {
    if (!studentId) return;
    const res = await buildReport.mutateAsync(studentId);
    setReport(res.data ?? null);
  }

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">Weekly Family Report</h1>
        <p className="text-sm text-zinc-500">
          Built from approved class logs, attendance, and homework — verified portal data only
        </p>
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <p className="text-sm text-zinc-600">
          Build the report, then copy and send to the family on WhatsApp or email. Data comes from
          verified class logs and portal activity this week.
        </p>
      </Card>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        <Select
          label="Select Student"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            setReport(null);
          }}
        >
          <option value="">Choose a student…</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </Select>

        <Button
          onClick={handleBuild}
          disabled={!studentId || buildReport.isPending}
          className="h-12 w-full gap-2 rounded-xl bg-primary-dark font-semibold text-white"
        >
          <FileText className="size-4" />
          {buildReport.isPending ? "Building report…" : "Build weekly report"}
        </Button>
      </Card>

      {report ? <WeeklyReportPanel report={report} /> : null}
    </PageContainer>
  );
}
