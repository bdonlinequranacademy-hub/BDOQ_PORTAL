import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { buildClassroomRoomName } from "@/lib/utils/classroomRoom";
import { useClassroom } from "@/hooks/useClassroom";
import { VideoPanel } from "@/components/classroom/VideoPanel";
import { Whiteboard } from "@/components/classroom/Whiteboard";
import { ClassroomControls } from "@/components/classroom/ClassroomControls";
import type { ClassroomVideoRole } from "@/types/classroom.types";
import type { Role as UserRole } from "@/types/models";

interface ClassroomProps {
  classId?: string;
  roomName?: string;
  className?: string;
  /** Admin monitor mode — view whiteboard/video only, no teacher controls */
  observeOnly?: boolean;
}

function resolveVideoRole(role: UserRole | undefined): ClassroomVideoRole {
  if (role === "student") return "student";
  if (role === "admin" || role === "super_admin") return "observer";
  return "teacher";
}

export function Classroom({
  classId,
  roomName,
  className = "",
  observeOnly = false,
}: ClassroomProps) {
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const sessionId =
    roomName ?? searchParams.get("room") ?? buildClassroomRoomName(classId);
  const videoRole = resolveVideoRole(user?.role);

  const classroom = useClassroom({ sessionId });
  const showTeacherControls = classroom.isTeacher && !observeOnly;
  const boardReadOnly = observeOnly || classroom.readOnly;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <ClassroomControls
        connected={classroom.connected}
        session={classroom.session}
        isTeacher={showTeacherControls}
        isStudent={classroom.isStudent}
        observeOnly={observeOnly}
        handRaised={classroom.handRaised}
        raisedHands={classroom.raisedHands}
        readOnly={boardReadOnly}
        onStartClass={classroom.startClass}
        onEndClass={classroom.endClass}
        onToggleLock={classroom.toggleLock}
        onClearBoard={classroom.clearRemoteWhiteboard}
        onToggleHand={classroom.toggleHand}
        onNotify={classroom.sendNotification}
      />

      <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(260px,300px)_1fr] xl:items-start">
        <VideoPanel
          roomName={sessionId}
          displayName={user?.name ?? "Guest"}
          email={user?.email}
          role={videoRole}
          className="xl:sticky xl:top-4"
        />
        <Whiteboard
          readOnly={boardReadOnly}
          onDocumentChange={observeOnly ? undefined : classroom.handleLocalWhiteboardChange}
          remoteWhiteboard={classroom.remoteWhiteboard}
          clearSignal={classroom.clearSignal}
        />
      </div>
    </div>
  );
}
