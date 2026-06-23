import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { getRealtimeSocket } from "@/lib/realtime/socket";
import type {
  ClassroomParticipant,
  ClassroomSessionSnapshot,
  RemoteWhiteboardSnapshot,
} from "@/types/classroom.types";

interface UseClassroomSocketOptions {
  sessionId: string;
  displayName: string;
  userId?: string;
  enabled?: boolean;
}

export function useClassroomSocket({
  sessionId,
  displayName,
  userId,
  enabled = true,
}: UseClassroomSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [session, setSession] = useState<ClassroomSessionSnapshot | null>(null);
  const [remoteWhiteboard, setRemoteWhiteboard] = useState<RemoteWhiteboardSnapshot | null>(
    null
  );
  const [clearSignal, setClearSignal] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    let cancelled = false;
    let socket: Socket | null = null;

    const setup = async () => {
      socket = await getRealtimeSocket();
      if (!socket || cancelled) return;

      socketRef.current = socket;
      setConnected(socket.connected);

      const onConnect = () => setConnected(true);
      const onDisconnect = () => setConnected(false);

      const onState = (state: ClassroomSessionSnapshot) => {
        if (state.sessionId !== sessionId) return;
        setSession(state);
        if (state.whiteboardJson) {
          setRemoteWhiteboard({ version: Date.now(), json: state.whiteboardJson });
        }
      };

      const onSync = (payload: {
        sessionId: string;
        json: Record<string, unknown>;
        fromUserId: string;
      }) => {
        if (payload.sessionId !== sessionId || payload.fromUserId === userId) return;
        setRemoteWhiteboard({ version: Date.now(), json: payload.json });
      };

      const onClear = (payload: { sessionId: string }) => {
        if (payload.sessionId !== sessionId) return;
        setClearSignal((n) => n + 1);
      };

      const onLock = (payload: { sessionId: string; locked: boolean }) => {
        if (payload.sessionId !== sessionId) return;
        setSession((prev) =>
          prev ? { ...prev, whiteboardLocked: payload.locked } : prev
        );
      };

      const onParticipantChange = (payload: {
        sessionId: string;
        participants: ClassroomParticipant[];
      }) => {
        if (payload.sessionId !== sessionId) return;
        setSession((prev) =>
          prev
            ? {
                ...prev,
                participants: payload.participants,
                participantCount: payload.participants.length,
              }
            : prev
        );
      };

      const onHand = (payload: {
        sessionId: string;
        participants: ClassroomParticipant[];
      }) => {
        if (payload.sessionId !== sessionId) return;
        setSession((prev) =>
          prev
            ? {
                ...prev,
                participants: payload.participants,
                participantCount: payload.participants.length,
              }
            : prev
        );
      };

      const onNotify = (payload: { sessionId: string; message: string }) => {
        if (payload.sessionId !== sessionId) return;
        setNotification(payload.message);
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("classroom:state", onState);
      socket.on("whiteboard:sync", onSync);
      socket.on("whiteboard:clear", onClear);
      socket.on("classroom:lock", onLock);
      socket.on("classroom:participant:joined", onParticipantChange);
      socket.on("classroom:participant:left", onParticipantChange);
      socket.on("classroom:hand", onHand);
      socket.on("classroom:notify", onNotify);

      socket.emit("classroom:join", { sessionId, displayName }, (res: { ok?: boolean; state?: ClassroomSessionSnapshot }) => {
        if (res?.state) onState(res.state);
      });

      return () => {
        socket?.off("connect", onConnect);
        socket?.off("disconnect", onDisconnect);
        socket?.off("classroom:state", onState);
        socket?.off("whiteboard:sync", onSync);
        socket?.off("whiteboard:clear", onClear);
        socket?.off("classroom:lock", onLock);
        socket?.off("classroom:participant:joined", onParticipantChange);
        socket?.off("classroom:participant:left", onParticipantChange);
        socket?.off("classroom:hand", onHand);
        socket?.off("classroom:notify", onNotify);
        socket?.emit("classroom:leave", { sessionId });
      };
    };

    let cleanup: (() => void) | undefined;
    void setup().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cleanup?.();
      socketRef.current = null;
      setConnected(false);
    };
  }, [sessionId, displayName, userId, enabled]);

  const emit = (event: string, payload?: unknown, ack?: (res: unknown) => void) => {
    if (!socketRef.current) return;
    if (ack) {
      socketRef.current.emit(event, payload, ack);
    } else {
      socketRef.current.emit(event, payload);
    }
  };

  return {
    connected,
    session,
    remoteWhiteboard,
    clearSignal,
    notification,
    clearNotification: () => setNotification(null),
    emit,
  };
}
