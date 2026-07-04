import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type {
  StudentClass,
  StudentHomeworkItem,
  StudentAttendanceData,
  StudentProgressRecord,
  Notification,
  TodaySchedulePayload,
  StudentProfile,
  WeeklyFamilyReport,
  StudentBillingView,
  PaymentRecordView,
  PaymentInvoiceView,
} from "@/types/models";
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

  submitHomework: (
    id: string,
    payload: {
      content: string;
      curriculumProgram: string;
      curriculumUnit?: string;
      curriculumTopic?: string;
    }
  ) =>
    apiClient
      .post<ApiResponse<{ homeworkId: string }>>(`/student/homework/${id}/submit`, payload)
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

  getWeeklyReport: () =>
    apiClient
      .get<ApiResponse<WeeklyFamilyReport>>("/student/weekly-report")
      .then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<StudentProfile>>("/student/profile").then((r) => r.data),

  updateProfile: (payload: {
    name?: string;
    timezone?: string;
    country?: string;
    whatsapp?: string;
  }) =>
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

  getPaymentInvoice: (paymentId: string) =>
    apiClient
      .get<ApiResponse<PaymentInvoiceView>>(`/student/payments/${paymentId}/invoice`)
      .then((r) => r.data),
};
