import { useSearchParams } from "react-router-dom";
import { buildClassroomRoomName } from "@/lib/utils/classroomRoom";
import { useClassroom } from "@/hooks/useClassroom";
import { LiveSessionPanel } from "@/components/classroom/LiveSessionPanel";
import { Whiteboard } from "@/components/classroom/Whiteboard";
import { ClassroomControls } from "@/components/classroom/ClassroomControls";

interface ClassroomProps {
  classId?: string;
  roomName?: string;
  className?: string;
  /** Admin monitor mode — view session + whiteboard only */
  observeOnly?: boolean;
}

export function Classroom({
  classId,
  roomName,
  className = "",
  observeOnly = false,
}: ClassroomProps) {
  const [searchParams] = useSearchParams();
  const sessionId =
    roomName ?? searchParams.get("room") ?? buildClassroomRoomName(classId);

  const classroom = useClassroom({ sessionId, observeOnly });
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

      <div
        className={
          observeOnly
            ? "flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(260px,300px)_1fr] xl:items-start"
            : "flex flex-col gap-3"
        }
      >
        {observeOnly ? (
          <LiveSessionPanel
            session={classroom.session}
            connected={classroom.connected}
            className="xl:sticky xl:top-4"
          />
        ) : null}
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
