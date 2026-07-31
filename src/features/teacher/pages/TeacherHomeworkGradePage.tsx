import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Users, Clock, RotateCcw } from "lucide-react";
import {
  useHomeworkDetail,
  useGradeSubmission,
  useReviewHomeworkSubmission,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import type { Grade, HomeworkSubmission, HomeworkSubmissionStatus } from "@/types/models";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const GRADES: Grade[] = ["A", "B", "C", "D", "F"];

const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-amber-500 text-white",
  D: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function effectiveStatus(sub: HomeworkSubmission): HomeworkSubmissionStatus {
  if (sub.status) return sub.status;
  if (sub.grade) return "graded";
  return "approved";
}

export function TeacherHomeworkGradePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { t, formatDate } = usePortalTranslation();
  const { data: homework, isLoading } = useHomeworkDetail(id);
  const reviewSubmission = useReviewHomeworkSubmission(id);
  const gradeSubmission = useGradeSubmission(id);

  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [selectedGrades, setSelectedGrades] = useState<Record<string, Grade>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});
  const [gradedIds, setGradedIds] = useState<Set<string>>(new Set());

  const submissions = homework?.submissions ?? [];
  const pendingReview = submissions.filter(
    (s) => effectiveStatus(s) === "pending_review"
  );
  const readyToGrade = submissions.filter(
    (s) => effectiveStatus(s) === "approved" && !gradedIds.has(s._id)
  );

  const activeList = pendingReview.length > 0 ? pendingReview : readyToGrade;
  const activeSub: HomeworkSubmission | undefined =
    activeList.find((s) => s._id === activeSubId) ?? activeList[0];
  const activeStatus = activeSub ? effectiveStatus(activeSub) : null;

  async function handleApprove() {
    if (!activeSub) return;
    await reviewSubmission.mutateAsync({
      studentId: activeSub.studentId,
      action: "approve",
    });
    setActiveSubId(null);
  }

  async function handleReturn() {
    if (!activeSub) return;
    await reviewSubmission.mutateAsync({
      studentId: activeSub.studentId,
      action: "return",
      feedback: returnNotes[activeSub._id] ?? "",
    });
    setActiveSubId(null);
  }

  async function handleGrade() {
    if (!activeSub) return;
    const grade = selectedGrades[activeSub._id] ?? "A";
    const feedback = feedbacks[activeSub._id] ?? "";
    await gradeSubmission.mutateAsync({
      studentId: activeSub.studentId,
      grade,
      feedback,
    });
    setGradedIds((prev) => new Set([...prev, activeSub._id]));
    setActiveSubId(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="size-9 rounded-full bg-zinc-100 text-primary-dark flex items-center justify-center"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex flex-col items-center mx-auto">
            <span className="brand-wordmark text-2xl text-primary-dark">BDOQ Academy</span>
            <span className="font-bold text-zinc-900 text-xs">{t("teacher.homeworkReview")}</span>
          </div>
          <div className="size-9" />
        </div>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !homework ? (
        <p className="p-5 text-sm text-zinc-400">{t("teacher.homeworkNotFound")}</p>
      ) : (
        <PageContainer className="flex flex-col gap-6 pb-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-primary-dark text-xl">{homework.title}</h1>
            {homework.className && <p className="text-zinc-400 text-sm">{homework.className}</p>}
            {homework.curriculumLabels?.program ? (
              <p className="text-xs font-medium text-gold">
                {formatCurriculumPath(homework.curriculumLabels)}
              </p>
            ) : null}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                <Users className="size-3.5" />
                <span>
                  {t("teacher.awaitingReviewCount", {
                    count: String(pendingReview.length),
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                <Clock className="size-3.5" />
                <span>
                  {t("teacher.dueLabel")} {formatDate(homework.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {pendingReview.length === 0 && readyToGrade.length === 0 ? (
            <Card className="rounded-2xl border-0 shadow-sm p-6 text-center">
              <Check className="size-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-primary-dark text-base">{t("teacher.allCaughtUp")}</p>
              <p className="text-zinc-400 text-sm mt-1">{t("teacher.noSubmissionsWaiting")}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
              <Card className="flex flex-col gap-3 rounded-3xl border-0 p-5 shadow-sm">
                <span className="font-bold text-primary-dark text-base">
                  {pendingReview.length > 0
                    ? t("teacher.awaitingYourReview")
                    : t("teacher.readyToGrade")}
                </span>
                {activeList.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => setActiveSubId(sub._id)}
                    className={`flex items-center gap-3 rounded-2xl p-3 text-left transition ${
                      (activeSubId ?? activeList[0]?._id) === sub._id
                        ? "bg-[#EEF2F8]"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="size-10 font-bold rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                      {initials(sub.studentName ?? "?")}
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <span className="font-bold text-zinc-900 text-sm">
                        {sub.studentName ?? t("teacher.studentFallback")}
                      </span>
                      <span className="text-zinc-400 text-xs">
                        {effectiveStatus(sub) === "pending_review"
                          ? t("teacher.needsApproval")
                          : t("teacher.approvedGradeNow")}
                      </span>
                    </div>
                  </button>
                ))}
              </Card>

              {activeSub && (
                <Card className="flex flex-col gap-4 rounded-3xl border-0 p-5 shadow-sm lg:sticky lg:top-20">
                  <div className="rounded-2xl bg-[#EEF2F8] p-4">
                    {activeSub.curriculumLabels?.program ? (
                      <p className="mb-2 text-xs font-medium text-gold">
                        {t("teacher.studentTopic", {
                          path: formatCurriculumPath(activeSub.curriculumLabels),
                        })}
                      </p>
                    ) : null}
                    <p className="text-sm leading-relaxed text-zinc-800">{activeSub.content}</p>
                  </div>

                  {activeStatus === "pending_review" ? (
                    <>
                      <Textarea
                        placeholder={t("teacher.returnNotePlaceholder")}
                        value={returnNotes[activeSub._id] ?? ""}
                        onChange={(e) =>
                          setReturnNotes((prev) => ({
                            ...prev,
                            [activeSub._id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          onClick={handleApprove}
                          disabled={reviewSubmission.isPending}
                          className="flex-1 rounded-xl bg-primary-dark text-white"
                        >
                          {t("teacher.approveSubmission")}
                        </Button>
                        <Button
                          onClick={handleReturn}
                          disabled={reviewSubmission.isPending}
                          variant="secondary"
                          className="flex-1 rounded-xl"
                        >
                          <RotateCcw className="mr-2 size-4" />
                          {t("teacher.returnForRevision")}
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {t("teacher.homeworkCountsAfterApprove")}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {GRADES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() =>
                              setSelectedGrades((prev) => ({ ...prev, [activeSub._id]: g }))
                            }
                            className={`size-10 rounded-xl font-bold text-sm ${
                              (selectedGrades[activeSub._id] ?? "A") === g
                                ? GRADE_COLORS[g]
                                : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder={t("teacher.feedbackPlaceholder")}
                        value={feedbacks[activeSub._id] ?? ""}
                        onChange={(e) =>
                          setFeedbacks((prev) => ({
                            ...prev,
                            [activeSub._id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                      <Button
                        onClick={handleGrade}
                        disabled={gradeSubmission.isPending}
                        className="rounded-xl bg-primary-dark text-white"
                      >
                        {t("teacher.submitGrade")}
                      </Button>
                    </>
                  )}
                </Card>
              )}
            </div>
          )}
        </PageContainer>
      )}
    </div>
  );
}
