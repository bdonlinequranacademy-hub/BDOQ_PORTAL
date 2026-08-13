import { api as apiClient } from "./client";
import {
  normalizeClass,
  normalizeNotification,
  normalizeProgressList,
  normalizeTeacherStudent,
  normalizeCurriculumAssignments,
  type TeacherStudent,
} from "@/lib/utils/normalize";
import type { ApiResponse } from "@/types/api";
import type {
  Homework,
  HomeworkSubmission,
  AttendanceRecord,
  AttendanceStatus,
  Progress,
  Grade,
  Notification,
  TodaySchedulePayload,
  SessionSlotView,
  ClassLogView,
  ClassLogStats,
  ClassLogStatus,
  TeacherEarningsSummary,
  TeacherProfile,
  StudentRequestView,
  AvailabilityCheckResult,
  ClassAttendanceEntry,
  WeeklyFamilyReport,
  OptionalPaymentView,
} from "@/types/models";

export type { TeacherStudent };

export const teacherApi = {
  getClasses: () =>
    apiClient.get<ApiResponse<unknown[]>>("/teacher/classes").then((r) => ({
      ...r.data,
      data: (r.data.data ?? []).map((item) =>
        normalizeClass(item as Record<string, unknown>)
      ),
    })),

  getClass: (id: string) =>
    apiClient.get<ApiResponse<unknown>>(`/teacher/classes/${id}`).then((r) => ({
      ...r.data,
      data: r.data.data
        ? normalizeClass(r.data.data as Record<string, unknown>)
        : null,
    })),

  getStudents: () =>
    apiClient.get<ApiResponse<unknown[]>>("/teacher/students").then((r) => ({
      ...r.data,
      data: (r.data.data ?? []).map((item) =>
        normalizeTeacherStudent(item as Record<string, unknown>)
      ) as TeacherStudent[],
    })),

  getStudentProgress: (studentId: string) =>
    apiClient
      .get<ApiResponse<unknown>>(`/teacher/students/${studentId}/progress`)
      .then((r) => ({
        ...r.data,
        data: normalizeProgressList(r.data.data),
      })),

  toggleCurriculumComplete: (
    studentId: string,
    payload: {
      programId: string;
      unitId?: string;
      topicId?: string;
      completed: boolean;
    }
  ) =>
    apiClient
      .patch<ApiResponse<unknown[]>>(
        `/teacher/students/${studentId}/curriculum-complete`,
        payload
      )
      .then((r) => ({
        ...r.data,
        data: normalizeCurriculumAssignments(r.data.data),
      })),

  getHomework: () =>
    apiClient.get<ApiResponse<Homework[]>>("/teacher/homework").then((r) => r.data),

  getHomeworkDetail: (id: string) =>
    apiClient.get<ApiResponse<Homework>>(`/teacher/homework/${id}`).then((r) => r.data),

  createHomework: (payload: {
    title: string;
    description?: string;
    classId: string;
    dueDate: string;
    curriculumProgram: string;
    curriculumUnit?: string;
    curriculumTopic?: string;
  }) =>
    apiClient.post<ApiResponse<Homework>>("/teacher/homework", payload).then((r) => r.data),

  updateHomework: (
    id: string,
    payload: {
      title?: string;
      description?: string;
      dueDate?: string;
      curriculumProgram?: string;
      curriculumUnit?: string;
      curriculumTopic?: string;
    }
  ) =>
    apiClient.put<ApiResponse<Homework>>(`/teacher/homework/${id}`, payload).then((r) => r.data),

  deleteHomework: (id: string) =>
    apiClient
      .delete<ApiResponse<{ homeworkId: string }>>(`/teacher/homework/${id}`)
      .then((r) => r.data),

  reviewHomeworkSubmission: (
    homeworkId: string,
    payload: { studentId: string; action: "approve" | "return"; feedback?: string }
  ) =>
    apiClient
      .post<ApiResponse<{ status: string }>>(`/teacher/homework/${homeworkId}/review`, payload)
      .then((r) => r.data),

  gradeSubmission: (
    homeworkId: string,
    payload: { studentId: string; grade: Grade; feedback?: string }
  ) =>
    apiClient
      .post<ApiResponse<HomeworkSubmission>>(
        `/teacher/homework/${homeworkId}/grade`,
        payload
      )
      .then((r) => r.data),

  getAttendanceReport: (classId?: string, date?: string) =>
    apiClient
      .get<ApiResponse<AttendanceRecord[]>>("/teacher/attendance-report", {
        params: { classId, date },
      })
      .then((r) => r.data),

  getClassAttendance: (classId: string, date: string) =>
    apiClient
      .get<ApiResponse<ClassAttendanceEntry[]>>("/teacher/attendance", {
        params: { classId, date },
      })
      .then((r) => r.data),

  getWeeklyReport: (studentId: string) =>
    apiClient
      .get<ApiResponse<WeeklyFamilyReport>>("/teacher/weekly-report", {
        params: { studentId },
      })
      .then((r) => r.data),

  scanCompliance: (text: string, context?: "class_log" | "homework_feedback" | "homework_submission") =>
    apiClient
      .post<ApiResponse<{ compliance: { passed: boolean; severity: string; message: string }; quality?: { passed: boolean; severity: string; message: string } | null; warnings: string[] }>>(
        "/teacher/compliance-scan",
        { text, context }
      )
      .then((r) => r.data),

  markAttendance: (
    classId: string,
    date: string,
    attendances: { studentId: string; status: AttendanceStatus }[]
  ) =>
    apiClient
      .post<ApiResponse<null>>("/teacher/attendance", { classId, date, attendances })
      .then((r) => r.data),

  updateProgress: (payload: {
    studentId: string;
    classId: string;
    curriculumProgram: string;
    curriculumUnit?: string;
    curriculumTopic?: string;
    surahsCompleted?: string[];
    tajweedScore?: number;
    memorizedAyahs?: number;
    notes?: string;
  }) =>
    apiClient.put<ApiResponse<Progress>>("/teacher/progress", payload).then((r) => r.data),

  getNotifications: () =>
    apiClient.get<ApiResponse<unknown[]>>("/teacher/notifications").then((r) => ({
      ...r.data,
      data: (r.data.data ?? []).map((item) =>
        normalizeNotification(item as Record<string, unknown>)
      ) as Notification[],
    })),

  markNotificationRead: (id: string) =>
    apiClient
      .patch<ApiResponse<Notification>>(`/teacher/notifications/${id}/read`)
      .then((r) => r.data),

  getTodaySchedule: () =>
    apiClient
      .get<ApiResponse<TodaySchedulePayload>>("/teacher/schedule/today")
      .then((r) => r.data),

  getWeeklyRoutine: () =>
    apiClient
      .get<ApiResponse<SessionSlotView[]>>("/teacher/schedule/routine")
      .then((r) => r.data),

  getClassLogs: (status?: ClassLogStatus) =>
    apiClient
      .get<ApiResponse<ClassLogView[]>>("/teacher/class-logs", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  getClassLogStats: () =>
    apiClient
      .get<ApiResponse<ClassLogStats>>("/teacher/class-logs/stats")
      .then((r) => r.data),

  createClassLog: (payload: {
    sessionSlotId: string;
    sessionDate: string;
    lessonReport: string;
    curriculumProgram: string;
    curriculumUnit?: string;
    curriculumTopic?: string;
    topicsCovered?: string[];
  }) =>
    apiClient
      .post<ApiResponse<ClassLogView>>("/teacher/class-logs", payload)
      .then((r) => r.data),

  getEarnings: (month?: string) =>
    apiClient
      .get<ApiResponse<TeacherEarningsSummary>>("/teacher/earnings", {
        params: month ? { month } : {},
      })
      .then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<TeacherProfile>>("/teacher/profile").then((r) => r.data),

  updateProfile: (payload: Partial<TeacherProfile>) =>
    apiClient
      .patch<ApiResponse<TeacherProfile>>("/teacher/profile", payload)
      .then((r) => r.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient
      .patch<ApiResponse<null>>("/teacher/profile/password", payload)
      .then((r) => r.data),

  checkAvailability: (payload: {
    day: string;
    startTime: string;
    durationMinutes: number;
  }) =>
    apiClient
      .post<ApiResponse<AvailabilityCheckResult>>("/teacher/availability/check", payload)
      .then((r) => r.data),

  getStudentRequests: () =>
    apiClient
      .get<ApiResponse<StudentRequestView[]>>("/teacher/student-requests")
      .then((r) => r.data),

  createStudentRequest: (payload: { message: string; preferredCourseType?: string }) =>
    apiClient
      .post<ApiResponse<StudentRequestView>>("/teacher/student-requests", payload)
      .then((r) => r.data),

  getOptionalPayments: () =>
    apiClient
      .get<ApiResponse<OptionalPaymentView[]>>("/teacher/optional-payments")
      .then((r) => r.data),

  submitOptionalPayment: (formData: FormData) =>
    apiClient
      .post<ApiResponse<OptionalPaymentView>>("/teacher/optional-payments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};
