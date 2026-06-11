import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import {
  useTeacherStudents,
  useStudentProgress,
  useUpdateProgress,
  useToggleCurriculumComplete,
} from "@/features/teacher/hooks/useTeacher";
import {
  NestedCurriculumSelect,
  useCurriculumTree,
} from "@/components/curriculum/NestedCurriculumSelect";
import {
  StudentCurriculumPlan,
  curriculumAssignmentKey,
} from "@/components/curriculum/StudentCurriculumPlan";
import type { CurriculumAssignment, CurriculumPath } from "@/lib/api/curriculumApi";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

export function TeacherProgressPage() {
  const [params] = useSearchParams();
  const { data: students = [] } = useTeacherStudents();
  const updateProgress = useUpdateProgress();
  const toggleComplete = useToggleCurriculumComplete();

  const [studentId, setStudentId] = useState(params.get("studentId") ?? "");
  const [classId, setClassId] = useState("");
  const [tajweed, setTajweed] = useState(50);
  const [notes, setNotes] = useState("");
  const [curriculum, setCurriculum] = useState<CurriculumPath>({ programId: "" });
  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  const selectedStudent = useMemo(
    () => students.find((s) => s._id === studentId),
    [students, studentId]
  );

  const curriculumPlan = selectedStudent?.curriculumAssignments ?? [];

  const { data: progressList = [], isLoading: progressLoading } =
    useStudentProgress(studentId);

  const { data: curriculumTree = [], isLoading: treeLoading } = useCurriculumTree(
    studentId ? { studentId } : undefined
  );

  const savedProgress = useMemo(
    () => progressList.find((item) => item.classId === classId),
    [progressList, classId]
  );

  useEffect(() => {
    if (!studentId) {
      setClassId("");
      return;
    }
    if (classId && selectedStudent?.classes.some((c) => c._id === classId)) {
      return;
    }
    setClassId(progressList[0]?.classId ?? selectedStudent?.classes[0]?._id ?? "");
  }, [studentId, selectedStudent, progressList, classId]);

  useEffect(() => {
    const progress = progressList.find((item) => item.classId === classId);
    if (progress) {
      setTajweed(progress.tajweedScore ?? 50);
      setNotes(progress.notes ?? "");
      if (progress.curriculumProgram) {
        setCurriculum({
          programId: progress.curriculumProgram,
          unitId: progress.curriculumUnit ?? "",
          topicId: progress.curriculumTopic ?? "",
        });
      }
    } else if (classId) {
      setTajweed(50);
      setNotes("");
      setCurriculum({ programId: "" });
    }
  }, [progressList, classId]);

  useEffect(() => {
    if (!studentId) setCurriculum({ programId: "" });
  }, [studentId]);

  async function handleToggle(assignment: CurriculumAssignment, completed: boolean) {
    if (!studentId) return;
    const key = curriculumAssignmentKey(assignment);
    setTogglingKey(key);
    try {
      await toggleComplete.mutateAsync({
        studentId,
        programId: assignment.programId,
        unitId: assignment.unitId,
        topicId: assignment.topicId,
        completed,
      });
    } finally {
      setTogglingKey(null);
    }
  }

  async function handleSave() {
    if (!studentId || !classId || !curriculum.programId) return;
    await updateProgress.mutateAsync({
      studentId,
      classId,
      curriculumProgram: curriculum.programId,
      curriculumUnit: curriculum.unitId || undefined,
      curriculumTopic: curriculum.topicId || undefined,
      tajweedScore: tajweed,
      notes,
    });
  }

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">Progress Management</h1>
        <p className="text-sm text-zinc-500">
          Mark surah completion and update Tajweed notes for your students
        </p>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm p-5 flex flex-col gap-4">
          <Select
            label="Select Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Choose student…</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </Select>

          {studentId ? (
            <Select
              label="Class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Choose class…</option>
              {(selectedStudent?.classes ?? []).map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.title}</option>
              ))}
            </Select>
          ) : null}
        </Card>

        {studentId ? (
          <Card className="rounded-2xl border-0 shadow-sm p-5 flex flex-col gap-3">
            <div>
              <span className="font-bold text-[#03214F] text-sm">Assigned curriculum</span>
              <p className="text-xs text-zinc-500 mt-0.5">
                When a surah or topic is finished, mark it complete — the student sees it everywhere.
              </p>
            </div>
            <StudentCurriculumPlan
              assignments={curriculumPlan}
              allowToggle
              togglingKey={togglingKey}
              onToggle={handleToggle}
              emptyMessage="No curriculum assigned yet. Ask admin to set program → surah on the student profile."
            />
          </Card>
        ) : null}

        {studentId && classId ? (
          progressLoading ? (
            <p className="text-zinc-400 text-sm">Loading progress…</p>
          ) : (
            <>
              <Card className="rounded-2xl border-0 shadow-sm p-5 flex flex-col gap-4">
                {savedProgress?.curriculumLabels?.program ? (
                  <p className="text-xs text-zinc-500">
                    Last class log program:{" "}
                    <span className="font-medium text-[#C4922B]">
                      {formatCurriculumPath(savedProgress.curriculumLabels)}
                    </span>
                  </p>
                ) : savedProgress ? (
                  <p className="text-xs text-amber-700">
                    No program saved yet — pick one below before saving.
                  </p>
                ) : null}
                {treeLoading ? (
                  <p className="text-sm text-zinc-400">Loading curriculum…</p>
                ) : (
                  <NestedCurriculumSelect
                    tree={curriculumTree}
                    value={curriculum}
                    onChange={setCurriculum}
                    required
                  />
                )}
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#03214F] text-sm">Tajweed Score</span>
                  <span className="font-bold text-[#2b7fff] text-2xl">{tajweed}%</span>
                </div>
                <div className="rounded-full bg-zinc-100 w-full h-3 relative">
                  <div
                    className="rounded-full bg-[#2b7fff] h-full transition-all"
                    style={{ width: `${tajweed}%` }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTajweed((v) => Math.max(0, v - 5))}
                    className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center"
                  >
                    <Minus className="size-4 text-zinc-600" />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={tajweed}
                    onChange={(e) => setTajweed(Number(e.target.value))}
                    className="flex-1 accent-[#2b7fff]"
                  />
                  <button
                    type="button"
                    onClick={() => setTajweed((v) => Math.min(100, v + 5))}
                    className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center"
                  >
                    <Plus className="size-4 text-zinc-600" />
                  </button>
                </div>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm p-5 flex flex-col gap-3">
                <Textarea
                  label="Teacher Notes"
                  placeholder="Add notes about this student's progress…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </Card>

              <Button
                onClick={handleSave}
                disabled={updateProgress.isPending || !curriculum.programId}
                className="rounded-xl bg-[#03214F] text-white font-semibold w-full h-12"
              >
                {updateProgress.isPending ? "Saving…" : "Save Progress"}
              </Button>
            </>
          )
        ) : null}
    </PageContainer>
  );
}
