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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function TeacherParentSummaryPage() {
  const { t } = usePortalTranslation();
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
        <h1 className="text-2xl font-bold text-primary-dark">{t("teacher.weeklyFamilyReport")}</h1>
        <p className="text-sm text-zinc-500">{t("teacher.weeklyReportSubtitle")}</p>
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <p className="text-sm text-zinc-600">{t("teacher.weeklyReportInfo")}</p>
      </Card>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        <Select
          label={t("teacher.selectStudent")}
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            setReport(null);
          }}
        >
          <option value="">{t("teacher.chooseAStudent")}</option>
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
          {buildReport.isPending ? t("teacher.buildingReport") : t("teacher.buildWeeklyReport")}
        </Button>
      </Card>

      {report ? <WeeklyReportPanel report={report} /> : null}
    </PageContainer>
  );
}
