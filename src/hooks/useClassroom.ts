import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/uiStore";
import { useClassroomSocket } from "@/hooks/useClassroomSocket";
import type { Role } from "@/types/models";

interface UseClassroomOptions {
  sessionId: string;
  observeOnly?: boolean;
}

function isTeacherRole(role: Role | undefined): boolean {
  return role === "teacher";
}

export function useClassroom({ sessionId, observeOnly = false }: UseClassroomOptions) {
  const user = useAuthStore((s) => s.user);
  const userId = user?._id ?? user?.id;
  const isTeacher = isTeacherRole(user?.role) && !observeOnly;
  const isStudent = user?.role === "student";

  const {
    connected,
    session,
    remoteWhiteboard,
    clearSignal,
    notification,
    clearNotification,
    emit,
  } = useClassroomSocket({
    sessionId,
    displayName: user?.name ?? "User",
    userId,
  });

  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notification) return;
    toast.success(notification);
    clearNotification();
  }, [notification, clearNotification]);

  const readOnly = useMemo(() => {
    if (observeOnly) return true;
    if (isTeacher) return false;
    return Boolean(session?.whiteboardLocked);
  }, [observeOnly, isTeacher, session?.whiteboardLocked]);

  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;

  const handRaised = useMemo(() => {
    if (!userId || !session) return false;
    return session.participants.find((p) => p.userId === userId)?.handRaised ?? false;
  }, [session, userId]);

  const raisedHands = useMemo(
    () => session?.participants.filter((p) => p.handRaised && p.role === "student") ?? [],
    [session?.participants]
  );

  const handleLocalWhiteboardChange = useCallback(
    (json: Record<string, unknown>) => {
      if (readOnlyRef.current) return;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        emit("whiteboard:update", { sessionId, json });
      }, 800);
    },
    [emit, sessionId]
  );

  const startClass = useCallback(() => {
    emit("classroom:start", { sessionId }, (res: unknown) => {
      if ((res as { ok?: boolean })?.ok) toast.success("Class started");
    });
  }, [emit, sessionId]);

  const endClass = useCallback(() => {
    emit("classroom:end", { sessionId }, (res: unknown) => {
      if ((res as { ok?: boolean })?.ok) toast.success("Class ended");
    });
  }, [emit, sessionId]);

  const toggleLock = useCallback(() => {
    const next = !session?.whiteboardLocked;
    emit("classroom:lock", { sessionId, locked: next }, (res: unknown) => {
      if ((res as { ok?: boolean })?.ok) {
        toast.success(next ? "Student board locked" : "Student board unlocked");
      }
    });
  }, [emit, session?.whiteboardLocked, sessionId]);

  const clearRemoteWhiteboard = useCallback(() => {
    emit("classroom:clear", { sessionId }, (res: unknown) => {
      if ((res as { ok?: boolean })?.ok) toast.success("Whiteboard cleared for everyone");
    });
  }, [emit, sessionId]);

  const toggleHand = useCallback(() => {
    emit("classroom:hand", { sessionId, raised: !handRaised });
  }, [emit, handRaised, sessionId]);

  const sendNotification = useCallback(
    (message: string, targetUserId?: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;
      emit("classroom:notify", { sessionId, message: trimmed, targetUserId });
      toast.success("Message sent");
    },
    [emit, sessionId]
  );

  return {
    connected,
    session,
    isTeacher,
    isStudent,
    readOnly,
    remoteWhiteboard,
    clearSignal,
    handRaised,
    raisedHands,
    handleLocalWhiteboardChange,
    startClass,
    endClass,
    toggleLock,
    clearRemoteWhiteboard,
    toggleHand,
    sendNotification,
  };
}
