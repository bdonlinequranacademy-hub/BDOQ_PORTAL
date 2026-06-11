import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, UserPlus, UserMinus, ExternalLink } from "lucide-react";
import {
  useAdminClass,
  useAdminUsers,
  useAssignStudent,
  useRemoveStudent,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { classTitle, teacherName, studentList } from "@/lib/utils/class";
import { formControlClass } from "@/lib/formControl";

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
          onClick={() => navigate("/admin/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Back to classes"
        >
          <ArrowLeft className="size-5 text-[#03214F]" />
        </button>
        <h1 className="flex-1 font-display text-xl font-bold text-[#03214F]">Class Detail</h1>
        <button
          onClick={() => navigate(`/admin/classes/${id}/edit`)}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Edit class"
        >
          <Pencil className="size-4 text-[#03214F]" />
        </button>
      </div>

      {isLoading || !cls ? (
        <p className="text-sm text-zinc-400">{isLoading ? "Loading…" : "Not found."}</p>
      ) : (
        <>
          <div className="rounded-3xl bg-gradient-to-br from-[#03214F] to-[#0a3a7a] p-6 text-white">
            <h2 className="font-display text-2xl font-bold">{classTitle(cls)}</h2>
            {cls.description && (
              <p className="mt-2 text-sm text-white/70">{cls.description}</p>
            )}
            <p className="mt-3 text-sm text-white/80">
              Teacher: {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
            </p>
            {cls.schedule && (
              <p className="text-sm text-[#C4922B]">
                {cls.schedule.day} · {cls.schedule.time}
              </p>
            )}
            {cls.isActive === false && (
              <span className="mt-3 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                Inactive
              </span>
            )}
            {cls.meetingLink && (
              <a
                href={cls.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold"
              >
                <ExternalLink className="size-4" />
                Meeting link
              </a>
            )}
          </div>

          <Card className="flex flex-col gap-4 rounded-2xl border-0 p-5 shadow-sm">
            <span className="font-bold text-[#03214F]">Enrolled Students ({enrolled.length})</span>
            {enrolled.length === 0 ? (
              <p className="text-sm text-zinc-400">No students enrolled.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {enrolled.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#03214F]">{s.name}</p>
                      <p className="text-xs text-zinc-400">{s.email}</p>
                    </div>
                    <button
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
            <span className="flex items-center gap-2 text-sm font-bold text-[#03214F]">
              <UserPlus className="size-4" />
              Add Student
            </span>
            <div className="flex gap-2">
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
                className="rounded-xl bg-[#03214F] px-4 text-white"
              >
                Add
              </Button>
            </div>
          </Card>
        </>
      )}
    </PageContainer>
  );
}

