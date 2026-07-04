import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/adminApi";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import type { Role, ClassSchedule, BlogPostStatus, BlogCategory, ClassLogStatus, StudentRequestStatus, TrialBookingStatus, ContactMessageStatus, StudentAdmissionStatus, TeacherApplicationStatus, BillingCurrency, ResourceType, ResourceStatus } from "@/types/models";

export const adminKeys = {
  stats: ["admin", "stats"] as const,
  users: (role?: Role) => ["admin", "users", role] as const,
  user: (id: string) => ["admin", "user", id] as const,
  classes: ["admin", "classes"] as const,
  class: (id: string) => ["admin", "class", id] as const,
  attendance: (classId?: string) => ["admin", "attendance", classId] as const,
  progress: (classId?: string) => ["admin", "progress", classId] as const,
  blogPosts: (status?: BlogPostStatus, category?: BlogCategory) =>
    ["admin", "blog", status, category] as const,
  blogPost: (id: string) => ["admin", "blog", id] as const,
  resources: (type?: ResourceType, status?: ResourceStatus) =>
    ["admin", "resources", type, status] as const,
  resource: (id: string) => ["admin", "resource", id] as const,
  testimonials: ["admin", "testimonials"] as const,
  testimonial: (id: string) => ["admin", "testimonial", id] as const,
  gallery: ["admin", "gallery"] as const,
  galleryItem: (id: string) => ["admin", "galleryItem", id] as const,
  pricing: ["admin", "pricing"] as const,
  pricingPackage: (id: string) => ["admin", "pricingPackage", id] as const,
  classLogs: (status?: string) => ["admin", "classLogs", status] as const,
  earnings: (month?: string) => ["admin", "earnings", month] as const,
  studentRequests: (status?: string) => ["admin", "studentRequests", status] as const,
  trialBookings: (status?: string) => ["admin", "trialBookings", status] as const,
  studentAdmissions: (status?: string) => ["admin", "studentAdmissions", status] as const,
  teacherApplications: (status?: string) => ["admin", "teacherApplications", status] as const,
  contactMessages: (status?: string) => ["admin", "contactMessages", status] as const,
  homework: ["admin", "homework"] as const,
  academyRoutine: (teacherId?: string) => ["admin", "academyRoutine", teacherId] as const,
  curriculum: ["admin", "curriculum"] as const,
  payments: (status?: string) => ["admin", "payments", status] as const,
  overdueBillings: ["admin", "payments", "overdue"] as const,
  studentBilling: (studentId: string) => ["admin", "billing", studentId] as const,
  whatsappQueue: ["admin", "whatsapp-queue"] as const,
  liveMonitor: ["admin", "live-monitor"] as const,
  certificates: ["admin", "certificates"] as const,
  certificate: (id: string) => ["admin", "certificate", id] as const,
  profile: ["admin", "profile"] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: adminApi.getStats,
    select: (r) => r.data,
    staleTime: 120_000,
  });
}

export function useAdminWhatsAppQueue() {
  return useQuery({
    queryKey: adminKeys.whatsappQueue,
    queryFn: adminApi.getWhatsAppQueue,
    select: (r) => r.data ?? [],
    staleTime: 60_000,
  });
}

export function useAdminLiveMonitor() {
  return useQuery({
    queryKey: adminKeys.liveMonitor,
    queryFn: adminApi.getLiveMonitor,
    select: (r) => r.data,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useAdminUsers(
  role?: Role,
  gender?: "male" | "female",
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...adminKeys.users(role), gender] as const,
    queryFn: () => adminApi.getUsers(role, gender),
    select: (r) => r.data ?? [],
    enabled: options?.enabled ?? true,
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

export function useSetClassActive() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (isActive) {
        await adminApi.updateClass(id, { isActive: true });
      } else {
        await adminApi.deleteClass(id);
      }
      return null;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: adminKeys.classes });
      qc.invalidateQueries({ queryKey: adminKeys.class(variables.id) });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast(
        "success",
        variables.isActive ? "Class reactivated" : "Class deactivated"
      );
    },
    onError: (_err, variables) =>
      addToast(
        "error",
        variables.isActive ? "Failed to reactivate class" : "Failed to deactivate class"
      ),
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

export function useAdminResources(type?: ResourceType, status?: ResourceStatus) {
  return useQuery({
    queryKey: adminKeys.resources(type, status),
    queryFn: () => adminApi.getResources({ type, status }),
    select: (r) => r.data ?? [],
  });
}

export function useAdminResource(id: string) {
  return useQuery({
    queryKey: adminKeys.resource(id),
    queryFn: () => adminApi.getResource(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createResource,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "resources"] });
      addToast("success", "Resource created");
    },
    onError: () => addToast("error", "Failed to create resource"),
  });
}

export function useUpdateResource(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminApi.updateResource(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.resource(id) });
      qc.invalidateQueries({ queryKey: ["admin", "resources"] });
      addToast("success", "Resource saved");
    },
    onError: () => addToast("error", "Failed to save resource"),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteResource,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "resources"] });
      addToast("success", "Resource deleted");
    },
    onError: () => addToast("error", "Failed to delete resource"),
  });
}

export function useUploadResourceFile() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ file, purpose }: { file: File; purpose?: string }) =>
      adminApi.uploadResourceFile(file, purpose),
    onError: () => addToast("error", "File upload failed"),
  });
}

export function useAdminTestimonials() {
  return useQuery({
    queryKey: adminKeys.testimonials,
    queryFn: () => adminApi.getTestimonials(),
    select: (r) => r.data ?? [],
  });
}

export function useAdminTestimonial(id: string) {
  return useQuery({
    queryKey: adminKeys.testimonial(id),
    queryFn: () => adminApi.getTestimonial(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.testimonials });
      addToast("success", "Review published");
    },
    onError: () => addToast("error", "Failed to create review"),
  });
}

export function useUpdateTestimonial(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: Parameters<typeof adminApi.updateTestimonial>[1]) =>
      adminApi.updateTestimonial(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.testimonial(id) });
      qc.invalidateQueries({ queryKey: adminKeys.testimonials });
      addToast("success", "Review saved");
    },
    onError: () => addToast("error", "Failed to save review"),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.testimonials });
      addToast("success", "Review deleted");
    },
    onError: () => addToast("error", "Failed to delete review"),
  });
}

export function useAdminGalleryItems() {
  return useQuery({
    queryKey: adminKeys.gallery,
    queryFn: () => adminApi.getGalleryItems(),
    select: (r) => r.data ?? [],
  });
}

export function useAdminGalleryItem(id: string) {
  return useQuery({
    queryKey: adminKeys.galleryItem(id),
    queryFn: () => adminApi.getGalleryItem(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useCreateGalleryItem() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createGalleryItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.gallery });
      addToast("success", "Gallery item created");
    },
    onError: () => addToast("error", "Failed to create gallery item"),
  });
}

export function useUpdateGalleryItem(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: Parameters<typeof adminApi.updateGalleryItem>[1]) =>
      adminApi.updateGalleryItem(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.galleryItem(id) });
      qc.invalidateQueries({ queryKey: adminKeys.gallery });
      addToast("success", "Gallery item saved");
    },
    onError: () => addToast("error", "Failed to save gallery item"),
  });
}

export function useDeleteGalleryItem() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteGalleryItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.gallery });
      addToast("success", "Gallery item deleted");
    },
    onError: () => addToast("error", "Failed to delete gallery item"),
  });
}

export function useAdminPricingPackages() {
  return useQuery({
    queryKey: adminKeys.pricing,
    queryFn: () => adminApi.getPricingPackages(),
    select: (r) => r.data ?? [],
  });
}

export function useAdminPricingPackage(id: string) {
  return useQuery({
    queryKey: adminKeys.pricingPackage(id),
    queryFn: () => adminApi.getPricingPackage(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useCreatePricingPackage() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createPricingPackage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.pricing });
      addToast("success", "Pricing package created");
    },
    onError: () => addToast("error", "Failed to create pricing package"),
  });
}

export function useUpdatePricingPackage(id: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: (payload: Parameters<typeof adminApi.updatePricingPackage>[1]) =>
      adminApi.updatePricingPackage(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.pricing });
      qc.invalidateQueries({ queryKey: adminKeys.pricingPackage(id) });
      addToast("success", "Pricing package saved");
    },
    onError: () => addToast("error", "Failed to save pricing package"),
  });
}

export function useDeletePricingPackage() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deletePricingPackage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.pricing });
      addToast("success", "Pricing package deleted");
    },
    onError: () => addToast("error", "Failed to delete pricing package"),
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

export function useAdminHomework() {
  return useQuery({
    queryKey: adminKeys.homework,
    queryFn: adminApi.getHomework,
    select: (r) => r.data ?? [],
  });
}

export function useDeleteAdminHomework() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.deleteHomework,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.homework });
      addToast("success", "Homework deleted");
    },
    onError: () => addToast("error", "Failed to delete homework"),
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

export function useAdminStudentAdmissions(status?: StudentAdmissionStatus) {
  return useQuery({
    queryKey: adminKeys.studentAdmissions(status),
    queryFn: () => adminApi.getStudentAdmissions(status),
    select: (r) => r.data ?? [],
  });
}

export function useUpdateStudentAdmissionStatus() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: StudentAdmissionStatus;
      adminNote?: string;
    }) => adminApi.updateStudentAdmissionStatus(id, status, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "studentAdmissions"] });
      addToast("success", "Admission application updated");
    },
    onError: () => addToast("error", "Failed to update admission application"),
  });
}

export function useAdminTeacherApplications(status?: TeacherApplicationStatus) {
  return useQuery({
    queryKey: adminKeys.teacherApplications(status),
    queryFn: () => adminApi.getTeacherApplications(status),
    select: (r) => r.data ?? [],
  });
}

export function useUpdateTeacherApplicationStatus() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: TeacherApplicationStatus;
      adminNote?: string;
    }) => adminApi.updateTeacherApplicationStatus(id, status, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "teacherApplications"] });
      addToast("success", "Teacher application updated");
    },
    onError: () => addToast("error", "Failed to update teacher application"),
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

export function useAdminPayments(
  status?: "pending" | "approved" | "rejected",
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: adminKeys.payments(status),
    queryFn: () => adminApi.getPayments(status),
    select: (r) => r.data ?? [],
    enabled: options?.enabled ?? true,
  });
}

export function useAdminOverdueBillings(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.overdueBillings,
    queryFn: adminApi.getOverdueBillings,
    select: (r) => r.data ?? [],
    enabled: options?.enabled ?? true,
  });
}

export function useApprovePayment() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.approvePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "payments"] });
      qc.invalidateQueries({ queryKey: adminKeys.overdueBillings });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "Payment approved");
    },
    onError: () => addToast("error", "Failed to approve payment"),
  });
}

export function useRejectPayment() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.rejectPayment(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "payments"] });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      addToast("success", "Payment rejected");
    },
    onError: () => addToast("error", "Failed to reject payment"),
  });
}

export function useUpsertStudentBilling() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: ({
      studentId,
      ...payload
    }: {
      studentId: string;
      monthlyFee: number;
      currency: BillingCurrency;
      dueDayOfMonth?: number;
      paidUntil?: string;
      isActive?: boolean;
    }) => adminApi.upsertStudentBilling(studentId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminKeys.studentBilling(vars.studentId) });
      qc.invalidateQueries({ queryKey: adminKeys.overdueBillings });
      addToast("success", "Billing plan saved");
    },
    onError: () => addToast("error", "Failed to save billing plan"),
  });
}

export function useAdminCertificates() {
  return useQuery({
    queryKey: adminKeys.certificates,
    queryFn: adminApi.getCertificates,
    select: (r) => r.data ?? [],
  });
}

export function useAdminCertificate(id: string) {
  return useQuery({
    queryKey: adminKeys.certificate(id),
    queryFn: () => adminApi.getCertificate(id),
    select: (r) => r.data,
    enabled: Boolean(id),
  });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.createCertificate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.certificates });
      addToast("success", "Certificate generated");
    },
    onError: () => addToast("error", "Failed to generate certificate"),
  });
}

export function useAdminProfile() {
  return useQuery({
    queryKey: adminKeys.profile,
    queryFn: adminApi.getProfile,
    select: (r) => r.data,
  });
}

export function useUpdateAdminProfile() {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: adminApi.updateProfile,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: adminKeys.profile });
      if (res.data?.name) {
        updateUser({ name: res.data.name });
      }
      if (res.data?.avatarUrl) {
        updateUser({ avatarUrl: res.data.avatarUrl });
      }
      if (res.data?.gender) {
        updateUser({ gender: res.data.gender });
      }
      addToast("success", "Profile updated");
    },
    onError: () => addToast("error", "Failed to update profile"),
  });
}

export function useChangeAdminPassword() {
  const addToast = useUiStore((s) => s.addToast);
  return useMutation({
    mutationFn: adminApi.changePassword,
    onSuccess: () => addToast("success", "Password changed"),
    onError: () => addToast("error", "Failed to change password"),
  });
}
