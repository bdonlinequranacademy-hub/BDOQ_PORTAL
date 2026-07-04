import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { PageLoader } from "@/components/layout/PageLoader";

function lazyNamed<T extends ComponentType>(
  factory: () => Promise<Record<string, T>>,
  name: string
) {
  return lazy(() => factory().then((m) => ({ default: m[name as keyof typeof m] as T })));
}

export const LoginPage = lazyNamed(
  () => import("@/features/auth/pages/LoginPage"),
  "LoginPage"
);
export const RegisterPage = lazyNamed(
  () => import("@/features/auth/pages/RegisterPage"),
  "RegisterPage"
);
export const EmailVerifiedPage = lazyNamed(
  () => import("@/features/auth/pages/EmailVerifiedPage"),
  "EmailVerifiedPage"
);
export const CheckEmailPage = lazyNamed(
  () => import("@/features/auth/pages/CheckEmailPage"),
  "CheckEmailPage"
);
export const VerifyEmailPage = lazyNamed(
  () => import("@/features/auth/pages/VerifyEmailPage"),
  "VerifyEmailPage"
);
export const ForgotPasswordPage = lazyNamed(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
  "ForgotPasswordPage"
);
export const ResetPasswordPage = lazyNamed(
  () => import("@/features/auth/pages/ResetPasswordPage"),
  "ResetPasswordPage"
);
export const OAuthCallbackPage = lazyNamed(
  () => import("@/features/auth/pages/OAuthCallbackPage"),
  "OAuthCallbackPage"
);

export const StudentDashboardPage = lazyNamed(
  () => import("@/features/student/pages/StudentDashboardPage"),
  "StudentDashboardPage"
);
export const StudentClassesPage = lazyNamed(
  () => import("@/features/student/pages/StudentClassesPage"),
  "StudentClassesPage"
);
export const StudentClassDetailPage = lazyNamed(
  () => import("@/features/student/pages/StudentClassDetailPage"),
  "StudentClassDetailPage"
);
export const StudentHomeworkLayout = lazyNamed(
  () => import("@/features/student/pages/StudentHomeworkLayout"),
  "StudentHomeworkLayout"
);
export const StudentHomeworkEmptyPane = lazyNamed(
  () => import("@/features/student/pages/StudentHomeworkEmptyPane"),
  "StudentHomeworkEmptyPane"
);
export const StudentHomeworkDetailPage = lazyNamed(
  () => import("@/features/student/pages/StudentHomeworkDetailPage"),
  "StudentHomeworkDetailPage"
);
export const StudentHomeworkSuccessPage = lazyNamed(
  () => import("@/features/student/pages/StudentHomeworkSuccessPage"),
  "StudentHomeworkSuccessPage"
);
export const StudentAttendancePage = lazyNamed(
  () => import("@/features/student/pages/StudentAttendancePage"),
  "StudentAttendancePage"
);
export const StudentProgressPage = lazyNamed(
  () => import("@/features/student/pages/StudentProgressPage"),
  "StudentProgressPage"
);
export const StudentWeeklySummaryPage = lazyNamed(
  () => import("@/features/student/pages/StudentWeeklySummaryPage"),
  "StudentWeeklySummaryPage"
);
export const StudentNotificationsPage = lazyNamed(
  () => import("@/features/student/pages/StudentNotificationsPage"),
  "StudentNotificationsPage"
);
export const StudentProfilePage = lazyNamed(
  () => import("@/features/student/pages/StudentProfilePage"),
  "StudentProfilePage"
);
export const TeacherDashboardPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherDashboardPage"),
  "TeacherDashboardPage"
);
export const TeacherStudentsPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherStudentsPage"),
  "TeacherStudentsPage"
);
export const TeacherClassesPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherClassesPage"),
  "TeacherClassesPage"
);
export const TeacherClassDetailPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherClassDetailPage"),
  "TeacherClassDetailPage"
);
export const TeacherAttendancePage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherAttendancePage"),
  "TeacherAttendancePage"
);
export const TeacherAttendanceSheetPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherAttendanceSheetPage"),
  "TeacherAttendanceSheetPage"
);
export const TeacherAttendanceSuccessPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherAttendanceSuccessPage"),
  "TeacherAttendanceSuccessPage"
);
export const TeacherHomeworkPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherHomeworkPage"),
  "TeacherHomeworkPage"
);
export const TeacherHomeworkGradePage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherHomeworkGradePage"),
  "TeacherHomeworkGradePage"
);
export const TeacherProgressPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherProgressPage"),
  "TeacherProgressPage"
);
export const TeacherParentSummaryPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherParentSummaryPage"),
  "TeacherParentSummaryPage"
);
export const TeacherProfilePage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherProfilePage"),
  "TeacherProfilePage"
);
export const TeacherNotificationsPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherNotificationsPage"),
  "TeacherNotificationsPage"
);
export const TeacherTodaySchedulePage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherTodaySchedulePage"),
  "TeacherTodaySchedulePage"
);
export const TeacherRoutinePage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherRoutinePage"),
  "TeacherRoutinePage"
);
export const TeacherClassLogsPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherClassLogsPage"),
  "TeacherClassLogsPage"
);
export const TeacherEarningsPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherEarningsPage"),
  "TeacherEarningsPage"
);
export const TeacherAvailabilityPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherAvailabilityPage"),
  "TeacherAvailabilityPage"
);
export const TeacherRequestStudentPage = lazyNamed(
  () => import("@/features/teacher/pages/TeacherRequestStudentPage"),
  "TeacherRequestStudentPage"
);
export const AdminDashboardPage = lazyNamed(
  () => import("@/features/admin/pages/AdminDashboardPage"),
  "AdminDashboardPage"
);
export const AdminUsersPage = lazyNamed(
  () => import("@/features/admin/pages/AdminUsersPage"),
  "AdminUsersPage"
);
export const AdminWhatsAppQueuePage = lazyNamed(
  () => import("@/features/admin/pages/AdminWhatsAppQueuePage"),
  "AdminWhatsAppQueuePage"
);
export const AdminClassesPage = lazyNamed(
  () => import("@/features/admin/pages/AdminClassesPage"),
  "AdminClassesPage"
);
export const AdminClassFormPage = lazyNamed(
  () => import("@/features/admin/pages/AdminClassFormPage"),
  "AdminClassFormPage"
);
export const AdminClassDetailPage = lazyNamed(
  () => import("@/features/admin/pages/AdminClassDetailPage"),
  "AdminClassDetailPage"
);
export const AdminClassLogsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminClassLogsPage"),
  "AdminClassLogsPage"
);
export const AdminEarningsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminEarningsPage"),
  "AdminEarningsPage"
);
export const AdminAttendancePage = lazyNamed(
  () => import("@/features/admin/pages/AdminAttendancePage"),
  "AdminAttendancePage"
);
export const AdminProgressPage = lazyNamed(
  () => import("@/features/admin/pages/AdminProgressPage"),
  "AdminProgressPage"
);
export const AdminBlogPage = lazyNamed(
  () => import("@/features/admin/pages/AdminBlogPage"),
  "AdminBlogPage"
);
export const AdminBlogFormPage = lazyNamed(
  () => import("@/features/admin/pages/AdminBlogFormPage"),
  "AdminBlogFormPage"
);
export const AdminGalleryPage = lazyNamed(
  () => import("@/features/admin/pages/AdminGalleryPage"),
  "AdminGalleryPage"
);
export const AdminGalleryFormPage = lazyNamed(
  () => import("@/features/admin/pages/AdminGalleryFormPage"),
  "AdminGalleryFormPage"
);
export const AdminTestimonialsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminTestimonialsPage"),
  "AdminTestimonialsPage"
);
export const AdminTestimonialFormPage = lazyNamed(
  () => import("@/features/admin/pages/AdminTestimonialFormPage"),
  "AdminTestimonialFormPage"
);
export const AdminPricingPage = lazyNamed(
  () => import("@/features/admin/pages/AdminPricingPage"),
  "AdminPricingPage"
);
export const AdminPricingFormPage = lazyNamed(
  () => import("@/features/admin/pages/AdminPricingFormPage"),
  "AdminPricingFormPage"
);
export const AdminResourcesPage = lazyNamed(
  () => import("@/features/admin/pages/AdminResourcesPage"),
  "AdminResourcesPage"
);
export const AdminResourceFormPage = lazyNamed(
  () => import("@/features/admin/pages/AdminResourceFormPage"),
  "AdminResourceFormPage"
);
export const AdminStudentRequestsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminStudentRequestsPage"),
  "AdminStudentRequestsPage"
);
export const AdminTrialBookingsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminTrialBookingsPage"),
  "AdminTrialBookingsPage"
);
export const AdminStudentAdmissionsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminStudentAdmissionsPage"),
  "AdminStudentAdmissionsPage"
);
export const AdminTeacherApplicationsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminTeacherApplicationsPage"),
  "AdminTeacherApplicationsPage"
);
export const AdminContactMessagesPage = lazyNamed(
  () => import("@/features/admin/pages/AdminContactMessagesPage"),
  "AdminContactMessagesPage"
);
export const AdminHomeworkPage = lazyNamed(
  () => import("@/features/admin/pages/AdminHomeworkPage"),
  "AdminHomeworkPage"
);
export const AdminRoutinePage = lazyNamed(
  () => import("@/features/admin/pages/AdminRoutinePage"),
  "AdminRoutinePage"
);
export const AdminLiveMonitorPage = lazyNamed(
  () => import("@/features/admin/pages/AdminLiveMonitorPage"),
  "AdminLiveMonitorPage"
);
export const AdminCurriculumPage = lazyNamed(
  () => import("@/features/admin/pages/AdminCurriculumPage"),
  "AdminCurriculumPage"
);
export const AdminPaymentsPage = lazyNamed(
  () => import("@/features/admin/pages/AdminPaymentsPage"),
  "AdminPaymentsPage"
);

export const StudentPaymentsPage = lazyNamed(
  () => import("@/features/student/pages/StudentPaymentsPage"),
  "StudentPaymentsPage"
);

export const PaymentInvoicePage = lazyNamed(
  () => import("@/features/payments/pages/PaymentInvoicePage"),
  "PaymentInvoicePage"
);

export const AdminCertificatesPage = lazyNamed(
  () => import("@/features/admin/pages/AdminCertificatesPage"),
  "AdminCertificatesPage"
);

export const AdminCertificateViewPage = lazyNamed(
  () => import("@/features/admin/pages/AdminCertificateViewPage"),
  "AdminCertificateViewPage"
);

export const AdminProfilePage = lazyNamed(
  () => import("@/features/admin/pages/AdminProfilePage"),
  "AdminProfilePage"
);

export const ParentDashboardPage = lazyNamed(
  () => import("@/features/parent/pages/ParentDashboardPage"),
  "ParentDashboardPage"
);
export const ParentAttendancePage = lazyNamed(
  () => import("@/features/parent/pages/ParentAttendancePage"),
  "ParentAttendancePage"
);
export const ParentHomeworkPage = lazyNamed(
  () => import("@/features/parent/pages/ParentHomeworkPage"),
  "ParentHomeworkPage"
);
export const ParentProgressPage = lazyNamed(
  () => import("@/features/parent/pages/ParentProgressPage"),
  "ParentProgressPage"
);
export const ParentNotificationsPage = lazyNamed(
  () => import("@/features/parent/pages/ParentNotificationsPage"),
  "ParentNotificationsPage"
);

export const VerifyCertificatePage = lazyNamed(
  () => import("@/features/certificates/pages/VerifyCertificatePage"),
  "VerifyCertificatePage"
);

export const PortalHomePage = lazyNamed(
  () => import("@/pages/PortalHomePage"),
  "PortalHomePage"
);
export const ForbiddenPage = lazyNamed(
  () => import("@/pages/ForbiddenPage"),
  "ForbiddenPage"
);
export const NotFoundPage = lazyNamed(
  () => import("@/pages/NotFoundPage"),
  "NotFoundPage"
);

export function suspend(
  Lazy: LazyExoticComponent<ComponentType>
) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Lazy />
    </Suspense>
  );
}
