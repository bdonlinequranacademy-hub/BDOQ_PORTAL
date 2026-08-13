import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Send, Clock, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useStudentHomework, useSubmitHomework } from "@/features/student/hooks/useStudent";
import {
  NestedCurriculumSelect,
  pathReadyToSave,
  useCurriculumTree,
} from "@/components/curriculum/NestedCurriculumSelect";
import type { CurriculumPath } from "@/lib/api/curriculumApi";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatHomeworkDueLabel, isHomeworkOverdue } from "@/lib/homeworkDue";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const MIN_SUBMISSION_CHARS = 20;

function pathFromHomework(
  program?: string,
  unit?: string,
  topic?: string
): CurriculumPath {
  return {
    programId: program ?? "",
    unitId: unit ?? "",
    topicId: topic ?? "",
  };
}

export function StudentHomeworkDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { t, formatDate, formatDateTime } = usePortalTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: homework = [], isLoading } = useStudentHomework();
  const submit = useSubmitHomework(id);
  const [content, setContent] = useState("");
  const [curriculum, setCurriculum] = useState<CurriculumPath>({ programId: "" });

  const { data: curriculumTree = [], isLoading: treeLoading } = useCurriculumTree(
    user?._id ? { studentId: user._id } : undefined,
    { enabled: Boolean(user?._id) }
  );

  const hw = homework.find((h) => h._id === id);
  const classLabel =
    hw?.class && typeof hw.class === "object" ? hw.class.title : t("student.classFallback");
  const overdue = hw ? isHomeworkOverdue(hw.dueDate, hw.submitted) : false;
  const trimmedLength = content.trim().length;
  const hasGrade = Boolean(hw?.submission?.grade);
  const status = hw?.submission?.status;
  const canSubmit = hw?.canSubmit !== false;
  const underReview = hw?.underReview;
  const returned = status === "returned";
  const curriculumReady = pathReadyToSave(curriculum, curriculumTree);
  const dueOptions = { t, formatDate };

  useEffect(() => {
    if (!hw) return;
    if (returned && hw.submission?.content) {
      setContent(hw.submission.content);
    }
    const fromSubmission = hw.submission
      ? pathFromHomework(
          hw.submission.curriculumProgram,
          hw.submission.curriculumUnit,
          hw.submission.curriculumTopic
        )
      : null;
    const fromAssignment = pathFromHomework(
      hw.curriculumProgram,
      hw.curriculumUnit,
      hw.curriculumTopic
    );
    setCurriculum(fromSubmission?.programId ? fromSubmission : fromAssignment);
  }, [hw?._id, returned, hw?.submission?.content]);

  async function handleSubmit() {
    if (!content.trim() || !canSubmit || !curriculumReady) return;
    await submit.mutateAsync({
      content: content.trim(),
      curriculumProgram: curriculum.programId,
      curriculumUnit: curriculum.unitId || undefined,
      curriculumTopic: curriculum.topicId || undefined,
    });
    navigate(`/student/homework/success?id=${id}`);
  }

  return (
    <PageContainer className="flex max-w-3xl flex-col gap-6" size="narrow">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/student/homework")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label={t("student.backToHomework")}
        >
          <ArrowLeft className="size-5 text-primary-dark" />
        </button>
        <h1 className="text-xl font-bold text-primary-dark">{t("student.homework")}</h1>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !hw ? (
        <p className="text-sm text-zinc-400">{t("student.notFound")}</p>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-bold text-primary-dark">{hw.title}</h2>
            <p className="text-sm text-zinc-400">{classLabel}</p>
            {hw.curriculumLabels?.program ? (
              <p className="mt-1 text-xs font-medium text-gold">
                {t("student.assignedTopic", {
                  path: formatCurriculumPath(hw.curriculumLabels),
                })}
              </p>
            ) : null}
            <p
              className={`mt-1 text-xs font-medium ${
                overdue ? "text-red-600" : "text-zinc-500"
              }`}
            >
              {formatHomeworkDueLabel(hw.dueDate, hw.submitted, dueOptions)}
              {!hw.submitted && !underReview
                ? ` · ${formatDateTime(hw.dueDate)}`
                : ""}
            </p>
          </div>

          {hw.description ? (
            <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-zinc-700">{hw.description}</p>
            </Card>
          ) : null}

          {underReview && hw.submission ? (
            <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <Clock className="size-5 shrink-0" />
                <span>{t("student.underReviewMessage")}</span>
              </div>
              {hw.submission.curriculumLabels?.program ? (
                <p className="text-xs font-medium text-gold">
                  {t("student.yourTopic", {
                    path: formatCurriculumPath(hw.submission.curriculumLabels),
                  })}
                </p>
              ) : null}
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
                  <p className="font-semibold">{t("student.returnedForRevision")}</p>
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
                    {t("student.teacherFeedback")}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    {hw.submission.grade}
                  </p>
                  {hw.submission.feedback ? (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                      {hw.submission.feedback}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-500">{t("student.noWrittenFeedback")}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {t("student.acceptedWaitingGrade")}
                </div>
              )}

              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="size-5" />
                <span className="font-semibold">{t("student.submitted")}</span>
              </div>
              {hw.submission.curriculumLabels?.program ? (
                <p className="text-xs font-medium text-gold">
                  {t("student.topicLabel", {
                    path: formatCurriculumPath(hw.submission.curriculumLabels),
                  })}
                </p>
              ) : null}
              <div className="rounded-xl bg-[#EEF2F8] p-4">
                <p className="text-sm text-zinc-800">{hw.submission.content}</p>
              </div>
            </Card>
          ) : canSubmit ? (
            <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
              {overdue ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {t("student.overdueSubmitSoon")}
                </p>
              ) : null}

              <div>
                <span className="font-semibold text-primary-dark">{t("student.lessonTopic")}</span>
                <p className="mt-1 text-xs text-zinc-500">{t("student.lessonTopicDesc")}</p>
              </div>

              {treeLoading ? (
                <PageLoading compact label={t("student.loadingStudyPlan")} />
              ) : (
                <NestedCurriculumSelect
                  tree={curriculumTree}
                  value={curriculum}
                  onChange={setCurriculum}
                  required
                />
              )}

              <span className="font-semibold text-primary-dark">{t("student.yourSubmission")}</span>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("student.submissionPlaceholder")}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-zinc-500">
                {t("student.charCount", { count: String(trimmedLength) })}
                {trimmedLength > 0 && trimmedLength < MIN_SUBMISSION_CHARS
                  ? t("student.charMinHint", { min: String(MIN_SUBMISSION_CHARS) })
                  : ""}
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || !curriculumReady || submit.isPending}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-dark text-white"
              >
                <Send className="size-4" />
                {submit.isPending
                  ? t("student.sending")
                  : returned
                    ? t("student.resubmitForReview")
                    : t("student.sendForReview")}
              </Button>
            </Card>
          ) : null}
        </>
      )}
    </PageContainer>
  );
}
