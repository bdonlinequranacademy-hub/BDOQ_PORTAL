import { Video, Clock } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { useSessionJoin } from "@/hooks/useSessionJoin";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface SessionSlotCardProps {
  session: SessionSlotView;
  showStudentMeta?: boolean;
  joinRole?: "teacher" | "student";
  onMarkAttendance?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
}

/** Compact card for dashboard / student views */
export function SessionSlotCard({
  session,
  showStudentMeta = true,
  joinRole,
  onMarkAttendance,
  onLogSession,
}: SessionSlotCardProps) {
  const { t } = usePortalTranslation();

  const { trackAndOpenMeeting } = useSessionJoin(joinRole ?? "student");
  const meetingHref = normalizeMeetingLink(session.meetingLink);

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-portal p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary">{session.times.academy.time} BD</p>
          {showStudentMeta ? (
            <>
              <p className="truncate font-semibold text-portal-heading">{session.student.name}</p>
              <CountryLabel country={session.student.country} className="text-xs" showFallback />
            </>
          ) : (
            <p className="font-semibold text-portal-heading">{session.classTitle}</p>
          )}
        </div>
        <SessionStatusBadge session={session} compact />
      </div>

      {(onLogSession || onMarkAttendance || meetingHref) && (
        <SessionActionButtons
          session={session}
          onLogSession={onLogSession}
          onMarkAttendance={onMarkAttendance}
          joinRole={joinRole}
          compact
        />
      )}

      <div className="flex items-center gap-1.5 text-xs text-portal-muted">
        <Clock className="size-3" />
        <span className="truncate">{session.classTitle}</span>
        {meetingHref ? (
          joinRole ? (
            <button
              type="button"
              onClick={() => trackAndOpenMeeting(session._id, meetingHref)}
              className="ml-auto inline-flex items-center gap-1 text-primary"
            >
              <Video className="size-3" />{t("shared.schedule.join")}</button>
          ) : (
            <a
              href={meetingHref}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-primary"
            >
              <Video className="size-3" />{t("shared.schedule.join")}</a>
          )
        ) : null}
      </div>
    </Card>
  );
}
