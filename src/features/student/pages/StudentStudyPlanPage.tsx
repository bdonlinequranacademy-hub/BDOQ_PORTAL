import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useGenerateStudyPlan } from "@/features/student/hooks/useStudent";
import { authUserId } from "@/lib/utils/authUser";
import { formControlClass } from "@/lib/formControl";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIReportPanel } from "@/components/ai/AIReportPanel";
import type { StudyPlanResult } from "@/types/models";

export function StudentStudyPlanPage() {
  const userId = authUserId(useAuthStore((s) => s.user));
  const studyPlan = useGenerateStudyPlan();
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(5);
  const [minutes, setMinutes] = useState(30);
  const [plan, setPlan] = useState<StudyPlanResult | null>(null);

  async function handleGenerate() {
    if (!userId || !goal.trim()) return;
    const res = await studyPlan.mutateAsync({
      studentId: userId,
      targetGoal: goal.trim(),
      availableDaysPerWeek: days,
      minutesPerDay: minutes,
    });
    if (res.data) {
      setPlan(res.data);
    }
  }

  return (
    <PageContainer className="flex max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#03214F] to-[#0a3d8f]">
          <Sparkles className="size-6 text-[#C4922B]" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">AI Study Plan</h1>
          <p className="text-sm text-zinc-500">Personalized weekly schedule</p>
        </div>
      </div>

      {!plan ? (
        <Card className="flex flex-col gap-5 rounded-2xl border-0 p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#03214F]">
              What do you want to achieve?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Memorize Surah Al-Mulk, improve Tajweed…"
              className={`${formControlClass} min-h-24 resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#03214F]">
                Days per week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className={formControlClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#03214F]">
                Minutes per day
              </label>
              <input
                type="number"
                min={10}
                max={180}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className={formControlClass}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!goal.trim() || !userId || studyPlan.isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#03214F] text-white"
          >
            <Sparkles className="size-4" />
            {studyPlan.isPending ? "Generating…" : "Generate Study Plan"}
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-[#03214F] to-[#0a3d8f] p-6 text-white shadow-sm">
            {plan.studentName && (
              <p className="text-sm text-white/70">Plan for {plan.studentName}</p>
            )}
            {plan.currentLevel && (
              <p className="mt-1 text-sm text-[#C4922B]">Level: {plan.currentLevel}</p>
            )}
            {plan.generatedAt && (
              <p className="mt-2 text-xs text-white/50">
                Generated {new Date(plan.generatedAt).toLocaleString()}
              </p>
            )}
          </Card>

          <AIReportPanel
            title="Your study plan"
            content={plan.studyPlan}
            onRegenerate={handleGenerate}
            isRegenerating={studyPlan.isPending}
          />

          <Button
            variant="ghost"
            onClick={() => setPlan(null)}
            className="h-11 rounded-xl border border-zinc-200"
          >
            Create another plan
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
