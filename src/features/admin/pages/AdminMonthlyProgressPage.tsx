import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useAdminMonthlyProgress } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { currentMonthValue, formatMonthLabel } from "@/lib/utils/month";
import { formControlClass } from "@/lib/formControl";

import { PageLoading } from "@/components/ui/PageLoading";
export function AdminMonthlyProgressPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const { data: snapshots = [], isLoading } = useAdminMonthlyProgress(month);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#03214F]">
            Monthly Progress
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Teacher snapshots for families — {formatMonthLabel(month)}
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={`${formControlClass} w-full sm:w-auto`}
        />
      </div>

      <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
        <p className="text-sm text-zinc-600">
          Teachers save these at month-end. Review before sharing with probashi families.
        </p>
      </Card>

      {isLoading ? (
        <PageLoading label="Loading snapshots…" />
      ) : snapshots.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <TrendingUp className="mx-auto size-8 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">
            No monthly snapshots for {formatMonthLabel(month)} yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {snapshots.map((snap) => (
            <Card key={snap._id} className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[#03214F]">{snap.student.name}</p>
                  <p className="text-xs text-zinc-500">
                    {snap.class.title} · Teacher: {snap.teacher.name}
                  </p>
                </div>
                <span className="rounded-full bg-[#FDF3E0] px-2.5 py-0.5 text-xs font-semibold text-[#C4922B]">
                  Tajweed {snap.tajweedScore}%
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                <span>{snap.sessionsHeld} sessions</span>
                <span>·</span>
                <span>{snap.surahsCompleted.length} surahs</span>
                <span>·</span>
                <span>{snap.memorizedAyahs} ayahs</span>
              </div>

              {snap.activityDates.length > 0 ? (
                <p className="text-xs text-zinc-500">
                  Active days: {snap.activityDates.slice(0, 5).join(", ")}
                  {snap.activityDates.length > 5 ? "…" : ""}
                </p>
              ) : null}

              {snap.teacherSummary ? (
                <p className="text-sm leading-relaxed text-zinc-700">{snap.teacherSummary}</p>
              ) : null}

              {snap.qaResponses.some((qa) => qa.answer.trim()) ? (
                <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3">
                  {snap.qaResponses
                    .filter((qa) => qa.answer.trim())
                    .map((qa) => (
                      <div key={qa.question}>
                        <p className="text-xs font-semibold text-[#03214F]">{qa.question}</p>
                        <p className="text-sm text-zinc-600">{qa.answer}</p>
                      </div>
                    ))}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
