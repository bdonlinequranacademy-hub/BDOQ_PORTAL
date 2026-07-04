import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { WhatsAppLinkButton } from "@/components/whatsapp/WhatsAppLinkButton";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { studentCheckInMessage } from "@/lib/whatsappMessageTemplates";
import { useTeacherStudents } from "@/features/teacher/hooks/useTeacher";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { PageContainer } from "@/components/layout/PageContainer";
import { formControlClass } from "@/lib/formControl";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";

const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-green-100 text-green-700",
  "bg-rose-100 text-rose-700",
];

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function TeacherStudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: students = [], isLoading } = useTeacherStudents();

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const pagination = usePaginatedList(filtered, {
    resetDeps: [search],
  });

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-primary-dark text-2xl leading-8">Student Directory</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          {students.length} students in your classes
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <input
          className={`${formControlClass} pl-10`}
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <PageLoading label="Loading students…" />
      ) : (
        <>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pagination.paginatedItems.map((student, i) => {
            const wa = student.whatsapp
              ? waMeUrlFromRaw(
                  student.whatsapp,
                  student.country,
                  studentCheckInMessage(student.name)
                )
              : null;
            return (
            <div
              key={student._id}
              className="shadow-sm rounded-2xl bg-white border border-zinc-200 flex items-center gap-3 p-4"
            >
              <div
                className={`size-11 shrink-0 font-semibold rounded-full flex items-center justify-center ${avatarColor(i)}`}
              >
                {initials(student.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate font-semibold text-primary-dark">{student.name}</span>
                  <span className="shrink-0 font-medium rounded-full bg-emerald-100 text-emerald-700 text-[11px] px-2 py-0.5">
                    Active
                  </span>
                </div>
                <p className="text-zinc-400 text-xs mt-0.5">
                  {student.studentId ? `${student.studentId} · ` : ""}
                  {student.country ? (
                    <CountryLabel country={student.country} className="inline" />
                  ) : (
                    student.timezone || student.email
                  )}
                </p>
                {student.curriculumAssignments && student.curriculumAssignments.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {student.curriculumAssignments.map((a, idx) => (
                      <span
                        key={`${a.programId}-${a.unitId ?? ""}-${a.topicId ?? ""}-${idx}`}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          a.completed
                            ? "bg-emerald-100 text-emerald-700 line-through decoration-emerald-400/60"
                            : "bg-[#FDF3E0] text-[#9A6B1A]"
                        }`}
                      >
                        {formatCurriculumPath(a.curriculumLabels, a)}
                        {a.completed ? " ✓" : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] text-zinc-400">All programs (none assigned)</p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <WhatsAppLinkButton
                  href={wa}
                  label="WhatsApp"
                  size="sm"
                  disabledReason="Student has no WhatsApp on profile"
                />
                <button
                  type="button"
                  onClick={() => navigate(`/teacher/progress?studentId=${student._id}`)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-50 hover:text-primary-dark"
                  aria-label={`View progress for ${student.name}`}
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          );
          })}
        </div>
        <Pagination pagination={pagination} itemLabel="students" />
        </>
      )}
    </PageContainer>
  );
}
