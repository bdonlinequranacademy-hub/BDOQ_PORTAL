import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useStudentWeeklyReport } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { WeeklyReportPanel } from "@/components/reports/WeeklyReportPanel";
import type { WeeklyFamilyReport } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function StudentWeeklySummaryPage() {
  const { t } = usePortalTranslation();
  const user = useAuthStore((s) => s.user);
  const buildReport = useStudentWeeklyReport();
  const [report, setReport] = useState<WeeklyFamilyReport | null>(null);

  async function handleBuild() {
    const res = await buildReport.mutateAsync();
    setReport(res.data ?? null);
  }

  return (
    <PageContainer className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100">
          <MessageSquare className="size-6 text-emerald-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">{t("student.weeklySummary")}</h1>
          <p className="text-sm text-zinc-500">{t("student.weeklySummaryPageDesc")}</p>
        </div>
      </div>

      <Button
        onClick={handleBuild}
        disabled={buildReport.isPending}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-dark text-white"
      >
        <FileText className="size-4" />
        {buildReport.isPending ? t("student.buildingReport") : t("student.viewThisWeekReport")}
      </Button>

      {report ? (
        <WeeklyReportPanel report={report} />
      ) : user ? (
        <p className="text-sm text-zinc-500">
          {t("student.reportWillInclude", { name: user.name })}
        </p>
      ) : null}
    </PageContainer>
  );
}
