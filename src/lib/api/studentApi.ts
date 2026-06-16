import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type {
  StudentClass,
  StudentHomeworkItem,
  StudentAttendanceData,
  StudentProgressRecord,
  Notification,
  StudyPlanResult,
  TodaySchedulePayload,
  MonthlyProgressSnapshot,
  StudentProfile,
  WeeklyFamilyReport,
  ConcernReportView,
  ConcernCategory,
  StudentBillingView,
  PaymentRecordView,
} from "@/types/models";
import { currentWeekRange } from "@/lib/utils/weekRange";
import { getAiLocale } from "@/lib/api/getAiLocale";
import { normalizeCurriculumAssignments } from "@/lib/utils/normalize";

export const studentApi = {
  getClasses: () =>
    apiClient.get<ApiResponse<StudentClass[]>>("/student/classes").then((r) => r.data),

  getClass: (id: string) =>
    apiClient
      .get<ApiResponse<StudentClass>>(`/student/classes/${id}`)
      .then((r) => r.data),

  getHomework: () =>
    apiClient.get<ApiResponse<StudentHomeworkItem[]>>("/student/homework").then((r) => r.data),

  submitHomework: (id: string, content: string) =>
    apiClient
      .post<ApiResponse<{ homeworkId: string }>>(`/student/homework/${id}/submit`, {
        content,
      })
      .then((r) => r.data),

  getAttendance: () =>
    apiClient
      .get<ApiResponse<StudentAttendanceData>>("/student/attendance")
      .then((r) => r.data),

  getProgress: () =>
    apiClient
      .get<ApiResponse<StudentProgressRecord[]>>("/student/progress")
      .then((r) => r.data),

  getCurriculumPlan: () =>
    apiClient
      .get<ApiResponse<unknown[]>>("/student/curriculum-plan")
      .then((r) => ({
        ...r.data,
        data: normalizeCurriculumAssignments(r.data.data),
      })),

  getNotifications: () =>
    apiClient
      .get<ApiResponse<Notification[]>>("/student/notifications")
      .then((r) => r.data),

  markNotificationRead: (id: string) =>
    apiClient
      .patch<ApiResponse<Notification>>(`/student/notifications/${id}/read`)
      .then((r) => r.data),

  getTodaySchedule: () =>
    apiClient
      .get<ApiResponse<TodaySchedulePayload>>("/student/schedule/today")
      .then((r) => r.data),

  generateStudyPlan: (payload: {
    studentId: string;
    targetGoal: string;
    availableDaysPerWeek: number;
    minutesPerDay: number;
  }) =>
    apiClient
      .post<ApiResponse<StudyPlanResult>>("/ai/study-plan", {
        ...payload,
        locale: getAiLocale(),
      })
      .then((r) => r.data),

  generateWeeklySummary: (studentId: string) => {
    const { weekStart, weekEnd } = currentWeekRange();
    return apiClient
      .post<ApiResponse<{ summary: string; studentName?: string; locale?: string; generatedAt: string }>>(
        "/ai/parent-summary",
        { studentId, weekStart, weekEnd, locale: getAiLocale() }
      )
      .then((r) => r.data);
  },

  getMonthlyProgress: (month?: string) =>
    apiClient
      .get<ApiResponse<MonthlyProgressSnapshot[]>>("/student/monthly-progress", {
        params: month ? { month } : {},
      })
      .then((r) => r.data),

  getWeeklyReport: () =>
    apiClient
      .get<ApiResponse<WeeklyFamilyReport>>("/student/weekly-report")
      .then((r) => r.data),

  submitConcernReport: (payload: {
    category: ConcernCategory;
    message: string;
    relatedTeacherId?: string;
  }) =>
    apiClient
      .post<ApiResponse<ConcernReportView>>("/student/concern-reports", payload)
      .then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<StudentProfile>>("/student/profile").then((r) => r.data),

  updateProfile: (payload: { name?: string; timezone?: string; country?: string }) =>
    apiClient.patch<ApiResponse<StudentProfile>>("/student/profile", payload).then((r) => r.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient
      .patch<ApiResponse<null>>("/student/profile/password", payload)
      .then((r) => r.data),

  getPaymentStatus: () =>
    apiClient
      .get<
        ApiResponse<{
          billing: StudentBillingView | null;
          pendingSubmissions: number;
        }>
      >("/student/payments/status")
      .then((r) => r.data),

  getPayments: () =>
    apiClient
      .get<ApiResponse<PaymentRecordView[]>>("/student/payments")
      .then((r) => r.data),

  submitPayment: (formData: FormData) =>
    apiClient
      .post<ApiResponse<PaymentRecordView>>("/student/payments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};
