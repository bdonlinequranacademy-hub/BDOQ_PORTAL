import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import {
  useSelectedChildId,
  useParentChildHomework,
} from "@/features/parent/hooks/useParent";
import { ChildSelector } from "@/features/parent/components/ChildSelector";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import type { StudentHomeworkItem } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
function hwClassTitle(hw: StudentHomeworkItem) {
  const cls = hw.class;
  if (cls && typeof cls === "object") return cls.title;
  return "Class";
}

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

export function ParentHomeworkPage() {
  const childId = useSelectedChildId() ?? "";
  const { data: homework = [], isLoading } = useParentChildHomework(childId);

  const submitted = homework.filter((h) => h.submitted).length;
  const pending = homework.length - submitted;
  const completion =
    homework.length > 0 ? Math.round((submitted / homework.length) * 100) : 0;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Homework</h1>
        <p className="text-sm text-zinc-500">Track assignments and completion</p>
      </div>

      <ChildSelector />

      {!childId ? (
        <p className="text-sm text-zinc-400">Select a child to view homework.</p>
      ) : isLoading ? (
        <PageLoading />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#03214F]">{homework.length}</p>
              <p className="text-xs text-zinc-400">Total</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">{submitted}</p>
              <p className="text-xs text-zinc-400">Submitted</p>
            </Card>
            <Card className="rounded-2xl border-0 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{pending}</p>
              <p className="text-xs text-zinc-400">Pending</p>
            </Card>
          </div>

          <Card className="rounded-2xl border-0 p-5 shadow-sm">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-[#03214F]">Completion rate</span>
              <span className="font-bold text-[#03214F]">{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </Card>

          {homework.length === 0 ? (
            <p className="text-sm text-zinc-400">No homework assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {homework.map((hw) => {
                const overdue = !hw.submitted && isOverdue(hw.dueDate);
                return (
                  <Card
                    key={hw._id}
                    className={`flex flex-col gap-2 rounded-2xl border-l-4 border-0 p-4 shadow-sm ${
                      hw.submitted
                        ? "border-l-emerald-500"
                        : overdue
                          ? "border-l-red-500"
                          : "border-l-[#C4922B]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#03214F]">{hw.title}</p>
                        <p className="text-xs text-zinc-400">{hwClassTitle(hw)}</p>
                        <p className="text-xs text-zinc-500">
                          Due {new Date(hw.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {hw.submitted ? (
                        <CheckCircle className="size-5 shrink-0 text-emerald-500" />
                      ) : overdue ? (
                        <AlertCircle className="size-5 shrink-0 text-red-500" />
                      ) : (
                        <Clock className="size-5 shrink-0 text-amber-500" />
                      )}
                    </div>
                    {hw.submitted && hw.submission?.grade && (
                      <p className="text-xs font-semibold text-emerald-600">
                        Grade: {hw.submission.grade}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
