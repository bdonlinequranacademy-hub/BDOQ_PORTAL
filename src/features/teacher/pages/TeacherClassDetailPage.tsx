import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Video, ExternalLink } from "lucide-react";
import { useTeacherClass } from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function TeacherClassDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: cls, isLoading } = useTeacherClass(id);

  return (
    <PageContainer className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/teacher/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-[#03214F]"
          aria-label="Back to classes"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-[#03214F]">Class Detail</h1>
      </div>

      {isLoading || !cls ? (
        <p className="text-sm text-zinc-400 p-2">
          {isLoading ? "Loading…" : "Class not found."}
        </p>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#03214F] to-[#0a3a7a] p-6 text-white">
            <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/10" />
            <div className="relative flex flex-col gap-3">
              <h2 className="text-xl font-bold leading-7">{cls.name}</h2>
              {cls.subject && <span className="text-sm text-white/70">{cls.subject}</span>}
              {cls.level && (
                <span className="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  {cls.level}
                </span>
              )}
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-white/70">
                  <Users className="size-4" />
                  <span>{cls.studentIds?.length ?? 0} students</span>
                </div>
              </div>
            </div>
          </div>

          {cls.schedule?.length > 0 && (
            <Card className="flex flex-col gap-3 rounded-2xl border-0 p-5 shadow-sm">
              <span className="text-sm font-bold text-[#03214F]">Schedule</span>
              {cls.schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#2b7fff]/10">
                    <Calendar className="size-4 text-[#2b7fff]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#03214F]">{s.day}</span>
                    <span className="text-xs text-zinc-400">{s.time}</span>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {cls.meetingLink && (
            <a
              href={cls.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2b7fff] font-semibold text-white"
            >
              <Video className="size-4" />
              Join Class Meeting
              <ExternalLink className="size-3.5 opacity-70" />
            </a>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/teacher/attendance?classId=${cls._id}`)}
              className="flex-1 rounded-xl bg-[#03214F] py-2.5 text-sm text-white"
            >
              Mark Attendance
            </Button>
            <Button
              onClick={() => navigate(`/teacher/homework?classId=${cls._id}&new=1`)}
              variant="ghost"
              className="flex-1 rounded-xl border border-[#C4922B] py-2.5 text-sm text-[#C4922B]"
            >
              Assign Homework
            </Button>
          </div>

          {cls.description && (
            <Card className="rounded-2xl border-0 p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-zinc-500">{cls.description}</p>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  );
}

