import type {
  AdminUser,
  AdminClass,
  AdminStats,
  AttendanceOverview,
  AdminProgressRecord,
  Role,
  ClassSchedule,
  AtRiskStudent,
  AdminBlogPost,
  BlogCategory,
  BlogPostStatus,
  BlogAuthor,
  BlogFaq,
  ClassLogView,
  ClassLogStatus,
  AdminEarningsOverview,
  MonthlyProgressSnapshot,
  AdminHomeworkItem,
  ConcernReportView,
  ConcernReportStatus,
  StudentRequestView,
  StudentRequestStatus,
  ContactMessageView,
  ContactMessageStatus,
  TrialBookingView,
  TrialBookingStatus,
  SessionSlotView,
  CurriculumAssignment,
  StudentBillingView,
  PaymentRecordView,
  OverdueBillingView,
  BillingCurrency,
} from "@/types/models";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import { getAiLocale } from "@/lib/api/getAiLocale";
import { normalizeAtRiskStudent } from "@/lib/utils/normalize";

export const adminApi = {
  getStats: () =>
    apiClient.get<ApiResponse<AdminStats>>("/admin/stats").then((r) => r.data),

  getUsers: (role?: Role, gender?: "male" | "female") =>
    apiClient
      .get<ApiResponse<AdminUser[]>>("/admin/users", {
        params: {
          ...(role ? { role } : {}),
          ...(gender ? { gender } : {}),
        },
      })
      .then((r) => r.data),

  getUser: (id: string) =>
    apiClient.get<ApiResponse<AdminUser>>(`/admin/users/${id}`).then((r) => r.data),

  createUser: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    gender?: "male" | "female";
    timezone?: string;
    country?: string;
    curriculumAssignments?: CurriculumAssignment[];
  }) =>
    apiClient.post<ApiResponse<AdminUser>>("/admin/users", payload).then((r) => r.data),

  updateUser: (
    id: string,
    payload: Partial<{
      name: string;
      email: string;
      role: Role;
      isActive: boolean;
      children: string[];
      gender: "male" | "female" | "";
      timezone: string;
      country: string;
      curriculumAssignments: CurriculumAssignment[];
    }>
  ) =>
    apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload).then((r) => r.data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`).then((r) => r.data),

  getClasses: () =>
    apiClient.get<ApiResponse<AdminClass[]>>("/admin/classes").then((r) => r.data),

  getClass: (id: string) =>
    apiClient.get<ApiResponse<AdminClass>>(`/admin/classes/${id}`).then((r) => r.data),

  createClass: (payload: {
    title: string;
    description?: string;
    teacherId: string;
    studentIds?: string[];
    schedule?: ClassSchedule;
    meetingLink?: string;
    sessionRateBdt?: number;
  }) =>
    apiClient.post<ApiResponse<AdminClass>>("/admin/classes", payload).then((r) => r.data),

  updateClass: (
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      teacherId: string;
      studentIds: string[];
      schedule: ClassSchedule;
      meetingLink: string;
      sessionRateBdt: number;
      isActive: boolean;
    }>
  ) =>
    apiClient.put<ApiResponse<AdminClass>>(`/admin/classes/${id}`, payload).then((r) => r.data),

  deleteClass: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/classes/${id}`).then((r) => r.data),

  assignStudent: (classId: string, studentId: string) =>
    apiClient
      .post<ApiResponse<AdminClass>>(`/admin/classes/${classId}/assign`, { studentId })
      .then((r) => r.data),

  removeStudent: (classId: string, studentId: string) =>
    apiClient
      .delete<ApiResponse<AdminClass>>(
        `/admin/classes/${classId}/remove/${studentId}`
      )
      .then((r) => r.data),

  getAttendance: (classId?: string) =>
    apiClient
      .get<ApiResponse<AttendanceOverview[]>>("/admin/attendance", {
        params: classId ? { classId } : {},
      })
      .then((r) => r.data),

  getProgress: (classId?: string) =>
    apiClient
      .get<ApiResponse<AdminProgressRecord[]>>("/admin/progress", {
        params: classId ? { classId } : {},
      })
      .then((r) => r.data),

  getAtRisk: () =>
    apiClient
      .get<ApiResponse<unknown[]>>("/ai/at-risk-students", {
        params: { locale: getAiLocale() },
      })
      .then((r) => ({
        ...r.data,
        data: (r.data.data ?? []).map((item) =>
          normalizeAtRiskStudent(item as Record<string, unknown>)
        ) as AtRiskStudent[],
      })),

  getClassLogs: (status?: ClassLogStatus) =>
    apiClient
      .get<ApiResponse<ClassLogView[]>>("/admin/class-logs", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  approveClassLog: (id: string) =>
    apiClient
      .patch<ApiResponse<ClassLogView>>(`/admin/class-logs/${id}/approve`)
      .then((r) => r.data),

  rejectClassLog: (id: string, adminNote?: string) =>
    apiClient
      .patch<ApiResponse<ClassLogView>>(`/admin/class-logs/${id}/reject`, { adminNote })
      .then((r) => r.data),

  getEarnings: (month?: string) =>
    apiClient
      .get<ApiResponse<AdminEarningsOverview>>("/admin/earnings", {
        params: month ? { month } : {},
      })
      .then((r) => r.data),

  getMonthlyProgress: (month?: string) =>
    apiClient
      .get<ApiResponse<MonthlyProgressSnapshot[]>>("/admin/monthly-progress", {
        params: month ? { month } : {},
      })
      .then((r) => r.data),

  getHomework: () =>
    apiClient
      .get<ApiResponse<AdminHomeworkItem[]>>("/admin/homework")
      .then((r) => r.data),

  getConcernReports: (status?: ConcernReportStatus) =>
    apiClient
      .get<ApiResponse<ConcernReportView[]>>("/admin/concern-reports", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  updateConcernReportStatus: (
    id: string,
    payload: { status: ConcernReportStatus; adminNote?: string }
  ) =>
    apiClient
      .patch<ApiResponse<ConcernReportView>>(`/admin/concern-reports/${id}/status`, payload)
      .then((r) => r.data),

  getStudentRequests: (status?: StudentRequestStatus) =>
    apiClient
      .get<ApiResponse<StudentRequestView[]>>("/admin/student-requests", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  approveStudentRequest: (id: string, adminNote?: string) =>
    apiClient
      .patch<ApiResponse<StudentRequestView>>(`/admin/student-requests/${id}/approve`, {
        adminNote,
      })
      .then((r) => r.data),

  rejectStudentRequest: (id: string, adminNote?: string) =>
    apiClient
      .patch<ApiResponse<StudentRequestView>>(`/admin/student-requests/${id}/reject`, {
        adminNote,
      })
      .then((r) => r.data),

  getTrialBookings: (status?: TrialBookingStatus) =>
    apiClient
      .get<ApiResponse<TrialBookingView[]>>("/admin/trial-bookings", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  updateTrialBookingStatus: (id: string, status: TrialBookingStatus) =>
    apiClient
      .patch<ApiResponse<TrialBookingView>>(`/admin/trial-bookings/${id}/status`, {
        status,
      })
      .then((r) => r.data),

  getContactMessages: (status?: ContactMessageStatus) =>
    apiClient
      .get<ApiResponse<ContactMessageView[]>>("/admin/contact-messages", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  updateContactMessageStatus: (id: string, status: ContactMessageStatus) =>
    apiClient
      .patch<ApiResponse<ContactMessageView>>(`/admin/contact-messages/${id}/status`, {
        status,
      })
      .then((r) => r.data),

  getAcademyRoutine: (teacherId?: string) =>
    apiClient
      .get<ApiResponse<SessionSlotView[]>>("/admin/schedule/routine", {
        params: teacherId ? { teacherId } : {},
      })
      .then((r) => r.data),

  resyncSchedule: () =>
    apiClient
      .post<ApiResponse<{ classesSynced: number }>>("/admin/schedule/resync")
      .then((r) => r.data),

  getBlogPosts: (params?: { status?: BlogPostStatus; category?: BlogCategory }) =>
    apiClient
      .get<ApiResponse<AdminBlogPost[]>>("/admin/blog/posts", { params })
      .then((r) => r.data),

  getBlogPost: (id: string) =>
    apiClient
      .get<ApiResponse<AdminBlogPost>>(`/admin/blog/posts/${id}`)
      .then((r) => r.data),

  createBlogPost: (payload: {
    title: string;
    slug?: string;
    description: string;
    body: string;
    pubDate?: string;
    category: BlogCategory;
    tags?: string[];
    author?: BlogAuthor;
    readMinutes?: number;
    featured?: boolean;
    status?: BlogPostStatus;
    faqs?: BlogFaq[];
  }) =>
    apiClient
      .post<ApiResponse<AdminBlogPost>>("/admin/blog/posts", payload)
      .then((r) => r.data),

  updateBlogPost: (
    id: string,
    payload: Partial<{
      title: string;
      slug: string;
      description: string;
      body: string;
      pubDate: string;
      category: BlogCategory;
      tags: string[];
      author: BlogAuthor;
      readMinutes: number;
      featured: boolean;
      status: BlogPostStatus;
      faqs: BlogFaq[];
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminBlogPost>>(`/admin/blog/posts/${id}`, payload)
      .then((r) => r.data),

  deleteBlogPost: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/blog/posts/${id}`)
      .then((r) => r.data),

  getCurriculum: () =>
    apiClient.get<ApiResponse<CurriculumNode[]>>("/admin/curriculum").then((r) => r.data),

  updateCurriculum: (tree: CurriculumNode[]) =>
    apiClient
      .put<ApiResponse<CurriculumNode[]>>("/admin/curriculum", { tree })
      .then((r) => r.data),

  resetCurriculum: () =>
    apiClient
      .post<ApiResponse<CurriculumNode[]>>("/admin/curriculum/reset")
      .then((r) => r.data),

  getPayments: (status?: "pending" | "approved" | "rejected") =>
    apiClient
      .get<ApiResponse<PaymentRecordView[]>>("/admin/payments", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  getOverdueBillings: () =>
    apiClient
      .get<ApiResponse<OverdueBillingView[]>>("/admin/payments/overdue")
      .then((r) => r.data),

  approvePayment: (id: string) =>
    apiClient
      .patch<ApiResponse<PaymentRecordView>>(`/admin/payments/${id}/approve`)
      .then((r) => r.data),

  rejectPayment: (id: string, reason?: string) =>
    apiClient
      .patch<ApiResponse<PaymentRecordView>>(`/admin/payments/${id}/reject`, { reason })
      .then((r) => r.data),

  getStudentBilling: (studentId: string) =>
    apiClient
      .get<ApiResponse<StudentBillingView | null>>(`/admin/students/${studentId}/billing`)
      .then((r) => r.data),

  upsertStudentBilling: (
    studentId: string,
    payload: {
      monthlyFee: number;
      currency: BillingCurrency;
      dueDayOfMonth?: number;
      paidUntil?: string;
      isActive?: boolean;
    }
  ) =>
    apiClient
      .put<ApiResponse<StudentBillingView>>(`/admin/students/${studentId}/billing`, payload)
      .then((r) => r.data),
};
