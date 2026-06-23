export type WhiteboardTool =
  | "select"
  | "pen"
  | "eraser"
  | "text"
  | "rect"
  | "circle"
  | "triangle"
  | "line"
  | "arrow";

export type ClassroomSessionStatus = "waiting" | "live" | "ended";

export interface ClassroomParticipant {
  userId: string;
  displayName: string;
  role: string;
  handRaised: boolean;
  joinedAt: string;
}

export interface ClassroomSessionSnapshot {
  sessionId: string;
  status: ClassroomSessionStatus;
  teacherId?: string;
  startedAt?: string;
  endedAt?: string;
  whiteboardJson: Record<string, unknown> | null;
  whiteboardLocked: boolean;
  participants: ClassroomParticipant[];
  participantCount: number;
}

export interface WhiteboardToolbarState {
  tool: WhiteboardTool;
  strokeColor: string;
  strokeWidth: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface RemoteWhiteboardSnapshot {
  version: number;
  json: Record<string, unknown>;
}
