import { useCallback, useRef, useState } from "react";
import type IJitsiMeetExternalApi from "@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi";
import type { ClassroomVideoRole, ClassroomVideoState } from "@/types/classroom.types";

interface UseJitsiOptions {
  role: ClassroomVideoRole;
}

export function useJitsi({ role }: UseJitsiOptions) {
  const apiRef = useRef<IJitsiMeetExternalApi | null>(null);
  const [state, setState] = useState<ClassroomVideoState>({
    isApiReady: false,
    isJoined: false,
    participantCount: 0,
    isAudioMuted: role === "student",
    isVideoMuted: false,
    isSharingScreen: false,
  });

  const refreshParticipants = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    setState((prev) => ({
      ...prev,
      participantCount: api.getNumberOfParticipants(),
    }));
  }, []);

  const onApiReady = useCallback(
    (api: IJitsiMeetExternalApi) => {
      apiRef.current = api;
      setState((prev) => ({ ...prev, isApiReady: true }));

      api.addEventListener("videoConferenceJoined", () => {
        setState((prev) => ({ ...prev, isJoined: true }));
        refreshParticipants();
      });

      api.addEventListener("videoConferenceLeft", () => {
        setState((prev) => ({
          ...prev,
          isJoined: false,
          participantCount: 0,
          isSharingScreen: false,
        }));
      });

      api.addEventListener("participantJoined", refreshParticipants);
      api.addEventListener("participantLeft", refreshParticipants);

      const apiWithEvents = api as IJitsiMeetExternalApi & {
        addListener: (event: string, fn: (...args: unknown[]) => void) => void;
      };

      apiWithEvents.addListener("audioMuteStatusChanged", (payload: unknown) => {
        const p = payload as { muted?: boolean };
        if (typeof p?.muted === "boolean") {
          setState((prev) => ({ ...prev, isAudioMuted: p.muted! }));
        }
      });

      apiWithEvents.addListener("videoMuteStatusChanged", (payload: unknown) => {
        const p = payload as { muted?: boolean };
        if (typeof p?.muted === "boolean") {
          setState((prev) => ({ ...prev, isVideoMuted: p.muted! }));
        }
      });

      apiWithEvents.addListener("screenSharingStatusChanged", (payload: unknown) => {
        const p = payload as { on?: boolean };
        if (typeof p?.on === "boolean") {
          setState((prev) => ({ ...prev, isSharingScreen: p.on! }));
        }
      });
    },
    [refreshParticipants]
  );

  const runCommand = useCallback((command: string, ...args: unknown[]) => {
    apiRef.current?.executeCommand(command, ...args);
  }, []);

  const toggleAudio = useCallback(() => runCommand("toggleAudio"), [runCommand]);
  const toggleVideo = useCallback(() => runCommand("toggleVideo"), [runCommand]);
  const toggleScreenShare = useCallback(() => runCommand("toggleShareScreen"), [runCommand]);
  const hangUp = useCallback(() => runCommand("hangup"), [runCommand]);
  const muteEveryone = useCallback(() => runCommand("muteEveryone"), [runCommand]);

  const removeParticipant = useCallback(
    (participantId: string) => runCommand("kickParticipant", participantId),
    [runCommand]
  );

  return {
    apiRef,
    state,
    onApiReady,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    hangUp,
    muteEveryone,
    removeParticipant,
    isTeacher: role === "teacher",
  };
}
