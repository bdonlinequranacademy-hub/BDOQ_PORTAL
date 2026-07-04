import { Video, ClipboardList, User } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import { Button } from "@/components/ui/Button";
import { useSessionJoin } from "@/hooks/useSessionJoin";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";

interface SessionActionButtonsProps {
  session: SessionSlotView;
  onLogSession?: (session: SessionSlotView) => void;
  onMarkAttendance?: (session: SessionSlotView) => void;
  compact?: boolean;
  /** When set, Launch records join tracking before opening the meeting link. */
  joinRole?: "teacher" | "student";
}

export function SessionActionButtons({
  session,
  onLogSession,
  onMarkAttendance,
  compact = false,
  joinRole,
}: SessionActionButtonsProps) {
  const { trackAndOpenMeeting } = useSessionJoin(joinRole ?? "student");
  const meetingHref = normalizeMeetingLink(session.meetingLink);

  return (
    <div
      className={`flex ${compact ? "flex-row flex-wrap justify-end gap-1.5" : "flex-col gap-2 sm:flex-row"}`}
    >
      {meetingHref ? (
        joinRole ? (
          <button
            type="button"
            onClick={() => trackAndOpenMeeting(session._id, meetingHref)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2b7fff] font-semibold text-white hover:bg-[#1a6fe8] ${
              compact ? "px-3 py-1.5 text-xs" : "flex-1 px-3 py-2 text-sm"
            }`}
          >
            <Video className="size-3.5" />
            Launch
          </button>
        ) : (
          <a
            href={meetingHref}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2b7fff] font-semibold text-white hover:bg-[#1a6fe8] ${
              compact ? "px-3 py-1.5 text-xs" : "flex-1 px-3 py-2 text-sm"
            }`}
          >
            <Video className="size-3.5" />
            Launch
          </a>
        )
      ) : null}
      {onLogSession ? (
        <Button
          type="button"
          onClick={() => onLogSession(session)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 ${
            compact ? "px-3 py-1.5 text-xs" : "flex-1 px-3 py-2 text-sm"
          }`}
        >
          <ClipboardList className="size-3.5" />
          Log
        </Button>
      ) : null}
      {onMarkAttendance ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() => onMarkAttendance(session)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg ${
            compact ? "px-3 py-1.5 text-xs" : "flex-1 px-3 py-2 text-sm"
          }`}
        >
          <User className="size-3.5" />
          Attendance
        </Button>
      ) : null}
    </div>
  );
}
