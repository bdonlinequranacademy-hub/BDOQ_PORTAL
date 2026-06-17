import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { AIReportPanel } from "@/components/ai/AIReportPanel";
import {
  useTeacherStudents,
  useGenerateProgressReport,
} from "@/features/teacher/hooks/useTeacher";
import type { AIProgressReport } from "@/types/models";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export function TeacherAIReportPage() {
  const [params] = useSearchParams();
  const { data: students = [] } = useTeacherStudents();
  const generateReport = useGenerateProgressReport();

  const [studentId, setStudentId] = useState(params.get("studentId") ?? "");
  const [report, setReport] = useState<string | null>(null);
  const [stats, setStats] = useState<AIProgressReport["stats"] | null>(null);

  useEffect(() => {
    const fromQuery = params.get("studentId");
    if (fromQuery) setStudentId(fromQuery);
  }, [params]);

  async function handleGenerate() {
    if (!studentId) return;
    const res = await generateReport.mutateAsync(studentId);
    setReport(res.data?.report ?? null);
    setStats(res.data?.stats ?? null);
  }

  const selectedName = students.find((s) => s._id === studentId)?.name ?? "";

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-[#03214F]">AI Progress Report</h1>
        <p className="text-sm text-zinc-500">Generate a detailed AI analysis for any student</p>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#03214F] to-[#1a4a8a] p-6 text-white">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Sparkles className="size-6 text-[#C4922B]" />
        </div>
        <p className="text-sm text-white/80">
          Uses attendance, homework, progress, and class logs to build the report.
        </p>
      </div>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        <Select
          label="Select Student"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            setReport(null);
            setStats(null);
          }}
        >
          <option value="">Choose a student…</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Card>

      <Button
        onClick={handleGenerate}
        disabled={!studentId || generateReport.isPending}
        className="h-12 w-full gap-2 rounded-xl bg-[#2b7fff] font-semibold text-white"
      >
        <Sparkles className="size-4" />
        {generateReport.isPending ? "Generating…" : "Generate AI Report"}
      </Button>

      {stats ? (
        <Card className="grid grid-cols-2 gap-3 rounded-2xl border-0 p-4 shadow-sm sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase text-zinc-400">Tajweed</p>
            <p className="font-bold text-[#03214F]">{stats.tajweedScore}/100</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-400">Attendance</p>
            <p className="font-bold text-[#03214F]">{stats.attendancePercentage}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-400">Homework</p>
            <p className="font-bold text-[#03214F]">{stats.homeworkCompletionRate}%</p>
          </div>
          {stats.verifiedSessions !== undefined ? (
            <div>
              <p className="text-[10px] uppercase text-zinc-400">Verified logs</p>
              <p className="font-bold text-emerald-600">{stats.verifiedSessions}</p>
            </div>
          ) : null}
          {stats.rejectedLogs ? (
            <div>
              <p className="text-[10px] uppercase text-zinc-400">Rejected logs</p>
              <p className="font-bold text-red-500">{stats.rejectedLogs}</p>
            </div>
          ) : null}
        </Card>
      ) : null}

      {report ? (
        <AIReportPanel
          title={`Report: ${selectedName}`}
          subtitle="AI progress analysis"
          content={report}
          onRegenerate={handleGenerate}
          isRegenerating={generateReport.isPending}
        />
      ) : null}
    </PageContainer>
  );
}
