import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Save } from "lucide-react";
import {
  useTeacherStudents,
  useTeacherMonthlyProgress,
  useMonthlyProgressQuestions,
  useSaveMonthlyProgress,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { currentMonthValue, formatMonthLabel } from "@/lib/utils/month";
import { formControlClass } from "@/lib/formControl";
import type { TeacherStudent } from "@/lib/api/teacherApi";

import { PageLoading } from "@/components/ui/PageLoading";
export function TeacherMonthlyProgressPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherSummary, setTeacherSummary] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: students = [] } = useTeacherStudents();
  const { data: snapshots = [], isLoading } = useTeacherMonthlyProgress(month);
  const { data: questions = [] } = useMonthlyProgressQuestions();
  const saveProgress = useSaveMonthlyProgress();

  const selectedStudent = useMemo(
    () => students.find((s) => s._id === studentId),
    [students, studentId]
  );

  const existing = useMemo(
    () =>
      snapshots.find(
        (s) => s.student._id === studentId && s.class._id === classId && s.month === month
      ),
    [snapshots, studentId, classId, month]
  );

  useEffect(() => {
    if (!studentId) {
      setClassId("");
      return;
    }
    if (classId && selectedStudent?.classes.some((c) => c._id === classId)) return;
    setClassId(selectedStudent?.classes[0]?._id ?? "");
  }, [studentId, selectedStudent, classId]);

  useEffect(() => {
    if (existing) {
      setTeacherSummary(existing.teacherSummary ?? "");
      const map: Record<string, string> = {};
      for (const qa of existing.qaResponses) {
        map[qa.question] = qa.answer;
      }
      setAnswers(map);
    } else {
      setTeacherSummary("");
      setAnswers({});
    }
  }, [existing?._id]);

  async function handleSave() {
    if (!studentId || !classId) return;
    await saveProgress.mutateAsync({
      studentId,
      classId,
      month,
      teacherSummary,
      qaResponses: questions.map((q) => ({
        question: q,
        answer: answers[q] ?? "",
      })),
    });
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#03214F]">Monthly Progress</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Month-end snapshots for parents — {formatMonthLabel(month)}
          </p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={`${formControlClass} w-full sm:w-auto`}
        />
      </div>

      <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-[#C4922B]" />
          <span className="font-bold text-[#03214F]">Create / update snapshot</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Choose student…</option>
            {students.map((s: TeacherStudent) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Select>

          {studentId ? (
            <Select label="Class" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">Choose class…</option>
              {(selectedStudent?.classes ?? []).map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.title}
                </option>
              ))}
            </Select>
          ) : null}
        </div>

        {studentId && classId ? (
          <>
            {existing ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Snapshot exists — {existing.sessionsHeld} sessions held this month · Tajweed{" "}
                {existing.tajweedScore}%
              </div>
            ) : null}

            <Textarea
              label="Teacher summary"
              value={teacherSummary}
              onChange={(e) => setTeacherSummary(e.target.value)}
              rows={3}
              placeholder="Overall progress this month…"
            />

            {questions.map((question) => (
              <Textarea
                key={question}
                label={question}
                value={answers[question] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [question]: e.target.value }))
                }
                rows={2}
              />
            ))}

            <Button
              type="button"
              onClick={handleSave}
              disabled={saveProgress.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#03214F] text-white"
            >
              <Save className="size-4" />
              {saveProgress.isPending ? "Saving…" : "Save monthly snapshot"}
            </Button>
          </>
        ) : null}
      </Card>

      <div>
        <h2 className="mb-3 font-bold text-[#03214F]">Saved snapshots</h2>
        {isLoading ? (
          <PageLoading />
        ) : snapshots.length === 0 ? (
          <p className="text-sm text-zinc-400">No snapshots for this month yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {snapshots.map((snap) => (
              <Card key={snap._id} className="rounded-2xl border-0 p-5 shadow-sm">
                <p className="font-bold text-[#03214F]">{snap.student.name}</p>
                <p className="text-xs text-zinc-500">
                  {snap.class.title} · {snap.sessionsHeld} sessions · Tajweed {snap.tajweedScore}%
                </p>
                {snap.teacherSummary ? (
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{snap.teacherSummary}</p>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
