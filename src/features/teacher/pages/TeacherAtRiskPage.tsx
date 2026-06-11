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
  Sparkles,
} from "lucide-react";
import {
  useAtRiskStudents,
  useGenerateEarlyWarning,
} from "@/features/teacher/hooks/useTeacher";
import { AIMarkdownContent } from "@/components/ai/AIMarkdownContent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function TeacherAtRiskPage() {
  const navigate = useNavigate();
  const { data: atRisk = [], isLoading, refetch } = useAtRiskStudents();
  const enhanceAi = useGenerateEarlyWarning();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [guidanceMap, setGuidanceMap] = useState<Record<string, string>>({});
  const [aiEnhanced, setAiEnhanced] = useState<Record<string, boolean>>({});
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const highRisk = atRisk.filter((s) => s.riskLevel === "high");
  const mediumRisk = atRisk.filter((s) => s.riskLevel === "medium");

  function guidanceFor(studentId: string, fallback?: string) {
    return guidanceMap[studentId] ?? fallback ?? "";
  }

  async function handleEnhanceAi(studentId: string) {
    setEnhancingId(studentId);
    try {
      const res = await enhanceAi.mutateAsync(studentId);
      if (res.data?.guidance) {
        setGuidanceMap((prev) => ({ ...prev, [studentId]: res.data!.guidance }));
        setAiEnhanced((prev) => ({ ...prev, [studentId]: res.data!.aiGenerated }));
      }
    } finally {
      setEnhancingId(null);
    }
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Student Care Alerts</h1>
          <p className="text-sm text-zinc-500">Students flagged for attendance, homework, or progress follow-up</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500"
          aria-label="Refresh analysis"
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
        <p className="text-sm text-zinc-400">Analysing students…</p>
      ) : atRisk.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="All students on track"
          description="No students need extra care right now."
        />
      ) : (
        <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red-50 flex flex-col items-center py-4 gap-1">
                <span className="font-bold text-red-600 text-2xl">{highRisk.length}</span>
                <span className="text-zinc-400 text-xs">High Risk</span>
              </div>
              <div className="rounded-2xl bg-amber-50 flex flex-col items-center py-4 gap-1">
                <span className="font-bold text-amber-600 text-2xl">{mediumRisk.length}</span>
                <span className="text-zinc-400 text-xs">Medium Risk</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {atRisk.map((risk) => {
                const isExpanded = expanded === risk.studentId;
                const borderColor =
                  risk.riskLevel === "high" ? "border-l-red-500" : "border-l-amber-500";
                const guidance = guidanceFor(risk.studentId, risk.aiGuidance);
                const enhanced = aiEnhanced[risk.studentId];

                return (
                  <div
                    key={risk.studentId}
                    className={`shadow-sm rounded-2xl bg-white border border-zinc-200 border-l-4 ${borderColor} flex flex-col gap-3 p-4`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 font-semibold rounded-full flex items-center justify-center text-sm ${
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
                        className={`font-semibold rounded-full text-[11px] px-2.5 py-1 ${
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
                            className={`size-4 shrink-0 mt-0.5 ${
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

                    <button
                      type="button"
                      className="rounded-lg bg-[#EEF2F8] flex items-center justify-between px-3 py-2"
                      onClick={() => setExpanded(isExpanded ? null : risk.studentId)}
                    >
                      <span className="font-medium text-[#03214F] text-xs">Guidance</span>
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="size-4 text-zinc-400" />
                      )}
                    </button>

                    {isExpanded && guidance ? (
                      <div className="rounded-xl bg-[#EEF2F8] p-3">
                        <AIMarkdownContent content={guidance} className="text-xs" />
                        {!enhanced ? (
                          <button
                            type="button"
                            onClick={() => handleEnhanceAi(risk.studentId)}
                            disabled={enhancingId === risk.studentId}
                            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#03214F] hover:text-[#C4922B]"
                          >
                            <Sparkles className="size-3.5" />
                            {enhancingId === risk.studentId ? "Enhancing…" : "Enhance with AI"}
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="flex-1 rounded-xl bg-[#03214F] text-white text-sm py-2"
                        onClick={() =>
                          navigate(`/teacher/weekly-report?studentId=${risk.studentId}`)
                        }
                      >
                        <Phone className="size-4 mr-2" />
                        Parent Summary
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 rounded-xl border border-[#C4922B] text-[#C4922B] text-sm py-2"
                        onClick={() =>
                          navigate(`/teacher/progress?studentId=${risk.studentId}`)
                        }
                      >
                        <CalendarPlus className="size-4 mr-2" />
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

