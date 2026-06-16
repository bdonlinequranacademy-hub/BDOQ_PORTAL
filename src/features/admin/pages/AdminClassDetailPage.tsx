import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, UserPlus, UserMinus, Banknote } from "lucide-react";
import {
  useAdminClass,
  useAdminUsers,
  useAssignStudent,
  useRemoveStudent,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClassHero } from "@/components/classes/ClassHero";
import { classTitle, formatDuration, studentCount, studentList, teacherName } from "@/lib/utils/class";
import { formControlClass } from "@/lib/formControl";
import { PageLoading } from "@/components/ui/PageLoading";

export function AdminClassDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: cls, isLoading } = useAdminClass(id);
  const { data: allStudents = [] } = useAdminUsers("student");
  const assignStudent = useAssignStudent(id);
  const removeStudent = useRemoveStudent(id);
  const [pickStudent, setPickStudent] = useState("");

  const enrolled = cls ? studentList(cls.students) : [];
  const enrolledIds = new Set(enrolled.map((s) => s._id));
  const available = allStudents.filter((s) => !enrolledIds.has(s.id));

  async function handleAssign() {
    if (!pickStudent) return;
    await assignStudent.mutateAsync(pickStudent);
    setPickStudent("");
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Back to classes"
        >
          <ArrowLeft className="size-5 text-navy" />
        </button>
        <h1 className="flex-1 font-display text-xl font-bold text-navy">Class details</h1>
        <button
          type="button"
          onClick={() => navigate(`/admin/classes/${id}/edit`)}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Edit class"
        >
          <Pencil className="size-4 text-navy" />
        </button>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !cls ? (
        <p className="text-sm text-zinc-400">Class not found.</p>
      ) : (
        <>
          <ClassHero
            title={classTitle(cls)}
            description={cls.description}
            teacherName={teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
            schedule={cls.schedule}
            meetingLink={cls.meetingLink}
            badge={
              cls.isActive === false ? (
                <span className="w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  Inactive
                </span>
              ) : undefined
            }
            meta={
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span>{studentCount(cls)} students enrolled</span>
                {cls.sessionRateBdt != null ? (
                  <span className="inline-flex items-center gap-1">
                    <Banknote className="size-3.5" />
                    {cls.sessionRateBdt} BDT / session
                  </span>
                ) : null}
                {cls.schedule?.duration ? (
                  <span>{formatDuration(cls.schedule.duration)} per session</span>
                ) : null}
              </div>
            }
          />

          <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
            <span className="font-bold text-navy">Enrolled students ({enrolled.length})</span>
            {enrolled.length === 0 ? (
              <p className="text-sm text-zinc-400">No students enrolled yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {enrolled.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy">{s.name}</p>
                      <p className="text-xs text-zinc-400">{s.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Remove ${s.name} from this class?`)) return;
                        removeStudent.mutate(s._id);
                      }}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label={`Remove ${s.name}`}
                    >
                      <UserMinus className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
            <span className="flex items-center gap-2 text-sm font-bold text-navy">
              <UserPlus className="size-4" />
              Add student
            </span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={pickStudent}
                onChange={(e) => setPickStudent(e.target.value)}
                className={`${formControlClass} flex-1`}
              >
                <option value="">Select student…</option>
                {available.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleAssign}
                disabled={!pickStudent || assignStudent.isPending}
                className="rounded-xl bg-navy px-4 text-white"
              >
                Add to class
              </Button>
            </div>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
