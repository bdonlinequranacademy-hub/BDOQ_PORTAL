import type { SessionSlotView } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { resolveDisplayPhase } from "@/lib/utils/sessionTiming";
import { useSessionClock } from "@/hooks/useSessionClock";

interface SessionTimelineRowProps {
  session: SessionSlotView;
  showDay?: boolean;
  routineView?: boolean;
  adminMode?: boolean;
  onViewClass?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
  onMarkAttendance?: (session: SessionSlotView) => void;
}

export function SessionTimelineRow({
  session,
  showDay = false,
  routineView = false,
  adminMode = false,
  onViewClass,
  onLogSession,
  onMarkAttendance,
}: SessionTimelineRowProps) {
  const now = useSessionClock();
  const phase = resolveDisplayPhase(session, now, { routineView });
  const isLive = phase === "live";

  return (
    <Card
      className={`overflow-hidden rounded-2xl border bg-white p-0 shadow-sm ${
        isLive ? "border-red-200 ring-1 ring-red-100" : "border-zinc-100"
      }`}
    >
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[112px_1fr_auto] lg:items-stretch">
        {/* Time column — light panel, not solid dark block */}
        <div
          className={`flex flex-row items-center gap-4 border-b px-4 py-4 lg:flex-col lg:justify-center lg:gap-2 lg:border-b-0 lg:border-r lg:px-3 ${
            isLive
              ? "border-red-100 bg-red-50/60 lg:bg-red-50/40"
              : "border-zinc-100 bg-[#F8FAFF]"
          }`}
        >
          <div className="min-w-[72px] text-center">
            <p
              className={`text-lg font-bold leading-tight ${
                isLive ? "text-red-600" : "text-[#2b7fff]"
              }`}
            >
              {session.times.academy.time}
            </p>
            <p className="text-[10px] font-semibold uppercase text-zinc-400">BD</p>
          </div>
          <div className="hidden h-8 w-px bg-zinc-200 lg:block" />
          <div className="min-w-[72px] text-center lg:mt-0">
            <p className="text-sm font-semibold text-[#03214F]">{session.times.student.time}</p>
            <p className="text-[10px] text-zinc-400">Student</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-3 px-4 py-4 lg:px-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {showDay ? (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-600">
                    {session.day}
                  </span>
                ) : null}
                <span className="rounded-full bg-[#03214F]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#03214F]">
                  {session.courseType}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  {session.durationLabel.toUpperCase()}
                </span>
              </div>
              <p className="mt-1.5 truncate text-base font-bold text-[#03214F]">
                {session.classTitle}
              </p>
              {adminMode ? (
                <div className="mt-2 space-y-1 text-xs text-zinc-600">
                  <p>
                    <span className="font-semibold text-zinc-500">Student: </span>
                    {session.student.name}
                    {session.student.studentId ? ` · ${session.student.studentId}` : ""}
                    {" · "}
                    <CountryLabel country={session.student.country} showFallback />
                  </p>
                  <p>
                    <span className="font-semibold text-zinc-500">Teacher: </span>
                    {session.teacher.name}
                    {" · "}
                    <CountryLabel country={session.teacher.country} className="inline" showFallback />
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-1.5 truncate text-base font-bold text-[#03214F]">
                    {session.student.name}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {session.student.studentId ? `${session.student.studentId} · ` : ""}
                    <CountryLabel country={session.student.country} showFallback />
                    <span className="mx-1.5 text-zinc-300">|</span>
                    Tea {session.times.teacher.time}
                    {" · "}
                    <CountryLabel country={session.teacher.country} className="inline" showFallback />
                  </p>
                </>
              )}
              {!adminMode ? (
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-400">
                  <span>{session.classTitle}</span>
                </p>
              ) : null}
              {adminMode ? (
                <p className="mt-1 text-xs text-zinc-400">
                  Stu {session.times.student.time} · Tea {session.times.teacher.time}
                </p>
              ) : null}
            </div>
            <SessionStatusBadge session={session} routineView={routineView} />
          </div>

          {adminMode && onViewClass ? (
            <button
              type="button"
              onClick={() => onViewClass(session)}
              className="w-fit rounded-lg bg-[#FDF3E0] px-4 py-2 text-xs font-semibold text-[#9A6B1A] hover:bg-[#F5E6C8]"
            >
              View class →
            </button>
          ) : (
            <SessionActionButtons
              session={session}
              onLogSession={onLogSession}
              onMarkAttendance={onMarkAttendance}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
