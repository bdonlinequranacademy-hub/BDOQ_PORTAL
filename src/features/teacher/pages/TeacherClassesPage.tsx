import { useNavigate } from "react-router-dom";
import { ClipboardList, BookOpen } from "lucide-react";
import { useTeacherClasses } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClassCard } from "@/components/classes/ClassCard";
import { TodayClassesBanner } from "@/components/classes/TodayClassesBanner";
import { WeeklySchedule, toScheduleClassItem } from "@/components/schedule/WeeklySchedule";
import { classesScheduledToday } from "@/lib/utils/class";
import { CountryLabel } from "@/components/ui/CountryLabel";

export function TeacherClassesPage() {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useTeacherClasses();
  const todayClasses = classesScheduledToday(classes);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">My classes</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          {classes.length} class{classes.length !== 1 ? "es" : ""} · schedules, students, and quick actions
        </p>
      </div>

      {!isLoading && todayClasses.length > 0 ? (
        <TodayClassesBanner
          classes={todayClasses.map((c) => ({
            _id: c._id,
            name: c.name,
            schedule: c.schedule,
          }))}
          onClassClick={(id) => navigate(`/teacher/classes/${id}`)}
        />
      ) : null}

      <section>
        <h2 className="mb-3 font-semibold text-navy">Weekly schedule</h2>
        {isLoading ? (
          <PageLoading label="Loading schedule…" />
        ) : (
          <WeeklySchedule
            classes={classes.map((c) =>
              toScheduleClassItem({
                _id: c._id,
                name: c.name,
                schedule: c.schedule as never,
              })
            )}
            onClassClick={(id) => navigate(`/teacher/classes/${id}`)}
          />
        )}
      </section>

      {isLoading ? (
        <PageLoading label="Loading classes…" />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No classes assigned"
          description="An admin will assign classes to your account. You will see schedules and student lists here."
        />
      ) : (
        <section>
          <h2 className="mb-3 font-semibold text-navy">All classes</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((cls) => (
              <ClassCard
                key={cls._id}
                title={cls.name}
                subtitle={cls.description ?? cls.subject}
                schedule={cls.schedule}
                studentCount={cls.studentIds?.length ?? cls.students?.length ?? 0}
                meetingLink={cls.meetingLink}
                onClick={() => navigate(`/teacher/classes/${cls._id}`)}
                footer={
                  cls.students && cls.students.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {cls.students.slice(0, 3).map((student) => (
                        <div
                          key={student._id}
                          className="flex flex-wrap items-center gap-x-2 text-xs text-zinc-600"
                        >
                          <span className="font-medium text-navy">{student.name}</span>
                          {student.studentId ? (
                            <span className="text-zinc-400">{student.studentId}</span>
                          ) : null}
                          <CountryLabel country={student.country} className="text-zinc-500" showFallback={false} />
                        </div>
                      ))}
                      {cls.students.length > 3 ? (
                        <span className="text-xs text-zinc-400">
                          +{cls.students.length - 3} more students
                        </span>
                      ) : null}
                    </div>
                  ) : null
                }
                actions={
                  <button
                    type="button"
                    onClick={() => navigate(`/teacher/attendance?classId=${cls._id}`)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-navy/8 px-3 py-2 text-xs font-semibold text-navy transition hover:bg-navy/12"
                  >
                    <ClipboardList className="size-3.5" />
                    Attendance
                  </button>
                }
              />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
