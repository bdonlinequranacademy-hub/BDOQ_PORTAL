import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Banknote,
  Clock,
  Users,
  ExternalLink,
  Settings2,
} from "lucide-react";
import {
  useAdminClass,
  useAdminUsers,
  useAssignStudent,
  useRemoveStudent,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { ClassHero } from "@/components/classes/ClassHero";
import { ClassEnrollmentPanel } from "@/components/classes/ClassEnrollmentPanel";
import { classTitle, formatDuration, studentCount, studentList, teacherName } from "@/lib/utils/class";
import { PageLoading } from "@/components/ui/PageLoading";

export function AdminClassDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: cls, isLoading } = useAdminClass(id);
  const { data: allStudents = [] } = useAdminUsers("student");
  const assignStudent = useAssignStudent(id);
  const removeStudent = useRemoveStudent(id);

  const enrolled = cls ? studentList(cls.students) : [];
  const enrolledIds = new Set(enrolled.map((s) => String(s._id)));
  const available = allStudents.filter((s) => !enrolledIds.has(String(s.id)));

  async function handleAssign(studentId: string) {
    await assignStudent.mutateAsync(studentId);
  }

  function handleRemove(studentId: string, name: string) {
    if (!window.confirm(`Remove ${name} from this class?`)) return;
    removeStudent.mutate(studentId);
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200"
          aria-label="Back to classes"
        >
          <ArrowLeft className="size-5 text-navy" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Class</p>
          <h1 className="truncate font-display text-xl font-bold text-navy">
            {cls ? classTitle(cls) : "Class details"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/admin/classes/${id}/edit`)}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200"
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
            badge={
              cls.isActive === false ? (
                <span className="w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                  Inactive
                </span>
              ) : undefined
            }
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-500">
                <Users className="size-4" />
                <span className="text-xs font-medium">Enrolled</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-navy">{studentCount(cls)}</p>
            </div>
            {cls.sessionRateBdt != null ? (
              <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Banknote className="size-4" />
                  <span className="text-xs font-medium">Session rate</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-navy">{cls.sessionRateBdt}</p>
                <p className="text-[10px] text-zinc-400">BDT per session</p>
              </div>
            ) : null}
            {cls.schedule?.duration ? (
              <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Clock className="size-4" />
                  <span className="text-xs font-medium">Duration</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-navy">
                  {formatDuration(cls.schedule.duration)}
                </p>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => navigate(`/admin/classes/${id}/edit`)}
              className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-4 text-left transition hover:border-gold/60 hover:bg-gold/10"
            >
              <Settings2 className="size-4 text-gold-dark" />
              <span className="mt-2 text-sm font-semibold text-navy">Edit settings</span>
              <span className="text-[10px] text-zinc-500">Schedule, teacher, link</span>
            </button>
          </div>

          {cls.meetingLink ? (
            <a
              href={cls.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#2b7fff]/20 bg-[#2b7fff]/5 px-4 py-3 text-sm font-semibold text-[#2b7fff] transition hover:bg-[#2b7fff]/10"
            >
              <ExternalLink className="size-4" />
              Open meeting link
            </a>
          ) : null}

          <ClassEnrollmentPanel
            enrolled={enrolled}
            available={available}
            allStudents={allStudents}
            onAdd={handleAssign}
            onRemove={handleRemove}
            adding={assignStudent.isPending}
          />
        </>
      )}
    </PageContainer>
  );
}
