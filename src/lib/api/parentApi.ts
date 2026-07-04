import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type {
  ParentChild,
  StudentClass,
  StudentHomeworkItem,
  StudentAttendanceData,
  StudentProgressRecord,
  Notification,
  TodaySchedulePayload,
} from "@/types/models";

export const parentApi = {
  getChildren: () =>
    apiClient.get<ApiResponse<ParentChild[]>>("/parent/children").then((r) => r.data),

  getChildClasses: (childId: string) =>
    apiClient
      .get<ApiResponse<StudentClass[]>>(`/parent/child/${childId}/classes`)
      .then((r) => r.data),

  getChildTodaySchedule: (childId: string) =>
    apiClient
      .get<ApiResponse<TodaySchedulePayload>>(`/parent/child/${childId}/schedule/today`)
      .then((r) => r.data),

  getChildHomework: (childId: string) =>
    apiClient
      .get<ApiResponse<StudentHomeworkItem[]>>(`/parent/child/${childId}/homework`)
      .then((r) => r.data),

  getChildAttendance: (childId: string) =>
    apiClient
      .get<ApiResponse<StudentAttendanceData>>(`/parent/child/${childId}/attendance`)
      .then((r) => r.data),

  getChildProgress: (childId: string) =>
    apiClient
      .get<ApiResponse<StudentProgressRecord[]>>(`/parent/child/${childId}/progress`)
      .then((r) => r.data),

  getNotifications: () =>
    apiClient
      .get<ApiResponse<Notification[]>>("/parent/notifications")
      .then((r) => r.data),

  markNotificationRead: (id: string) =>
    apiClient
      .patch<ApiResponse<Notification>>(`/parent/notifications/${id}/read`)
      .then((r) => r.data),
};
