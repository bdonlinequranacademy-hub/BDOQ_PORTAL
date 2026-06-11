import { Video, Clock } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";

interface SessionSlotCardProps {
  session: SessionSlotView;
  showStudentMeta?: boolean;
  onMarkAttendance?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
}

/** Compact card for dashboard / student views */
export function SessionSlotCard({
  session,
  showStudentMeta = true,
  onMarkAttendance,
  onLogSession,
}: SessionSlotCardProps) {
  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#2b7fff]">{session.times.academy.time} BD</p>
          {showStudentMeta ? (
            <>
              <p className="truncate font-semibold text-[#03214F]">{session.student.name}</p>
              <CountryLabel country={session.student.country} className="text-xs" showFallback />
            </>
          ) : (
            <p className="font-semibold text-[#03214F]">{session.classTitle}</p>
          )}
        </div>
        <SessionStatusBadge session={session} compact />
      </div>

      {(onLogSession || onMarkAttendance || session.meetingLink) && (
        <SessionActionButtons
          session={session}
          onLogSession={onLogSession}
          onMarkAttendance={onMarkAttendance}
          compact
        />
      )}

      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Clock className="size-3" />
        <span className="truncate">{session.classTitle}</span>
        {session.meetingLink ? (
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-[#2b7fff]"
          >
            <Video className="size-3" />
            Join
          </a>
        ) : null}
      </div>
    </Card>
  );
}
