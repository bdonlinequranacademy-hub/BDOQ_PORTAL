import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Brain, AlertCircle, Phone, CalendarPlus, ChevronDown, ChevronUp } from "lucide-react";
import { useTeacherStudents, useAtRiskStudents } from "@/features/teacher/hooks/useTeacher";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";

import { PageLoading } from "@/components/ui/PageLoading";
const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-green-100 text-green-700",
  "bg-rose-100 text-rose-700",
];

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

type Filter = "all" | "needs-care" | "excellent";

export function TeacherStudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const { data: students = [], isLoading } = useTeacherStudents();
  const { data: atRisk = [] } = useAtRiskStudents();

  const atRiskIds = new Set(atRisk.map((s) => s.studentId));

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "needs-care") return matchSearch && atRiskIds.has(s._id);
    if (filter === "excellent") return matchSearch && !atRiskIds.has(s._id);
    return matchSearch;
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-[#03214F] text-2xl leading-8 font-display">
          Student Directory
        </h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          {students.length} students in your classes
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <input
          className={`${formControlClass} pl-10`}
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {(["all", "needs-care", "excellent"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full text-sm px-4 py-1.5 font-medium ${
              filter === f
                ? "bg-[#03214F] text-white"
                : "bg-white border border-zinc-200 text-[#03214F]"
            }`}
          >
            {f === "all" ? "All" : f === "needs-care" ? "Needs care" : "Excellent"}
          </button>
        ))}
      </div>

      {/* Student list */}
      {isLoading ? (
        <PageLoading label="Loading students…" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((student, i) => {
            const risk = atRisk.find((r) => r.studentId === student._id);
            return (
              <div
                key={student._id}
                className="shadow-sm rounded-2xl bg-white border border-zinc-200 flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => navigate(`/teacher/progress?studentId=${student._id}`)}
              >
                <div
                  className={`size-11 shrink-0 font-semibold rounded-full flex items-center justify-center ${avatarColor(i)}`}
                >
                  {initials(student.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="truncate font-semibold text-[#03214F]">
                      {student.name}
                    </span>
                    {risk ? (
                      <span
                        className={`shrink-0 font-medium rounded-full text-[11px] px-2 py-0.5 ${
                          risk.riskLevel === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {risk.riskLevel === "high" ? "High Risk" : "Needs Attention"}
                      </span>
                    ) : (
                      <span className="shrink-0 font-medium rounded-full bg-emerald-100 text-emerald-700 text-[11px] px-2 py-0.5">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {student.studentId ? `${student.studentId} · ` : ""}
                    {student.country ? (
                      <CountryLabel country={student.country} className="inline" />
                    ) : (
                      student.timezone || student.email
                    )}
                  </p>
                  {student.curriculumAssignments && student.curriculumAssignments.length > 0 ? (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {student.curriculumAssignments.map((a, idx) => (
                        <span
                          key={`${a.programId}-${a.unitId ?? ""}-${a.topicId ?? ""}-${idx}`}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            a.completed
                              ? "bg-emerald-100 text-emerald-700 line-through decoration-emerald-400/60"
                              : "bg-[#FDF3E0] text-[#9A6B1A]"
                          }`}
                        >
                          {formatCurriculumPath(a.curriculumLabels, a)}
                          {a.completed ? " ✓" : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-[10px] text-zinc-400">All programs (none assigned)</p>
                  )}
                </div>
                <ChevronRight className="size-5 shrink-0 text-zinc-300" />
              </div>
            );
          })}
        </div>
      )}

      {/* Student care alerts */}
      {atRisk.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl bg-[#FDF3E0] flex items-center gap-3 p-5">
            <div className="size-12 shrink-0 rounded-2xl bg-[#C4922B]/15 flex items-center justify-center">
              <Brain className="size-6 text-[#C4922B]" />
            </div>
            <div>
              <h2 className="font-bold text-[#03214F] text-lg leading-7 font-display">
                Student Care Alerts
              </h2>
              <p className="text-zinc-400 text-xs">Based on attendance, homework, and progress</p>
            </div>
          </div>

          {atRisk.map((risk) => {
            const expanded = expandedRisk === risk.studentId;
            const borderColor =
              risk.riskLevel === "high" ? "border-l-red-500" : "border-l-amber-500";
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
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {initials(risk.studentName)}
                    </div>
                    <span className="font-semibold text-[#03214F]">{risk.studentName}</span>
                  </div>
                  <span
                    className={`font-semibold rounded-full text-[11px] px-2.5 py-1 ${
                      risk.riskLevel === "high"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
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
                          r.type === "attendance" || risk.riskLevel === "high"
                            ? "text-red-500"
                            : "text-amber-600"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          r.type === "attendance" || risk.riskLevel === "high"
                            ? "text-red-600"
                            : "text-amber-700"
                        }`}
                      >
                        {r.message}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className="rounded-lg bg-[#EEF2F8] flex items-center justify-between px-3 py-2"
                  onClick={() => setExpandedRisk(expanded ? null : risk.studentId)}
                >
                  <span className="font-medium text-[#03214F] text-xs">AI Guidance</span>
                  {expanded ? (
                    <ChevronUp className="size-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="size-4 text-zinc-400" />
                  )}
                </button>

                {expanded && risk.aiGuidance && (
                  <div className="rounded-xl bg-[#EEF2F8] p-3">
                    <p className="text-[#03214F] text-xs leading-relaxed italic">
                      {risk.aiGuidance}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1 rounded-xl bg-[#03214F] text-white text-sm py-2"
                    onClick={() =>
                      navigate(`/teacher/ai/parent-summary?studentId=${risk.studentId}`)
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
      )}
    </PageContainer>
  );
}
