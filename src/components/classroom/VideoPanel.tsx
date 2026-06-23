import { lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import {
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Users,
  Video,
  VideoOff,
  VolumeX,
} from "lucide-react";
import { env } from "@/config/env";
import { useJitsi } from "@/hooks/useJitsi";
import { PageLoading } from "@/components/ui/PageLoading";
import { Button } from "@/components/ui/Button";
import type { ClassroomVideoRole } from "@/types/classroom.types";

const JitsiMeeting = lazy(() =>
  import("@jitsi/react-sdk").then((mod) => ({ default: mod.JitsiMeeting }))
);

interface VideoPanelProps {
  roomName: string;
  displayName: string;
  email?: string;
  role: ClassroomVideoRole;
  className?: string;
}

function VideoControlButton({
  active,
  label,
  onClick,
  children,
  variant = "default",
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger" | "gold";
}) {
  const styles = {
    default: active
      ? "bg-white/20 text-white"
      : "bg-white/10 text-white hover:bg-white/20",
    danger: "bg-danger text-white hover:bg-red-700",
    gold: "bg-gold text-white hover:bg-gold-dark",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex size-9 items-center justify-center rounded-lg transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function VideoPanel({
  roomName,
  displayName,
  email = "",
  role,
  className = "",
}: VideoPanelProps) {
  const [videoActive, setVideoActive] = useState(false);
  const {
    state,
    onApiReady,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    hangUp,
    muteEveryone,
    isTeacher,
  } = useJitsi({ role });

  const jitsiConfig = useMemo(
    () => ({
      startWithAudioMuted: role === "student",
      startWithVideoMuted: false,
      prejoinPageEnabled: false,
      enableWelcomePage: false,
      disableDeepLinking: true,
      hideConferenceSubject: true,
      subject: "Al Bayaan Class",
    }),
    [role]
  );

  const jitsiInterface = useMemo(
    () => ({
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      MOBILE_APP_PROMO: false,
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      TOOLBAR_BUTTONS: [],
      SHOW_CHROME_EXTENSION_BANNER: false,
    }),
    []
  );

  return (
    <aside
      className={`flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-3 py-2.5 text-white">
        <div>
          <p className="text-sm font-semibold">Live Class</p>
          <p className="text-[10px] text-white/70">
            {videoActive ? "Video call" : "Tap to start video"}
          </p>
        </div>
        {videoActive ? (
          <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
            <Users className="size-3.5" />
            {state.participantCount || (state.isJoined ? 1 : 0)}
          </div>
        ) : null}
      </div>

      <div className="relative h-[180px] w-full bg-[#0a1628] sm:h-[220px] xl:h-[260px]">
        {!videoActive ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-xs text-white/75">
              Video is optional — start only when you need a live call.
            </p>
            <Button
              type="button"
              className="h-9 gap-2 bg-gold px-4 text-xs text-white hover:bg-gold-dark"
              onClick={() => setVideoActive(true)}
            >
              <Video className="size-4" />
              Start video
            </Button>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <PageLoading />
              </div>
            }
          >
            <JitsiMeeting
              domain={env.jitsiDomain}
              roomName={roomName}
              userInfo={{ displayName, email }}
              configOverwrite={jitsiConfig}
              interfaceConfigOverwrite={jitsiInterface}
              onApiReady={onApiReady}
              getIFrameRef={(parentNode) => {
                parentNode.style.height = "100%";
                parentNode.style.width = "100%";
              }}
              spinner={() => (
                <div className="flex h-full items-center justify-center text-sm text-white/80">
                  Connecting…
                </div>
              )}
            />
          </Suspense>
        )}
      </div>

      {videoActive ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-navy/10 bg-navy p-2">
          <VideoControlButton
            label={state.isAudioMuted ? "Unmute" : "Mute"}
            active={state.isAudioMuted}
            onClick={toggleAudio}
          >
            {state.isAudioMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </VideoControlButton>

          <VideoControlButton
            label={state.isVideoMuted ? "Camera on" : "Camera off"}
            active={state.isVideoMuted}
            onClick={toggleVideo}
          >
            {state.isVideoMuted ? <VideoOff className="size-4" /> : <Video className="size-4" />}
          </VideoControlButton>

          {(isTeacher || role === "observer") && (
            <VideoControlButton
              label={state.isSharingScreen ? "Stop share" : "Share screen"}
              active={state.isSharingScreen}
              onClick={toggleScreenShare}
            >
              <MonitorUp className="size-4" />
            </VideoControlButton>
          )}

          {isTeacher && (
            <VideoControlButton label="Mute all" onClick={muteEveryone} variant="gold">
              <VolumeX className="size-4" />
            </VideoControlButton>
          )}

          <VideoControlButton
            label="Leave call"
            onClick={() => {
              hangUp();
              setVideoActive(false);
            }}
            variant="danger"
          >
            <PhoneOff className="size-4" />
          </VideoControlButton>
        </div>
      ) : null}
    </aside>
  );
}
