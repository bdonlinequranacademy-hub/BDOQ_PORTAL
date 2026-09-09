import type {
  AdminUser,
  AdminUserProfileDetail,
  AdminClass,
  AdminStats,
  AttendanceOverview,
  AdminProgressRecord,
  Role,
  ClassSchedule,
  AdminBlogPost,
  AdminResource,
  AdminTestimonial,
  AdminGalleryItem,
  AdminPricingPackage,
  AdminCourse,
  AdminCourseCategory,
  AdminCourseGender,
  AdminCourseDetail,
  AdminTeacherProfile,
  AdminFaqItem,
  AdminHomeHeroSlide,
  AdminSectionHeader,
  GalleryAlbumType,
  GalleryMediaType,
  BlogCategory,
  BlogPostStatus,
  BlogAuthor,
  BlogFaq,
  TestimonialMediaType,
  ResourceType,
  ResourceStatus,
  ResourceSection,
  ClassLogView,
  ClassLogStatus,
  AdminEarningsOverview,
  AdminHomeworkItem,
  StudentRequestView,
  StudentRequestStatus,
  ContactMessageView,
  ContactMessageStatus,
  NewsletterSubscriberView,
  NewsletterSubscriberStatus,
  TrialBookingView,
  TrialBookingStatus,
  StudentAdmissionView,
  StudentAdmissionStatus,
  StudentAdmissionPaymentStatus,
  StudentAdmissionClassDay,
  TeacherApplicationView,
  TeacherApplicationStatus,
  SessionSlotView,
  CurriculumAssignment,
  StudentBillingView,
  PaymentRecordView,
  PaymentInvoiceView,
  OptionalPaymentView,
  OptionalPaymentCategory,
  PaymentStatus,
  CertificateView,
  AdminProfile,
  OverdueBillingView,
  BillingCurrency,
  WhatsAppQueueItem,
  LiveMonitorPayload,
} from "@/types/models";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import { api as apiClient } from "./client";
import type { ApiResponse } from "@/types/api";

export const adminApi = {
  getStats: () =>
    apiClient.get<ApiResponse<AdminStats>>("/admin/stats").then((r) => r.data),

  getLiveMonitor: () =>
    apiClient
      .get<ApiResponse<LiveMonitorPayload>>("/admin/live-monitor")
      .then((r) => r.data),

  getWhatsAppQueue: () =>
    apiClient
      .get<ApiResponse<WhatsAppQueueItem[]>>("/admin/whatsapp-queue")
      .then((r) => r.data),

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

  getUserProfile: (id: string) =>
    apiClient
      .get<ApiResponse<AdminUserProfileDetail>>(`/admin/users/${id}/profile`)
      .then((r) => r.data),

  createUser: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    gender?: "male" | "female";
    timezone?: string;
    country?: string;
    whatsapp?: string;
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
      whatsapp: string;
      curriculumAssignments: CurriculumAssignment[];
      profileNotes: string;
    }>
  ) =>
    apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload).then((r) => r.data),

  updateUserApplicationData: (id: string, applicationId: string, applicationData: Record<string, unknown>) =>
    apiClient
      .put<ApiResponse<Record<string, unknown>>>(`/admin/users/${id}/application-data`, {
        applicationId,
        applicationData,
      })
      .then((r) => r.data),

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
    curriculum?: CurriculumAssignment;
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
      curriculum: CurriculumAssignment;
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

  getHomework: () =>
    apiClient
      .get<ApiResponse<AdminHomeworkItem[]>>("/admin/homework")
      .then((r) => r.data),

  deleteHomework: (id: string) =>
    apiClient
      .delete<ApiResponse<{ homeworkId: string }>>(`/admin/homework/${id}`)
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

  updateTrialBooking: (
    id: string,
    payload: {
      parentName?: string;
      studentName?: string;
      email?: string;
      whatsapp?: string;
      country?: string;
      age?: string;
      learnerGender?: "male" | "female";
      preferredTrialDate?: string;
      preferredTrialTime?: string;
      additionalNote?: string;
      teacherSlug?: string;
      meetingPlatform?: "google_meet" | "zoom" | "teams" | "whatsapp" | "custom";
      meetingLink?: string;
      teacherPreference?: "any" | "female" | "male";
      preferredDays?: string[];
      timezone?: string;
      courseSlug?: string;
      status?: TrialBookingStatus;
    }
  ) =>
    apiClient
      .patch<ApiResponse<TrialBookingView>>(`/admin/trial-bookings/${id}`, payload)
      .then((r) => r.data),

  deleteTrialBooking: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/trial-bookings/${id}`)
      .then((r) => r.data),

  sendTrialInvitation: (
    id: string,
    payload?: {
      teacherSlug?: string;
      meetingPlatform?: "google_meet" | "zoom" | "teams" | "whatsapp" | "custom";
      meetingLink?: string;
    }
  ) =>
    apiClient
      .post<
        ApiResponse<{
          booking: TrialBookingView;
          delivery: {
            emailSent: boolean;
            emailError?: string;
            whatsappUrl: string | null;
          };
        }>
      >(`/admin/trial-bookings/${id}/send-invitation`, payload ?? {})
      .then((r) => r.data),

  convertTrialToAdmission: (
    id: string,
    payload: { email: string; locale?: "en" | "bn" }
  ) =>
    apiClient
      .post<
        ApiResponse<{
          booking: TrialBookingView;
          admission: StudentAdmissionView;
          prefillUrl: string;
          portalAdmissionPath: string;
        }>
      >(`/admin/trial-bookings/${id}/convert-to-admission`, payload)
      .then((r) => r.data),

  getStudentAdmissions: (status?: StudentAdmissionStatus) =>
    apiClient
      .get<ApiResponse<StudentAdmissionView[]>>("/admin/student-admissions", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  updateStudentAdmissionStatus: (
    id: string,
    status: StudentAdmissionStatus,
    adminNote?: string
  ) =>
    apiClient
      .patch<ApiResponse<StudentAdmissionView>>(
        `/admin/student-admissions/${id}/status`,
        { status, adminNote }
      )
      .then((r) => r.data),

  updateStudentAdmissionPaymentStatus: (
    id: string,
    paymentStatus: StudentAdmissionPaymentStatus,
    rejectReason?: string
  ) =>
    apiClient
      .patch<ApiResponse<StudentAdmissionView>>(
        `/admin/student-admissions/${id}/payment-status`,
        { paymentStatus, rejectReason }
      )
      .then((r) => r.data),

  updateStudentAdmissionEnrollment: (
    id: string,
    payload: {
      classStartDate?: string;
      classDays?: StudentAdmissionClassDay[];
      classesPerWeek?: number;
      classDurationMinutes?: number;
      classTimeHour?: string;
      classTimeMinute?: string;
      classTimePeriod?: "AM" | "PM";
      assignedTeacherSlug?: string;
      meetingPlatform?: string;
      meetingLink?: string;
      monthlyFeeAmount?: number;
      monthlyFeeCurrency?: "bdt" | "usd";
    }
  ) =>
    apiClient
      .patch<ApiResponse<StudentAdmissionView>>(
        `/admin/student-admissions/${id}/enrollment`,
        payload
      )
      .then((r) => r.data),

  deleteStudentAdmission: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/student-admissions/${id}`)
      .then((r) => r.data),

  getTeacherApplications: (status?: TeacherApplicationStatus) =>
    apiClient
      .get<ApiResponse<TeacherApplicationView[]>>("/admin/teacher-applications", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  updateTeacherApplicationStatus: (
    id: string,
    status: TeacherApplicationStatus,
    adminNote?: string
  ) =>
    apiClient
      .patch<ApiResponse<TeacherApplicationView>>(
        `/admin/teacher-applications/${id}/status`,
        { status, adminNote }
      )
      .then((r) => r.data),

  deleteTeacherApplication: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/teacher-applications/${id}`)
      .then((r) => r.data),

  getContactMessages: (status?: ContactMessageStatus) =>
    apiClient
      .get<ApiResponse<ContactMessageView[]>>("/admin/contact-messages", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  getOptionalPayments: (status?: PaymentStatus, category?: OptionalPaymentCategory) =>
    apiClient
      .get<ApiResponse<OptionalPaymentView[]>>("/admin/optional-payments", {
        params: {
          ...(status ? { status } : {}),
          ...(category ? { category } : {}),
        },
      })
      .then((r) => r.data),

  approveOptionalPayment: (id: string) =>
    apiClient
      .patch<ApiResponse<OptionalPaymentView>>(`/admin/optional-payments/${id}/approve`)
      .then((r) => r.data),

  rejectOptionalPayment: (id: string, reason: string) =>
    apiClient
      .patch<ApiResponse<OptionalPaymentView>>(`/admin/optional-payments/${id}/reject`, {
        reason,
      })
      .then((r) => r.data),

  updateContactMessageStatus: (id: string, status: ContactMessageStatus) =>
    apiClient
      .patch<ApiResponse<ContactMessageView>>(`/admin/contact-messages/${id}/status`, {
        status,
      })
      .then((r) => r.data),

  getNewsletterSubscribers: (status?: NewsletterSubscriberStatus) =>
    apiClient
      .get<ApiResponse<NewsletterSubscriberView[]>>("/admin/newsletter-subscribers", {
        params: status ? { status } : {},
      })
      .then((r) => r.data),

  updateNewsletterSubscriberStatus: (
    id: string,
    status: NewsletterSubscriberStatus
  ) =>
    apiClient
      .patch<ApiResponse<NewsletterSubscriberView>>(
        `/admin/newsletter-subscribers/${id}/status`,
        { status }
      )
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

  getResources: (params?: {
    type?: ResourceType;
    status?: ResourceStatus;
    section?: ResourceSection;
  }) =>
    apiClient
      .get<ApiResponse<AdminResource[]>>("/admin/resources", { params })
      .then((r) => r.data),

  getResource: (id: string) =>
    apiClient
      .get<ApiResponse<AdminResource>>(`/admin/resources/${id}`)
      .then((r) => r.data),

  createResource: (payload: Record<string, unknown>) =>
    apiClient
      .post<ApiResponse<AdminResource>>("/admin/resources", payload)
      .then((r) => r.data),

  updateResource: (id: string, payload: Record<string, unknown>) =>
    apiClient
      .put<ApiResponse<AdminResource>>(`/admin/resources/${id}`, payload)
      .then((r) => r.data),

  deleteResource: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/resources/${id}`)
      .then((r) => r.data),

  uploadResourceFile: (file: File, purpose?: string) => {
    const form = new FormData();
    form.append("file", file);
    if (purpose) form.append("purpose", purpose);
    return apiClient
      .post<
        ApiResponse<{
          url: string;
          publicId: string;
          fileSize: string;
          mimeType: string;
        }>
      >("/admin/resources/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  getTestimonials: () =>
    apiClient
      .get<ApiResponse<AdminTestimonial[]>>("/admin/testimonials")
      .then((r) => r.data),

  getTestimonial: (id: string) =>
    apiClient
      .get<ApiResponse<AdminTestimonial>>(`/admin/testimonials/${id}`)
      .then((r) => r.data),

  createTestimonial: (payload: {
    name: string;
    role: string;
    location: string;
    content: string;
    rating?: number;
    image?: string;
    mediaType?: TestimonialMediaType;
    mediaUrl?: string;
    youtubeId?: string;
    sortOrder?: number;
    showOnWebsite?: boolean;
  }) =>
    apiClient
      .post<ApiResponse<AdminTestimonial>>("/admin/testimonials", payload)
      .then((r) => r.data),

  updateTestimonial: (
    id: string,
    payload: Partial<{
      name: string;
      role: string;
      location: string;
      content: string;
      rating: number;
      image: string;
      mediaType: TestimonialMediaType;
      mediaUrl: string;
      youtubeId: string;
      sortOrder: number;
      showOnWebsite: boolean;
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminTestimonial>>(`/admin/testimonials/${id}`, payload)
      .then((r) => r.data),

  deleteTestimonial: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/testimonials/${id}`)
      .then((r) => r.data),

  getGalleryItems: () =>
    apiClient
      .get<ApiResponse<AdminGalleryItem[]>>("/admin/gallery")
      .then((r) => r.data),

  getGalleryItem: (id: string) =>
    apiClient
      .get<ApiResponse<AdminGalleryItem>>(`/admin/gallery/${id}`)
      .then((r) => r.data),

  createGalleryItem: (payload: {
    title: string;
    description?: string;
    album: GalleryAlbumType;
    mediaType: GalleryMediaType;
    mediaUrl?: string;
    mediaPublicId?: string;
    youtubeId?: string;
    coverGradient?: string;
    heightClass?: string;
    sortOrder?: number;
    showOnWebsite?: boolean;
  }) =>
    apiClient
      .post<ApiResponse<AdminGalleryItem>>("/admin/gallery", payload)
      .then((r) => r.data),

  updateGalleryItem: (
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      album: GalleryAlbumType;
      mediaType: GalleryMediaType;
      mediaUrl: string;
      mediaPublicId: string;
      youtubeId: string;
      coverGradient: string;
      heightClass: string;
      sortOrder: number;
      showOnWebsite: boolean;
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminGalleryItem>>(`/admin/gallery/${id}`, payload)
      .then((r) => r.data),

  deleteGalleryItem: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/gallery/${id}`)
      .then((r) => r.data),

  getPricingPackages: () =>
    apiClient
      .get<ApiResponse<AdminPricingPackage[]>>("/admin/pricing")
      .then((r) => r.data),

  getPricingPackage: (id: string) =>
    apiClient
      .get<ApiResponse<AdminPricingPackage>>(`/admin/pricing/${id}`)
      .then((r) => r.data),

  createPricingPackage: (payload: {
    slug?: string;
    name: string;
    priceBdt: number;
    priceUsd: number;
    period?: string;
    features: string[];
    popular?: boolean;
    sortOrder?: number;
    showOnWebsite?: boolean;
  }) =>
    apiClient
      .post<ApiResponse<AdminPricingPackage>>("/admin/pricing", payload)
      .then((r) => r.data),

  updatePricingPackage: (
    id: string,
    payload: Partial<{
      slug: string;
      name: string;
      priceBdt: number;
      priceUsd: number;
      period: string;
      features: string[];
      popular: boolean;
      sortOrder: number;
      showOnWebsite: boolean;
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminPricingPackage>>(`/admin/pricing/${id}`, payload)
      .then((r) => r.data),

  deletePricingPackage: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/pricing/${id}`)
      .then((r) => r.data),

  getCourses: () =>
    apiClient
      .get<ApiResponse<AdminCourse[]>>("/admin/courses")
      .then((r) => r.data),

  getCourse: (id: string) =>
    apiClient
      .get<ApiResponse<AdminCourse>>(`/admin/courses/${id}`)
      .then((r) => r.data),

  createCourse: (payload: {
    slug?: string;
    title: string;
    description: string;
    icon?: string;
    target?: string;
    category: AdminCourseCategory;
    gender?: AdminCourseGender;
    sortOrder?: number;
    showOnWebsite?: boolean;
    detail?: Partial<AdminCourseDetail>;
  }) =>
    apiClient
      .post<ApiResponse<AdminCourse>>("/admin/courses", payload)
      .then((r) => r.data),

  updateCourse: (
    id: string,
    payload: Partial<{
      slug: string;
      title: string;
      description: string;
      icon: string;
      target: string;
      category: AdminCourseCategory;
      gender: AdminCourseGender | "";
      sortOrder: number;
      showOnWebsite: boolean;
      detail: Partial<AdminCourseDetail>;
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminCourse>>(`/admin/courses/${id}`, payload)
      .then((r) => r.data),

  deleteCourse: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/courses/${id}`)
      .then((r) => r.data),

  getTeacherProfiles: () =>
    apiClient
      .get<ApiResponse<AdminTeacherProfile[]>>("/admin/teacher-profiles")
      .then((r) => r.data),

  getTeacherProfile: (id: string) =>
    apiClient
      .get<ApiResponse<AdminTeacherProfile>>(`/admin/teacher-profiles/${id}`)
      .then((r) => r.data),

  createTeacherProfile: (payload: {
    slug?: string;
    name: string;
    role: string;
    bio: string;
    about?: string;
    gender: "male" | "female";
    country?: string;
    location?: string;
    avatarUrl?: string;
    featured?: boolean;
    showOnWebsite?: boolean;
    sortOrder?: number;
    qualifications?: string[];
    skills?: string[];
    experience?: string;
    languages?: string[];
    courseSlugs?: string[];
  }) =>
    apiClient
      .post<ApiResponse<AdminTeacherProfile>>("/admin/teacher-profiles", payload)
      .then((r) => r.data),

  updateTeacherProfile: (
    id: string,
    payload: Partial<{
      slug: string;
      name: string;
      role: string;
      bio: string;
      about: string;
      gender: "male" | "female";
      country: string;
      location: string;
      avatarUrl: string;
      featured: boolean;
      showOnWebsite: boolean;
      sortOrder: number;
      qualifications: string[];
      skills: string[];
      experience: string;
      languages: string[];
      courseSlugs: string[];
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminTeacherProfile>>(`/admin/teacher-profiles/${id}`, payload)
      .then((r) => r.data),

  deleteTeacherProfile: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/teacher-profiles/${id}`)
      .then((r) => r.data),

  getFaqItems: () =>
    apiClient
      .get<ApiResponse<AdminFaqItem[]>>("/admin/faq")
      .then((r) => r.data),

  getFaqItem: (id: string) =>
    apiClient
      .get<ApiResponse<AdminFaqItem>>(`/admin/faq/${id}`)
      .then((r) => r.data),

  createFaqItem: (payload: {
    externalId?: string;
    question: string;
    answer: string;
    sortOrder?: number;
    showOnWebsite?: boolean;
  }) =>
    apiClient
      .post<ApiResponse<AdminFaqItem>>("/admin/faq", payload)
      .then((r) => r.data),

  updateFaqItem: (
    id: string,
    payload: Partial<{
      externalId: string;
      question: string;
      answer: string;
      sortOrder: number;
      showOnWebsite: boolean;
    }>
  ) =>
    apiClient
      .put<ApiResponse<AdminFaqItem>>(`/admin/faq/${id}`, payload)
      .then((r) => r.data),

  deleteFaqItem: (id: string) =>
    apiClient
      .delete<ApiResponse<null>>(`/admin/faq/${id}`)
      .then((r) => r.data),

  getHomeHeroSlides: () =>
    apiClient
      .get<ApiResponse<{ slides: AdminHomeHeroSlide[] }>>("/admin/home-hero")
      .then((r) => r.data),

  saveHomeHeroSlides: (payload: { slides: AdminHomeHeroSlide[] }) =>
    apiClient
      .put<ApiResponse<{ slides: AdminHomeHeroSlide[] }>>(
        "/admin/home-hero",
        payload
      )
      .then((r) => r.data),

  getSectionHeaders: () =>
    apiClient
      .get<ApiResponse<{ headers: AdminSectionHeader[] }>>(
        "/admin/section-headers"
      )
      .then((r) => r.data),

  saveSectionHeaders: (payload: { headers: AdminSectionHeader[] }) =>
    apiClient
      .put<ApiResponse<{ headers: AdminSectionHeader[] }>>(
        "/admin/section-headers",
        payload
      )
      .then((r) => r.data),

  upsertSectionHeader: (payload: { header: AdminSectionHeader }) =>
    apiClient
      .put<ApiResponse<{ header: AdminSectionHeader }>>(
        "/admin/section-headers/item",
        payload
      )
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

  getPaymentInvoice: (paymentId: string) =>
    apiClient
      .get<ApiResponse<PaymentInvoiceView>>(`/admin/payments/${paymentId}/invoice`)
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

  getCertificates: () =>
    apiClient
      .get<ApiResponse<CertificateView[]>>("/admin/certificates")
      .then((r) => r.data),

  previewCertificate: (payload: CertificateFormPayload) =>
    apiClient
      .post<ApiResponse<CertificateView>>("/admin/certificates/preview", payload)
      .then((r) => r.data),

  createCertificate: (payload: CertificateFormPayload) =>
    apiClient
      .post<ApiResponse<CertificateView>>("/admin/certificates", payload)
      .then((r) => r.data),

  getCertificate: (id: string) =>
    apiClient
      .get<ApiResponse<CertificateView>>(`/admin/certificates/${id}`)
      .then((r) => r.data),

  getProfile: () =>
    apiClient.get<ApiResponse<AdminProfile>>("/admin/profile").then((r) => r.data),

  updateProfile: (payload: { name?: string; gender?: "male" | "female" }) =>
    apiClient
      .patch<ApiResponse<AdminProfile>>("/admin/profile", payload)
      .then((r) => r.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient
      .patch<ApiResponse<null>>("/admin/profile/password", payload)
      .then((r) => r.data),
};

export interface CertificateFormPayload {
  studentName: string;
  studentNameBn?: string;
  courseName: string;
  courseNameBn?: string;
  studentPortalId?: string;
  issueDate?: string;
  courseDuration: string;
  grade: string;
  showExcellentBadge?: boolean;
  performanceTextEn?: string;
  performanceTextBn?: string;
}
