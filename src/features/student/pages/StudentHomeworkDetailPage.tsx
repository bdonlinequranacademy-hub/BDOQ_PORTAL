import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Send, Clock, RotateCcw } from "lucide-react";
import { useStudentHomework, useSubmitHomework } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  formatHomeworkDueLabel,
  isHomeworkOverdue,
} from "@/lib/homeworkDue";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";

import { PageLoading } from "@/components/ui/PageLoading";
const MIN_SUBMISSION_CHARS = 20;

export function StudentHomeworkDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: homework = [], isLoading } = useStudentHomework();
  const submit = useSubmitHomework(id);
  const [content, setContent] = useState("");

  const hw = homework.find((h) => h._id === id);
  const classLabel =
    hw?.class && typeof hw.class === "object" ? hw.class.title : "Class";
  const overdue = hw ? isHomeworkOverdue(hw.dueDate, hw.submitted) : false;
  const trimmedLength = content.trim().length;
  const hasGrade = Boolean(hw?.submission?.grade);
  const status = hw?.submission?.status;
  const canSubmit = hw?.canSubmit !== false;
  const underReview = hw?.underReview;
  const returned = status === "returned";

  useEffect(() => {
    if (returned && hw?.submission?.content) {
      setContent(hw.submission.content);
    }
  }, [returned, hw?.submission?.content]);

  async function handleSubmit() {
    if (!content.trim() || !canSubmit) return;
    await submit.mutateAsync(content.trim());
    navigate(`/student/homework/success?id=${id}`);
  }

  return (
    <PageContainer className="flex max-w-3xl flex-col gap-6" size="narrow">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/student/homework")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Back to homework"
        >
          <ArrowLeft className="size-5 text-[#03214F]" />
        </button>
        <h1 className="text-xl font-bold text-[#03214F]">Homework</h1>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !hw ? (
        <p className="text-sm text-zinc-400">Not found.</p>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-bold text-[#03214F]">{hw.title}</h2>
            <p className="text-sm text-zinc-400">{classLabel}</p>
            {hw.curriculumLabels?.program ? (
              <p className="mt-1 text-xs font-medium text-[#C4922B]">
                {formatCurriculumPath(hw.curriculumLabels)}
              </p>
            ) : null}
            <p
              className={`mt-1 text-xs font-medium ${
                overdue ? "text-red-600" : "text-zinc-500"
              }`}
            >
              {formatHomeworkDueLabel(hw.dueDate, hw.submitted)}
              {!hw.submitted && !underReview
                ? ` · ${new Date(hw.dueDate).toLocaleString()}`
                : ""}
            </p>
          </div>

          {hw.description && (
            <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-zinc-700">{hw.description}</p>
            </Card>
          )}

          {underReview && hw.submission ? (
            <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <Clock className="size-5 shrink-0" />
                <span>
                  Sent to your teacher for review — not marked as submitted until they approve.
                </span>
              </div>
              <div className="rounded-xl bg-[#EEF2F8] p-4">
                <p className="text-sm text-zinc-800">{hw.submission.content}</p>
              </div>
            </Card>
          ) : null}

          {returned && hw.submission ? (
            <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-start gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-800">
                <RotateCcw className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-semibold">Returned for revision</p>
                  {hw.submission.reviewFeedback ? (
                    <p className="mt-1">{hw.submission.reviewFeedback}</p>
                  ) : null}
                </div>
              </div>
            </Card>
          ) : null}

          {hw.submitted && hw.submission ? (
            <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
              {hasGrade ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    Teacher feedback
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    {hw.submission.grade}
                  </p>
                  {hw.submission.feedback ? (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                      {hw.submission.feedback}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-500">No written feedback yet.</p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Accepted by your teacher — waiting for a grade.
                </div>
              )}

              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="size-5" />
                <span className="font-semibold">Submitted</span>
              </div>
              <div className="rounded-xl bg-[#EEF2F8] p-4">
                <p className="text-sm text-zinc-800">{hw.submission.content}</p>
              </div>
            </Card>
          ) : canSubmit ? (
            <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
              {overdue ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  This assignment is overdue. Submit as soon as you can.
                </p>
              ) : null}
              <span className="font-semibold text-[#03214F]">Your submission</span>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your answer, recitation notes, or reflection…"
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-zinc-500">
                {trimmedLength} characters
                {trimmedLength > 0 && trimmedLength < MIN_SUBMISSION_CHARS
                  ? ` · aim for at least ${MIN_SUBMISSION_CHARS} characters`
                  : ""}
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || submit.isPending}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#03214F] text-white"
              >
                <Send className="size-4" />
                {submit.isPending
                  ? "Sending…"
                  : returned
                    ? "Resubmit for review"
                    : "Send for teacher review"}
              </Button>
            </Card>
          ) : null}
        </>
      )}
    </PageContainer>
  );
}
