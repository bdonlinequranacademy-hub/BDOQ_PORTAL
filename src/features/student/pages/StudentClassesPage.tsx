import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, Video } from "lucide-react";
import { useStudentClasses } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { BookOpen } from "lucide-react";
import { classTitle, teacherName } from "@/lib/utils/class";

export function StudentClassesPage() {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useStudentClasses();

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#03214F]">My Classes</h1>
        <p className="text-sm text-zinc-500">{classes.length} enrolled</p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-[#03214F]">Weekly schedule</h2>
        {isLoading ? (
          <PageLoading label="Loading schedule…" />
        ) : (
          <WeeklySchedule
            classes={classes}
            onClassClick={(id) => navigate(`/student/classes/${id}`)}
          />
        )}
      </div>

      {isLoading ? (
        <PageLoading />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No classes yet"
          description="Ask your admin to enroll you in a class."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => navigate(`/student/classes/${cls._id}`)}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-[#03214F]">{classTitle(cls)}</span>
                <ChevronRight className="size-4 text-zinc-300" />
              </div>
              <p className="text-xs text-zinc-400">
                {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
              </p>
              {cls.schedule && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar className="size-3.5" />
                  {cls.schedule.day} · {cls.schedule.time}
                </div>
              )}
              {cls.meetingLink && (
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex"
                >
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#2b7fff] px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Video className="size-3" />
                    Join
                  </a>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
