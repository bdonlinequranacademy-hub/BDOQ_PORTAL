import { AlertCircle, Brain } from "lucide-react";
import { useAdminAtRisk } from "@/features/admin/hooks/useAdmin";
import { AIMarkdownContent } from "@/components/ai/AIMarkdownContent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

import { PageLoading } from "@/components/ui/PageLoading";
export function AdminAtRiskPage() {
  const { data: atRisk = [], isLoading, isError, refetch } = useAdminAtRisk();

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Student Care Alerts</h1>
        <p className="text-sm text-zinc-500">Students flagged for attendance, homework, or progress follow-up</p>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-[#FDF3E0] p-5">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#C4922B]/15">
          <Brain className="size-6 text-[#C4922B]" />
        </div>
        <p className="text-sm text-zinc-600">
          {atRisk.length} student{atRisk.length !== 1 ? "s" : ""} need review
        </p>
      </div>

      {isError ? (
        <EmptyState
          icon={Brain}
          title="Could not load student care alerts"
          description="The analysis request failed. Try refreshing the page."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Analyzing…" />
      ) : atRisk.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="All students on track"
          description="No students need extra care right now."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {atRisk.map((risk) => (
            <Card
              key={risk.studentId}
              className={`flex flex-col gap-3 rounded-2xl border-0 border-l-4 p-5 shadow-sm ${
                risk.riskLevel === "high" ? "border-l-red-500" : "border-l-amber-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#03214F]">{risk.studentName}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                    risk.riskLevel === "high"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {risk.riskLevel} risk
                </span>
              </div>
              {risk.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span className="text-xs text-zinc-600">{reason.message}</span>
                </div>
              ))}
              {risk.aiGuidance && (
                <div className="rounded-xl bg-[#EEF2F8] p-3">
                  <AIMarkdownContent content={risk.aiGuidance} className="text-xs" />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

