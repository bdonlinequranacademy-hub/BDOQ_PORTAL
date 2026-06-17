import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  AlertCircle,
  Phone,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { useAtRiskStudents } from "@/features/teacher/hooks/useTeacher";
import { ReportMarkdown } from "@/components/reports/ReportMarkdown";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

import { PageLoading } from "@/components/ui/PageLoading";
function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function TeacherAtRiskPage() {
  const navigate = useNavigate();
  const { data: atRisk = [], isLoading, refetch } = useAtRiskStudents();
  const [expanded, setExpanded] = useState<string | null>(null);

  const highRisk = atRisk.filter((s) => s.riskLevel === "high");
  const mediumRisk = atRisk.filter((s) => s.riskLevel === "medium");

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#03214F]">Student Care Alerts</h1>
          <p className="text-sm text-zinc-500">
            Flagged from attendance, homework, and progress records — not AI-generated
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500"
          aria-label="Refresh alerts"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-[#FDF3E0] p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#C4922B]/15">
          <Brain className="size-6 text-[#C4922B]" />
        </div>
        <p className="text-sm text-zinc-600">
          {atRisk.length} student{atRisk.length !== 1 ? "s" : ""} flagged for review
        </p>
      </div>

      {isLoading ? (
        <PageLoading label="Loading alerts…" />
      ) : atRisk.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="All students on track"
          description="No students need extra care right now."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-red-50 py-4">
              <span className="text-2xl font-bold text-red-600">{highRisk.length}</span>
              <span className="text-xs text-zinc-400">High Risk</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-amber-50 py-4">
              <span className="text-2xl font-bold text-amber-600">{mediumRisk.length}</span>
              <span className="text-xs text-zinc-400">Medium Risk</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {atRisk.map((risk) => {
              const isExpanded = expanded === risk.studentId;
              const borderColor =
                risk.riskLevel === "high" ? "border-l-red-500" : "border-l-amber-500";

              return (
                <div
                  key={risk.studentId}
                  className={`flex flex-col gap-3 rounded-2xl border border-zinc-200 border-l-4 bg-white p-4 shadow-sm ${borderColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${
                          risk.riskLevel === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {initials(risk.studentName)}
                      </div>
                      <span className="font-semibold text-[#03214F]">{risk.studentName}</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        risk.riskLevel === "high"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {risk.riskLevel === "high" ? "High Risk" : "Medium Risk"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {risk.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertCircle
                          className={`mt-0.5 size-4 shrink-0 ${
                            risk.riskLevel === "high" ? "text-red-500" : "text-amber-600"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            risk.riskLevel === "high" ? "text-red-600" : "text-amber-700"
                          }`}
                        >
                          {r.message}
                        </span>
                      </div>
                    ))}
                  </div>

                  {risk.aiGuidance ? (
                    <>
                      <button
                        type="button"
                        className="flex items-center justify-between rounded-lg bg-[#EEF2F8] px-3 py-2"
                        onClick={() => setExpanded(isExpanded ? null : risk.studentId)}
                      >
                        <span className="text-xs font-medium text-[#03214F]">
                          Suggested follow-up
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-zinc-400" />
                        ) : (
                          <ChevronDown className="size-4 text-zinc-400" />
                        )}
                      </button>

                      {isExpanded ? (
                        <div className="rounded-xl bg-[#EEF2F8] p-3">
                          <ReportMarkdown content={risk.aiGuidance} className="text-xs" />
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="flex-1 rounded-xl bg-[#03214F] py-2 text-sm text-white"
                      onClick={() =>
                        navigate(`/teacher/weekly-report?studentId=${risk.studentId}`)
                      }
                    >
                      <Phone className="mr-2 size-4" />
                      Weekly Report
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 rounded-xl border border-[#C4922B] py-2 text-sm text-[#C4922B]"
                      onClick={() =>
                        navigate(`/teacher/progress?studentId=${risk.studentId}`)
                      }
                    >
                      <CalendarPlus className="mr-2 size-4" />
                      Update Progress
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </PageContainer>
  );
}
