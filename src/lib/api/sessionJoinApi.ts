import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";

export const sessionJoinApi = {
  recordTeacherJoin: (slotId: string) =>
    apiClient
      .post<ApiResponse<{ joinedAt: string; alreadyJoined: boolean }>>(
        `/teacher/session/join/${slotId}`,
        { source: "meeting_link" }
      )
      .then((r) => r.data),

  recordStudentJoin: (slotId: string) =>
    apiClient
      .post<ApiResponse<{ joinedAt: string; alreadyJoined: boolean }>>(
        `/student/session/join/${slotId}`,
        { source: "meeting_link" }
      )
      .then((r) => r.data),
};
