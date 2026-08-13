import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FilePlus,
  Clock,
  CheckCircle,
  Users,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useTeacherHomework,
  useTeacherClasses,
  useCreateHomework,
  useUpdateHomework,
  useDeleteHomework,
} from "@/features/teacher/hooks/useTeacher";
import { HomeworkFormSheet } from "@/components/homework/HomeworkFormSheet";
import type { HomeworkFormValues } from "@/components/homework/HomeworkFormSheet";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/stores/authStore";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { formatCurriculumPath, matchesProgramFilter } from "@/lib/api/curriculumApi";
import type { Homework } from "@/types/models";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const BORDER_COLORS = [
  "border-l-teal-500",
  "border-l-blue-500",
  "border-l-[#C4922B]",
  "border-l-purple-500",
];

const SUBMISSION_BADGE_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-[#FDF3E0] text-gold",
  "bg-purple-100 text-purple-700",
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const REVIEW_AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-green-100 text-green-700",
];

function toFormInitial(hw: Homework): Partial<HomeworkFormValues> & { homeworkId: string } {
  return {
    homeworkId: hw._id,
    title: hw.title,
    description: hw.description ?? "",
    classId: hw.classId,
    dueDate: hw.dueDate.split("T")[0],
    curriculum: {
      programId: hw.curriculumProgram ?? "",
      unitId: hw.curriculumUnit ?? "",
      topicId: hw.curriculumTopic ?? "",
    },
  };
}

export function TeacherHomeworkPage() {
  const navigate = useNavigate();
  const { t, formatDate, formatTime } = usePortalTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { data: homework = [], isLoading } = useTeacherHomework();
  const { data: classes = [] } = useTeacherClasses();
  const createHomework = useCreateHomework();
  const updateHomework = useUpdateHomework();
  const deleteHomework = useDeleteHomework();

  const [sheetMode, setSheetMode] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Homework | null>(null);
  const [programFilter, setProgramFilter] = useState("");

  const { data: allPrograms = [] } = useCurriculumTree();

  const classOptions = classes.map((c) => ({ _id: c._id, name: c.name }));

  const visibleHomework = useMemo(
    () => homework.filter((hw) => matchesProgramFilter(hw.curriculumProgram, programFilter)),
    [homework, programFilter]
  );

  const homeworkPagination = usePaginatedList(visibleHomework, {
    resetDeps: [programFilter],
  });

  useEffect(() => {
    if (searchParams.get("new") === "1") setSheetMode("create");
  }, [searchParams]);

  function closeSheet() {
    setSheetMode(null);
    setEditing(null);
    if (searchParams.has("new") || searchParams.has("classId")) {
      setSearchParams({}, { replace: true });
    }
  }

  function openCreate() {
    setEditing(null);
    setSheetMode("create");
  }

  function openEdit(hw: Homework, e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(hw);
    setSheetMode("edit");
  }

  async function handleDelete(hw: Homework, e: React.MouseEvent) {
    e.stopPropagation();
    const confirmed = window.confirm(
      t("teacher.deleteHomeworkConfirm", { title: hw.title })
    );
    if (!confirmed) return;
    await deleteHomework.mutateAsync(hw._id);
  }

  async function handleFormSubmit(values: HomeworkFormValues) {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      curriculumProgram: values.curriculum.programId,
      curriculumUnit: values.curriculum.unitId || undefined,
      curriculumTopic: values.curriculum.topicId || undefined,
    };

    if (sheetMode === "edit" && editing) {
      await updateHomework.mutateAsync({ id: editing._id, ...payload });
    } else {
      await createHomework.mutateAsync({
        ...payload,
        classId: values.classId,
      });
    }
    closeSheet();
  }

  const activeCount = visibleHomework.length;
  const pendingCount = visibleHomework.reduce(
    (acc, hw) => acc + (hw.pendingReviewCount ?? 0),
    0
  );

  const statCards = [
    {
      icon: <FilePlus className="size-5 text-teal-600" />,
      bg: "bg-teal-100",
      value: activeCount,
      label: t("teacher.activeAssignments"),
    },
    {
      icon: <Clock className="size-5 text-amber-600" />,
      bg: "bg-amber-100",
      value: pendingCount,
      label: t("teacher.pendingReviews"),
    },
    {
      icon: <CheckCircle className="size-5 text-green-600" />,
      bg: "bg-green-100",
      value: visibleHomework.filter((h) => h.submissionCount === h.totalStudents).length,
      label: t("teacher.fullySubmitted"),
    },
    {
      icon: <Users className="size-5 text-blue-600" />,
      bg: "bg-blue-100",
      value: classes.reduce((acc, c) => acc + (c.studentIds?.length ?? 0), 0),
      label: t("teacher.totalStudents"),
    },
  ];

  const formInitial =
    sheetMode === "edit" && editing
      ? toFormInitial(editing)
      : searchParams.get("classId")
        ? { classId: searchParams.get("classId") ?? "" }
        : undefined;

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-zinc-500">{t("teacher.assalamuAlaikum")}</span>
        <h1 className="text-2xl font-bold text-primary-dark">
          {user?.name ?? t("teacher.teacherFallbackName")}
        </h1>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-2 rounded-full bg-[#EEF2F8] px-4 py-2">
          <span className="text-sm font-bold text-primary-dark">{activeCount}</span>
          <span className="text-xs text-primary-dark/70">{t("teacher.activeAssignments")}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#FDF3E0] px-4 py-2">
          <span className="text-sm font-bold text-gold">{pendingCount}</span>
          <span className="text-xs text-gold/80">{t("teacher.pendingReviews")}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((k) => (
          <Card key={k.label} className="flex flex-col gap-2 rounded-2xl border-0 p-4 shadow-sm">
            <div className={`flex size-9 items-center justify-center rounded-xl ${k.bg}`}>{k.icon}</div>
            <span className="text-2xl font-bold text-primary-dark">{k.value}</span>
            <span className="text-xs text-zinc-400">{k.label}</span>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-4 rounded-3xl border-0 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-base font-bold text-primary-dark">{t("teacher.activeAssignments")}</span>
          <div className="flex flex-wrap items-center gap-2">
            <CurriculumProgramFilter
              tree={allPrograms}
              value={programFilter}
              onChange={setProgramFilter}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-1 text-sm font-semibold text-gold"
            >
              <Plus className="size-4" />
              {t("teacher.assignNew")}
            </button>
          </div>
        </div>

        {isLoading ? (
          <PageLoading />
        ) : visibleHomework.length === 0 ? (
          <EmptyState
            icon={FilePlus}
            title={
              homework.length === 0
                ? t("teacher.noHomeworkYet")
                : t("teacher.noHomeworkProgram")
            }
            description={
              homework.length === 0
                ? t("teacher.noHomeworkYetDesc")
                : t("teacher.clearProgramFilter")
            }
          />
        ) : (
          <>
          <div className="flex flex-col gap-3">
            {homeworkPagination.paginatedItems.map((hw, i) => (
              <div
                key={hw._id}
                onClick={() => navigate(`/teacher/homework/${hw._id}/grade`)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-l-4 bg-[#F8F9FF] p-3 ${BORDER_COLORS[i % BORDER_COLORS.length]}`}
              >
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-bold text-primary-dark">{hw.title}</span>
                  <span className="text-xs text-zinc-400">
                    {hw.className ?? "–"} · {t("teacher.dueLabel")}{" "}
                    {formatDate(hw.dueDate)}
                    {hw.curriculumLabels?.program
                      ? ` · ${formatCurriculumPath(hw.curriculumLabels)}`
                      : ""}
                  </span>
                  <span
                    className={`mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${SUBMISSION_BADGE_COLORS[i % SUBMISSION_BADGE_COLORS.length]}`}
                  >
                    {t("teacher.submittedCount", {
                      submitted: String(hw.submissionCount ?? 0),
                      total: String(hw.totalStudents ?? 0),
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => openEdit(hw, e)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-white hover:text-primary-dark"
                    aria-label={t("teacher.editHomework")}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(hw, e)}
                    disabled={deleteHomework.isPending}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-white hover:text-red-600"
                    aria-label={t("teacher.deleteHomework")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <ChevronRight className="size-5 text-zinc-300" />
                </div>
              </div>
            ))}
          </div>
          <Pagination pagination={homeworkPagination} itemLabel="assignments" />
          </>
        )}

        <button
          type="button"
          onClick={openCreate}
          className="mt-1 flex items-center gap-1 text-sm font-semibold text-gold"
        >
          <Plus className="size-4" />
          {t("teacher.createNewAssignment")}
        </button>
      </Card>

      {homework.some((hw) => (hw.submissions?.length ?? 0) > 0) && (
        <Card className="flex flex-col gap-4 rounded-3xl border-0 p-5 shadow-sm">
          <span className="text-base font-bold text-primary-dark">{t("teacher.pendingReviews")}</span>
          <div className="flex flex-col gap-3">
            {homework
              .flatMap((hw) =>
                (hw.submissions ?? [])
                  .filter((s) => !s.grade)
                  .slice(0, 2)
                  .map((sub, si) => ({ hw, sub, si }))
              )
              .slice(0, 4)
              .map(({ hw, sub, si }) => (
                <div key={sub._id} className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${REVIEW_AVATAR_COLORS[si % REVIEW_AVATAR_COLORS.length]}`}
                  >
                    {initials(sub.studentName ?? "?")}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-bold text-primary-dark">
                      {sub.studentName ?? t("teacher.studentFallback")}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {hw.title} ·{" "}
                      {formatTime(sub.submittedAt)}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/teacher/homework/${hw._id}/grade`)}
                    className="h-8 rounded-full bg-primary-dark px-4 py-0 text-xs text-white"
                  >
                    {t("teacher.review")}
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}

      <HomeworkFormSheet
        open={sheetMode !== null}
        mode={sheetMode === "edit" ? "edit" : "create"}
        initial={formInitial}
        classes={classOptions}
        isSubmitting={createHomework.isPending || updateHomework.isPending}
        onClose={closeSheet}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
}
