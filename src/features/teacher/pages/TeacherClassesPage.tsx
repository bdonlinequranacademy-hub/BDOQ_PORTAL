import { useNavigate } from "react-router-dom";
import { Users, Calendar, ChevronRight, BookOpen } from "lucide-react";
import { useTeacherClasses } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeeklySchedule, toScheduleClassItem } from "@/components/schedule/WeeklySchedule";
import { CountryLabel } from "@/components/ui/CountryLabel";

export function TeacherClassesPage() {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useTeacherClasses();

  return (
    <PageContainer className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold leading-8 text-portal-heading">My Classes</h1>
        <p className="mt-0.5 text-sm text-portal-muted">
          {classes.length} class{classes.length !== 1 ? "es" : ""} assigned
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-portal-heading">Weekly schedule</h2>
        {isLoading ? (
          <PageLoading label="Loading schedule…" />
        ) : (
          <WeeklySchedule
            classes={classes.map((c) =>
              toScheduleClassItem({ _id: c._id, name: c.name, schedule: c.schedule as never })
            )}
            onClassClick={(id) => navigate(`/teacher/classes/${id}`)}
          />
        )}
      </div>

      {isLoading ? (
        <PageLoading />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No classes assigned"
          description="An admin will assign classes to your account."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => navigate(`/teacher/classes/${cls._id}`)}
              className="shadow-[0_6px_18px_-12px_rgba(3,33,79,0.18)] rounded-3xl bg-white text-left flex flex-col gap-3 p-5 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#03214F] text-base leading-6">{cls.name}</span>
                  {cls.subject && (
                    <span className="text-zinc-400 text-xs">{cls.subject}</span>
                  )}
                </div>
                <ChevronRight className="size-5 text-zinc-300 shrink-0 mt-0.5" />
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Users className="size-3.5" />
                    <span>{cls.studentIds?.length ?? 0} students</span>
                  </div>
                  {cls.schedule?.[0] && (
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <Calendar className="size-3.5" />
                      <span>
                        {cls.schedule[0].day} · {cls.schedule[0].time}
                      </span>
                    </div>
                  )}
                </div>
                {cls.students && cls.students.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {cls.students.map((student) => (
                      <div
                        key={student._id}
                        className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs"
                      >
                        <span className="font-medium text-[#03214F]">{student.name}</span>
                        {student.studentId ? (
                          <span className="text-zinc-400">{student.studentId}</span>
                        ) : null}
                        <CountryLabel
                          country={student.country}
                          className="text-zinc-500"
                          showFallback={!student.country}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Attend CTA */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/teacher/attendance?classId=${cls._id}`);
                  }}
                  className="rounded-xl bg-[#03214F]/8 text-[#03214F] text-xs font-semibold px-3 py-2"
                >
                  Mark Attendance
                </button>
                {cls.meetingLink && (
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-xl bg-[#2b7fff] text-white text-xs font-semibold px-3 py-2"
                  >
                    Join Class
                  </a>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
