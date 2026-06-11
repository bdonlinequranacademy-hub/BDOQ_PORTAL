import {
  useSelectedChildId,
  useParentChildProgress,
} from "@/features/parent/hooks/useParent";
import { ChildSelector } from "@/features/parent/components/ChildSelector";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { classTitle } from "@/lib/utils/class";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";

export function ParentProgressPage() {
  const childId = useSelectedChildId() ?? "";
  const { data: records = [], isLoading } = useParentChildProgress(childId);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Progress</h1>
        <p className="text-sm text-zinc-500">Quran learning milestones</p>
      </div>

      <ChildSelector />

      {!childId ? (
        <p className="text-sm text-zinc-400">Select a child to view progress.</p>
      ) : isLoading ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : records.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-sm text-zinc-400">No progress records yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {records.map((r) => (
            <Card key={r._id} className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#03214F]">
                    {r.class ? classTitle(r.class) : "Overall"}
                  </p>
                  {r.curriculumLabels?.program ? (
                    <p className="text-xs font-medium text-[#C4922B]">
                      {formatCurriculumPath(r.curriculumLabels)}
                    </p>
                  ) : null}
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
              {r.surahsCompleted?.length > 0 && (
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
              )}
              {r.notes && (
                <p className="text-sm leading-relaxed text-zinc-600">{r.notes}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
