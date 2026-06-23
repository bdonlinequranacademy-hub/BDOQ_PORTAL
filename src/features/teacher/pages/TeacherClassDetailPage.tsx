import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { useTeacherClass } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClassHero } from "@/components/classes/ClassHero";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { buildClassroomRoomName } from "@/lib/utils/classroomRoom";
import { formatDuration } from "@/lib/utils/class";
import { PageLoading } from "@/components/ui/PageLoading";

export function TeacherClassDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: cls, isLoading } = useTeacherClass(id);

  const schedule = cls?.schedule?.[0];

  return (
    <PageContainer className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/teacher/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-navy"
          aria-label="Back to classes"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-xl font-bold text-navy">Class details</h1>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !cls ? (
        <p className="text-sm text-zinc-400">Class not found.</p>
      ) : (
        <>
          <ClassHero
            title={cls.name}
            description={cls.description ?? cls.subject}
            schedule={cls.schedule}
            meetingLink={cls.meetingLink}
            classroomHref={`/teacher/whiteboard?room=${encodeURIComponent(buildClassroomRoomName(cls._id))}`}
            badge={
              cls.level ? (
                <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  {cls.level}
                </span>
              ) : undefined
            }
            meta={
              <p className="text-sm text-white/80">
                {cls.studentIds?.length ?? cls.students?.length ?? 0} students
                {schedule?.duration ? ` · ${formatDuration(schedule.duration)} per session` : ""}
              </p>
            }
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate(`/teacher/attendance?classId=${cls._id}`)}
              className="flex-1 rounded-xl bg-navy py-2.5 text-sm text-white"
            >
              Mark attendance
            </Button>
            <Button
              onClick={() => navigate(`/teacher/homework?classId=${cls._id}&new=1`)}
              variant="ghost"
              className="flex-1 rounded-xl border border-gold py-2.5 text-sm text-gold-dark"
            >
              Assign homework
            </Button>
          </div>

          <Card className="rounded-2xl border-0 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users className="size-4 text-navy" />
              <span className="font-bold text-navy">
                Students ({cls.students?.length ?? cls.studentIds?.length ?? 0})
              </span>
            </div>
            {!cls.students?.length ? (
              <p className="text-sm text-zinc-400">No students enrolled in this class.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {cls.students.map((student) => (
                  <div
                    key={student._id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-navy">{student.name}</p>
                      {student.studentId ? (
                        <p className="text-xs text-zinc-400">{student.studentId}</p>
                      ) : null}
                    </div>
                    <CountryLabel country={student.country} className="text-sm text-zinc-500" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  );
}
