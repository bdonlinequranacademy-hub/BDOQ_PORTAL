import { useCallback } from "react";
import { sessionJoinApi } from "@/lib/api/sessionJoinApi";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import type { Role } from "@/types/models";

type JoinRole = "teacher" | "student";

export function useSessionJoin(role: JoinRole | Role) {
  const trackJoin = useCallback(
    async (slotId: string): Promise<void> => {
      try {
        if (role === "teacher") {
          await sessionJoinApi.recordTeacherJoin(slotId);
        } else if (role === "student") {
          await sessionJoinApi.recordStudentJoin(slotId);
        }
      } catch {
        /* join tracking is best-effort */
      }
    },
    [role]
  );

  const trackAndOpenMeeting = useCallback(
    (slotId: string, meetingLink?: string) => {
      void trackJoin(slotId);
      const href = normalizeMeetingLink(meetingLink);
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    },
    [trackJoin]
  );

  return { trackJoin, trackAndOpenMeeting };
}
