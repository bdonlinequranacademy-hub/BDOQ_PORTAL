import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ExternalLink, Video, ClipboardList, BookOpenCheck } from "lucide-react";
import { useStudentClass } from "@/features/student/hooks/useStudent";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { classTitle, teacherName } from "@/lib/utils/class";

import { PageLoading } from "@/components/ui/PageLoading";
export function StudentClassDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: cls, isLoading } = useStudentClass(id);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/student/classes")}
          className="flex size-9 items-center justify-center rounded-full bg-zinc-100"
          aria-label="Back to classes"
        >
          <ArrowLeft className="size-5 text-[#03214F]" />
        </button>
        <h1 className="font-display text-xl font-bold text-[#03214F]">Class Detail</h1>
      </div>

      {isLoading ? (
        <PageLoading compact />
      ) : !cls ? (
        <p className="text-sm text-zinc-400">Not found.</p>
      ) : (
        <>
          <div className="rounded-3xl bg-gradient-to-br from-[#03214F] to-[#0a3a7a] p-6 text-white">
            <h2 className="font-display text-2xl font-bold">{classTitle(cls)}</h2>
            {cls.description && (
              <p className="mt-2 text-sm text-white/70">{cls.description}</p>
            )}
            <p className="mt-3 text-sm">
              Teacher: {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
            </p>
            {cls.schedule && (
              <div className="mt-2 flex items-center gap-2 text-sm text-[#C4922B]">
                <Calendar className="size-4" />
                {cls.schedule.day} · {cls.schedule.time}
              </div>
            )}
            {cls.meetingLink && (
              <a
                href={cls.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold"
              >
                <Video className="size-4" />
                Join Class
                <ExternalLink className="size-3.5 opacity-70" />
              </a>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => navigate("/student/homework")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#03214F] py-2.5 text-sm text-white"
            >
              <BookOpenCheck className="size-4" />
              View Homework
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/student/attendance")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C4922B] py-2.5 text-sm text-[#C4922B]"
            >
              <ClipboardList className="size-4" />
              My Attendance
            </Button>
          </div>

          <Card className="rounded-2xl border-0 p-5 shadow-sm">
            <p className="text-sm leading-relaxed text-zinc-600">
              Attend live sessions on time and submit homework before the due date. Your
              teacher updates progress and monthly reports on the Progress page.
            </p>
          </Card>
        </>
      )}
    </PageContainer>
  );
}

