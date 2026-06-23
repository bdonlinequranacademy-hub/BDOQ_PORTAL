import { useStudentProgress, useStudentCurriculumPlan } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressTimeline } from "@/components/progress/ProgressTimeline";
import { StudentCurriculumPlan } from "@/components/curriculum/StudentCurriculumPlan";
import { TrendingUp, BookOpen } from "lucide-react";
import { classTitle } from "@/lib/utils/class";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";

export function StudentProgressPage() {
  const { data: records = [], isLoading } = useStudentProgress();
  const { data: curriculumPlan = [] } = useStudentCurriculumPlan();

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03214F]">My Progress</h1>
        <p className="text-sm text-zinc-500">Teacher feedback on your learning</p>
      </div>

      {curriculumPlan.length > 0 ? (
        <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-[#C4922B]" />
            <span className="font-bold text-[#03214F]">My curriculum plan</span>
          </div>
          <StudentCurriculumPlan assignments={curriculumPlan} />
        </Card>
      ) : null}

      <ProgressTimeline records={records} isLoading={isLoading} />

      {isLoading ? (
        <PageLoading />
      ) : records.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No progress records yet"
          description="Your teacher will update your Tajweed score and surah progress here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {records.map((r) => (
            <Card key={r._id} className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#03214F]">
                    {r.class ? classTitle(r.class) : "Overall progress"}
                  </p>
                  {r.curriculumLabels?.program ? (
                    <p className="text-xs font-medium text-[#C4922B]">
                      {formatCurriculumPath(r.curriculumLabels)}
                    </p>
                  ) : (
                    <MissingCurriculumBadge />
                  )}
                  {r.updatedAt && (
                    <p className="text-xs text-zinc-400">
                      Updated {new Date(r.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-[#EEF2F8] px-3 py-1 text-sm font-bold text-[#03214F]">
                  {r.tajweedScore}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-[#C4922B]"
                  style={{ width: `${r.tajweedScore}%` }}
                />
              </div>

              {r.surahsCompleted && r.surahsCompleted.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-zinc-500">Surahs completed</p>
                  <div className="flex flex-wrap gap-2">
                    {r.surahsCompleted.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {r.memorizedAyahs != null && (
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold text-[#03214F]">{r.memorizedAyahs}</span>{" "}
                  ayahs memorized
                </p>
              )}

              {r.notes && (
                <div className="rounded-xl bg-[#F8FAFF] px-4 py-3">
                  <p className="text-xs font-semibold text-[#C4922B]">Notes</p>
                  <p className="mt-1 text-sm text-zinc-700">{r.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
