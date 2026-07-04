import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useStudentWeeklyReport } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { WeeklyReportPanel } from "@/components/reports/WeeklyReportPanel";
import type { WeeklyFamilyReport } from "@/types/models";

export function StudentWeeklySummaryPage() {
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
          <h1 className="text-2xl font-bold text-primary-dark">Weekly Summary</h1>
          <p className="text-sm text-zinc-500">
            Template progress update for learners and guardians on this account
          </p>
        </div>
      </div>

      <Button
        onClick={handleBuild}
        disabled={buildReport.isPending}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-dark text-white"
      >
        <FileText className="size-4" />
        {buildReport.isPending ? "Building report…" : "View this week's report"}
      </Button>

      {report ? (
        <WeeklyReportPanel report={report} />
      ) : user ? (
        <p className="text-sm text-zinc-500">
          Report for <span className="font-semibold text-primary-dark">{user.name}</span> will include
          sessions, attendance, and homework from the current week.
        </p>
      ) : null}
    </PageContainer>
  );
}
