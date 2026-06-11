import { useState } from "react";
import type { SessionSlotView } from "@/types/models";
import { useCreateClassLog } from "@/features/teacher/hooks/useTeacher";

export function useLogSessionFlow() {
  const [session, setSession] = useState<SessionSlotView | null>(null);
  const createLog = useCreateClassLog();

  return {
    logSession: session,
    logSheetOpen: Boolean(session),
    openLogSession: setSession,
    closeLogSession: () => setSession(null),
    submitLogSession: createLog.mutateAsync,
    isSubmittingLog: createLog.isPending,
  };
}
