import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/adminApi";
import { useUiStore } from "@/stores/uiStore";
import type { Role, ClassSchedule, BlogPostStatus, BlogCategory, ClassLogStatus, StudentRequestStatus, TrialBookingStatus, ContactMessageStatus } from "@/types/models";

export const adminKeys = {
  stats: ["admin", "stats"] as const,
  users: (role?: Role) => ["admin", "users", role] as const,
  user: (id: string) => ["admin", "user", id] as const,
  classes: ["admin", "classes"] as const,
  class: (id: string) => ["admin", "class", id] as const,
  attendance: (classId?: string) => ["admin", "attendance", classId] as const,
  progress: (classId?: string) => ["admin", "progress", classId] as const,
  atRisk: ["ai", "atRisk"] as const,
  blogPosts: (status?: BlogPostStatus, category?: BlogCategory) =>
    ["admin", "blog", status, category] as const,
  blogPost: (id: string) => ["admin", "blog", id] as const,
  classLogs: (status?: string) => ["admin", "classLogs", status] as const,
  earnings: (month?: string) => ["admin", "earnings", month] as const,
  monthlyProgress: (month?: string) => ["admin", "monthlyProgress", month] as const,
  studentRequests: (status?: string) => ["admin", "studentRequests", status] as const,
  trialBookings: (status?: string) => ["admin", "trialBookings", status] as const,
  contactMessages: (status?: string) => ["admin", "contactMessages", status] as const,
  homework: ["admin", "homework"] as const,
  concernReports: (status?: string) => ["admin", "concernReports", status] as const,
  academyRoutine: (teacherId?: string) => ["admin", "academyRoutine", teacherId] as const,
  curriculum: ["admin", "curriculum"] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: adminApi.getStats,
    select: (r) => r.data,
  });
}

export function useAdminUsers(role?: Role, gender?: "male" | "female") {
  return useQuery({
    queryKey: [...adminKeys.users(role), gender] as const,
    queryFn: () => adminApi.getUsers(role, gender),
    select: (r) => r.data ?? [],
  });
}

export function useAdminClass(id: string) {
  return useQuery({
    queryKey: adminKeys.class(id),
    queryFn: () => adminApi.getClass(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useAdminClasses() {
  return useQuery({
    queryKey: adminKeys.classes,
    queryFn: adminApi.getClasses,
    select: (r) => r.data ?? [],
  });
}

export function useAdminAttendance(classId?: string) {
  return useQuery({
    queryKey: adminKeys.attendance(classId),
    queryFn: () => adminApi.getAttendance(classId),
    select: (r) => r.data ?? [],
  });
}

export function useAdminProgress(classId?: string) {
  return useQuery({
    queryKey: adminKeys.progress(classId),
    queryFn: () => adminApi.getProgress(classId),
    select: (r) => r.data ?? [],
  });
}

export function useAdminAtRisk() {
  const locale = useUiStore((s) => s.aiLocale);
  return useQuery({
    queryKey: [...adminKeys.atRisk, locale],
    queryFn: adminApi.getAtRisk,
    select: (r) => r.data ?? [],
    staleTime: 5 * 60_000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "User created");
    },
    onError: () => addToast("error", "Failed to create user"),
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (
      payload: Partial<{
        name: string;
        email: string;
        role: Role;
        isActive: boolean;
        children: string[];
        gender: "male" | "female" | "";
        timezone: string;
        country: string;
      }>
    ) => adminApi.updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      addToast("success", "User updated");
    },
    onError: () => addToast("error", "Failed to update user"),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "User deactivated");
    },
    onError: () => addToast("error", "Failed to deactivate user"),
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createClass,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.classes });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "Class created");
    },
    onError: () => addToast("error", "Failed to create class"),
  });
}

export function useUpdateClass(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (
      payload: Partial<{
        title: string;
        description: string;
        teacherId: string;
        studentIds: string[];
        schedule: ClassSchedule;
        meetingLink: string;
        sessionRateBdt: number;
      }>
    ) => adminApi.updateClass(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.class(id) });
      qc.invalidateQueries({ queryKey: adminKeys.classes });
      addToast("success", "Class updated");
    },
    onError: () => addToast("error", "Failed to update class"),
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteClass,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.classes });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "Class deactivated");
    },
    onError: () => addToast("error", "Failed to deactivate class"),
  });
}

export function useAssignStudent(classId: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (studentId: string) => adminApi.assignStudent(classId, studentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.class(classId) });
      qc.invalidateQueries({ queryKey: adminKeys.classes });
      addToast("success", "Student enrolled");
    },
    onError: () => addToast("error", "Failed to enroll student"),
  });
}

export function useAdminBlogPosts(status?: BlogPostStatus, category?: BlogCategory) {
  return useQuery({
    queryKey: adminKeys.blogPosts(status, category),
    queryFn: () => adminApi.getBlogPosts({ status, category }),
    select: (r) => r.data ?? [],
  });
}

export function useAdminBlogPost(id: string) {
  return useQuery({
    queryKey: adminKeys.blogPost(id),
    queryFn: () => adminApi.getBlogPost(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      addToast("success", "Blog post created");
    },
    onError: () => addToast("error", "Failed to create blog post"),
  });
}

export function useUpdateBlogPost(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: Parameters<typeof adminApi.updateBlogPost>[1]) =>
      adminApi.updateBlogPost(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.blogPost(id) });
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      addToast("success", "Blog post saved");
    },
    onError: () => addToast("error", "Failed to save blog post"),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteBlogPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      addToast("success", "Blog post deleted");
    },
    onError: () => addToast("error", "Failed to delete blog post"),
  });
}

export function useRemoveStudent(classId: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (studentId: string) => adminApi.removeStudent(classId, studentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.class(classId) });
      qc.invalidateQueries({ queryKey: adminKeys.classes });
      addToast("success", "Student removed");
    },
    onError: () => addToast("error", "Failed to remove student"),
  });
}

export function useAdminClassLogs(status?: ClassLogStatus) {
  return useQuery({
    queryKey: adminKeys.classLogs(status),
    queryFn: () => adminApi.getClassLogs(status),
    select: (r) => r.data ?? [],
  });
}

export function useApproveClassLog() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.approveClassLog,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "classLogs"] });
      qc.invalidateQueries({ queryKey: ["admin", "earnings"] });
      qc.invalidateQueries({ queryKey: ["teacher", "earnings"] });
      addToast("success", "Class log approved");
    },
    onError: () => addToast("error", "Failed to approve class log"),
  });
}

export function useRejectClassLog() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      adminApi.rejectClassLog(id, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "classLogs"] });
      qc.invalidateQueries({ queryKey: ["admin", "earnings"] });
      addToast("success", "Class log rejected");
    },
    onError: () => addToast("error", "Failed to reject class log"),
  });
}

export function useAdminEarnings(month?: string) {
  return useQuery({
    queryKey: adminKeys.earnings(month),
    queryFn: () => adminApi.getEarnings(month),
    select: (r) => r.data,
  });
}

export function useAdminMonthlyProgress(month?: string) {
  return useQuery({
    queryKey: adminKeys.monthlyProgress(month),
    queryFn: () => adminApi.getMonthlyProgress(month),
    select: (r) => r.data ?? [],
  });
}

export function useAdminHomework() {
  return useQuery({
    queryKey: adminKeys.homework,
    queryFn: adminApi.getHomework,
    select: (r) => r.data ?? [],
  });
}

export function useAdminConcernReports(status?: import("@/types/models").ConcernReportStatus) {
  return useQuery({
    queryKey: adminKeys.concernReports(status),
    queryFn: () => adminApi.getConcernReports(status),
    select: (r) => r.data ?? [],
  });
}

export function useUpdateConcernReportStatus(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (
      payload: Parameters<typeof adminApi.updateConcernReportStatus>[1]
    ) => adminApi.updateConcernReportStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "concernReports"] });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "Report updated");
    },
    onError: () => addToast("error", "Failed to update report"),
  });
}

export function useAdminStudentRequests(status?: StudentRequestStatus) {
  return useQuery({
    queryKey: adminKeys.studentRequests(status),
    queryFn: () => adminApi.getStudentRequests(status),
    select: (r) => r.data ?? [],
  });
}

export function useApproveStudentRequest() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      adminApi.approveStudentRequest(id, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "studentRequests"] });
      addToast("success", "Request approved");
    },
    onError: () => addToast("error", "Failed to approve request"),
  });
}

export function useRejectStudentRequest() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      adminApi.rejectStudentRequest(id, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "studentRequests"] });
      addToast("success", "Request rejected");
    },
    onError: () => addToast("error", "Failed to reject request"),
  });
}

export function useAdminTrialBookings(status?: TrialBookingStatus) {
  return useQuery({
    queryKey: adminKeys.trialBookings(status),
    queryFn: () => adminApi.getTrialBookings(status),
    select: (r) => r.data ?? [],
  });
}

export function useUpdateTrialBookingStatus() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TrialBookingStatus }) =>
      adminApi.updateTrialBookingStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "trialBookings"] });
      addToast("success", "Trial booking updated");
    },
    onError: () => addToast("error", "Failed to update trial booking"),
  });
}

export function useAdminContactMessages(status?: ContactMessageStatus) {
  return useQuery({
    queryKey: adminKeys.contactMessages(status),
    queryFn: () => adminApi.getContactMessages(status),
    select: (r) => r.data ?? [],
  });
}

export function useUpdateContactMessageStatus() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessageStatus }) =>
      adminApi.updateContactMessageStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contactMessages"] });
      addToast("success", "Contact message updated");
    },
    onError: () => addToast("error", "Failed to update contact message"),
  });
}

export function useAdminTeachers() {
  return useAdminUsers("teacher");
}

export function useAdminAcademyRoutine(teacherId?: string) {
  return useQuery({
    queryKey: adminKeys.academyRoutine(teacherId),
    queryFn: () => adminApi.getAcademyRoutine(teacherId),
    select: (r) => r.data ?? [],
  });
}

export function useResyncAdminSchedule() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.resyncSchedule,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin", "academyRoutine"] });
      addToast("success", res.message || "Schedule resynced");
    },
    onError: () => addToast("error", "Failed to resync schedule"),
  });
}

export function useAdminCurriculum() {
  return useQuery({
    queryKey: adminKeys.curriculum,
    queryFn: adminApi.getCurriculum,
    select: (r) => r.data ?? [],
  });
}

export function useUpdateAdminCurriculum() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.updateCurriculum,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.curriculum });
      qc.invalidateQueries({ queryKey: ["curriculum"] });
      addToast("success", "Curriculum saved");
    },
    onError: (error: unknown) => {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to save curriculum";
      addToast("error", message);
    },
  });
}

export function useResetAdminCurriculum() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.resetCurriculum,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.curriculum });
      qc.invalidateQueries({ queryKey: ["curriculum"] });
      addToast("success", "Curriculum reset to defaults");
    },
    onError: () => addToast("error", "Failed to reset curriculum"),
  });
}
