import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FilePlus,
  Clock,
  CheckCircle,
  Users,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import {
  useTeacherHomework,
  useTeacherClasses,
  useCreateHomework,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/stores/authStore";
import { formControlClass } from "@/lib/formControl";
import { defaultHomeworkDueDate } from "@/lib/homeworkDue";
import {
  NestedCurriculumSelect,
  useCurriculumTree,
} from "@/components/curriculum/NestedCurriculumSelect";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import { formatCurriculumPath, matchesProgramFilter } from "@/lib/api/curriculumApi";
import type { CurriculumPath } from "@/lib/api/curriculumApi";

const BORDER_COLORS = [
  "border-l-teal-500",
  "border-l-blue-500",
  "border-l-[#C4922B]",
  "border-l-purple-500",
];

const SUBMISSION_BADGE_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-blue-100 text-blue-700",
  "bg-[#FDF3E0] text-[#C4922B]",
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

export function TeacherHomeworkPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { data: homework = [], isLoading } = useTeacherHomework();
  const { data: classes = [] } = useTeacherClasses();
  const createHomework = useCreateHomework();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState(searchParams.get("classId") ?? "");
  const [dueDate, setDueDate] = useState("");
  const [curriculum, setCurriculum] = useState<CurriculumPath>({ programId: "" });
  const [programFilter, setProgramFilter] = useState("");

  const { data: curriculumTree = [] } = useCurriculumTree(
    classId ? { classId } : undefined
  );
  const { data: allPrograms = [] } = useCurriculumTree();

  const visibleHomework = useMemo(
    () => homework.filter((hw) => matchesProgramFilter(hw.curriculumProgram, programFilter)),
    [homework, programFilter]
  );

  useEffect(() => {
    const prefillClass = searchParams.get("classId");
    if (prefillClass) setClassId(prefillClass);
    if (searchParams.get("new") === "1") setShowForm(true);
  }, [searchParams]);

  useEffect(() => {
    if (!showForm) return;
    if (!dueDate) setDueDate(defaultHomeworkDueDate());
    if (!classId && classes.length === 1) {
      setClassId(classes[0]._id);
    }
  }, [showForm, classes, classId, dueDate]);

  function closeForm() {
    setShowForm(false);
    if (searchParams.has("new") || searchParams.has("classId")) {
      setSearchParams({}, { replace: true });
    }
  }

  const activeCount = visibleHomework.length;
  const pendingCount = visibleHomework.reduce(
    (acc, hw) => acc + (hw.pendingReviewCount ?? 0),
    0
  );

  async function handleCreate() {
    if (!title || !classId || !dueDate || !curriculum.programId) return;
    await createHomework.mutateAsync({
      title,
      description,
      classId,
      dueDate,
      curriculumProgram: curriculum.programId,
      curriculumUnit: curriculum.unitId || undefined,
      curriculumTopic: curriculum.topicId || undefined,
    });
    setTitle("");
    setDescription("");
    setClassId("");
    setDueDate("");
    setCurriculum({ programId: "" });
    closeForm();
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <span className="text-zinc-500 text-sm">Assalamu Alaikum,</span>
        <h1 className="font-bold text-[#03214F] text-2xl font-display">{user?.name ?? "Teacher"}</h1>
      </div>

      {/* Pills */}
      <div className="flex gap-2">
        <div className="rounded-full bg-[#EEF2F8] flex items-center gap-2 px-4 py-2">
          <span className="font-bold text-[#03214F] text-sm">{activeCount}</span>
          <span className="text-[#03214F]/70 text-xs">Active Assignments</span>
        </div>
        <div className="rounded-full bg-[#FDF3E0] flex items-center gap-2 px-4 py-2">
          <span className="font-bold text-[#C4922B] text-sm">{pendingCount}</span>
          <span className="text-[#C4922B]/80 text-xs">Pending Reviews</span>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: <FilePlus className="size-5 text-teal-600" />, bg: "bg-teal-100", value: activeCount, label: "Active Assignments" },
          { icon: <Clock className="size-5 text-amber-600" />, bg: "bg-amber-100", value: pendingCount, label: "Pending Reviews" },
          { icon: <CheckCircle className="size-5 text-green-600" />, bg: "bg-green-100", value: visibleHomework.filter((h) => h.submissionCount === h.totalStudents).length, label: "Fully Submitted" },
          { icon: <Users className="size-5 text-blue-600" />, bg: "bg-blue-100", value: classes.reduce((acc, c) => acc + (c.studentIds?.length ?? 0), 0), label: "Total Students" },
        ].map((k) => (
          <Card key={k.label} className="rounded-2xl border-0 shadow-sm p-4 flex flex-col gap-2">
            <div className={`size-9 rounded-xl ${k.bg} flex items-center justify-center`}>{k.icon}</div>
            <span className="font-bold text-[#03214F] text-2xl">{k.value}</span>
            <span className="text-zinc-400 text-xs">{k.label}</span>
          </Card>
        ))}
      </div>

      {/* Active Assignments */}
      <Card className="rounded-3xl border-0 shadow-sm p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold text-[#03214F] text-base">Active Assignments</span>
          <div className="flex flex-wrap items-center gap-2">
            <CurriculumProgramFilter
              tree={allPrograms}
              value={programFilter}
              onChange={setProgramFilter}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
            <button
              onClick={() => setShowForm(true)}
              className="font-semibold text-[#C4922B] text-sm flex items-center gap-1"
            >
              <Plus className="size-4" />
              Assign New
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-zinc-400 text-sm">Loading…</p>
        ) : visibleHomework.length === 0 ? (
          <EmptyState
            icon={FilePlus}
            title={homework.length === 0 ? "No homework yet" : "No assignments for this program"}
            description={
              homework.length === 0
                ? "Create an assignment for one of your classes. Due date defaults to one week ahead."
                : "Try clearing the program filter."
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {visibleHomework.map((hw, i) => (
              <div
                key={hw._id}
                onClick={() => navigate(`/teacher/homework/${hw._id}/grade`)}
                className={`rounded-2xl bg-[#F8F9FF] border-l-4 ${BORDER_COLORS[i % BORDER_COLORS.length]} flex items-center gap-3 p-3 cursor-pointer`}
              >
                <div className="flex flex-col flex-1 gap-1">
                  <span className="font-bold text-[#03214F] text-sm">{hw.title}</span>
                  <span className="text-zinc-400 text-xs">
                    {hw.className ?? "–"} · Due {new Date(hw.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {hw.curriculumLabels?.program
                      ? ` · ${formatCurriculumPath(hw.curriculumLabels)}`
                      : ""}
                  </span>
                  <span
                    className={`font-semibold rounded-full text-[10px] mt-1 px-2 py-0.5 w-fit ${SUBMISSION_BADGE_COLORS[i % SUBMISSION_BADGE_COLORS.length]}`}
                  >
                    {hw.submissionCount ?? 0}/{hw.totalStudents ?? 0} submitted
                  </span>
                </div>
                <ChevronRight className="size-5 text-zinc-300" />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowForm(true)}
          className="font-semibold text-[#C4922B] text-sm flex items-center gap-1 mt-1"
        >
          <Plus className="size-4" />
          Create New Assignment
        </button>
      </Card>

      {/* Pending Reviews */}
      {homework.some((hw) => (hw.submissions?.length ?? 0) > 0) && (
        <Card className="rounded-3xl border-0 shadow-sm p-5 flex flex-col gap-4">
          <span className="font-bold text-[#03214F] text-base">Pending Reviews</span>
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
                    className={`size-10 font-bold rounded-full flex items-center justify-center text-xs ${REVIEW_AVATAR_COLORS[si % REVIEW_AVATAR_COLORS.length]}`}
                  >
                    {initials(sub.studentName ?? "?")}
                  </div>
                  <div className="flex flex-col flex-1 gap-0.5">
                    <span className="font-bold text-[#03214F] text-sm">
                      {sub.studentName ?? "Student"}
                    </span>
                    <span className="text-zinc-400 text-xs">
                      {hw.title} · {new Date(sub.submittedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/teacher/homework/${hw._id}/grade`)}
                    className="rounded-full bg-[#03214F] text-white text-xs px-4 h-8 py-0"
                  >
                    Review
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Create homework drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="flex w-full flex-col gap-5 rounded-t-3xl border-t border-portal-border bg-portal-surface p-6">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#03214F] text-lg font-display">New Homework</span>
              <button type="button" onClick={closeForm}>
                <X className="size-5 text-zinc-400" />
              </button>
            </div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <Select
              label="Class"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setCurriculum({ programId: "" });
              }}
            >
              <option value="">Select class…</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Select>
            {classId ? (
              <NestedCurriculumSelect
                tree={curriculumTree}
                value={curriculum}
                onChange={setCurriculum}
                required
              />
            ) : (
              <p className="text-xs text-zinc-500">Select a class to load curriculum options.</p>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500">
                Due date (defaults to 7 days from today)
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={formControlClass}
              />
            </label>
            <Button
              onClick={handleCreate}
              disabled={createHomework.isPending || !title || !classId || !dueDate || !curriculum.programId}
              className="rounded-xl bg-[#03214F] text-white font-semibold w-full h-12"
            >
              {createHomework.isPending ? "Creating…" : "Create Homework"}
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
