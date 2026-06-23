/** Sanitized classroom room name for a class session */
export function buildClassroomRoomName(classId?: string, sessionId?: string): string {
  const slug = classId
    ? `albayaan-class-${classId}`
    : "albayaan-classroom-demo";
  const session = sessionId ? `-${sessionId}` : "";
  return `${slug}${session}`.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
}
