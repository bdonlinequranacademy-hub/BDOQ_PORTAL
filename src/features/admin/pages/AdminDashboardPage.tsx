import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  CalendarDays,
  CalendarCheck,
  Inbox,
  Library,
  CreditCard,
  Percent,
  CheckCircle2,
  Radio,
  MessageCircle,
} from "lucide-react";
import { useAdminStats, useAdminWhatsAppQueue } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/shared/StatCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { LiveMonitorDashboardCard } from "@/features/admin/components/liveMonitor/LiveMonitorDashboardCard";
import {
  AdminDashboardActionPanel,
  type IAdminDashboardActionItem,
} from "@/features/admin/components/dashboard/AdminDashboardActionPanel";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { useAuthStore } from "@/stores/authStore";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t, locale, role: roleLabel } = usePortalTranslation();
  const { data: stats, isLoading } = useAdminStats();
  const { data: waQueue = [] } = useAdminWhatsAppQueue();
  const waActionable = waQueue.filter((i) => i.category !== "missing_whatsapp").length;

  const pending = stats?.pendingActions;
  const coverage = stats?.curriculumCoverage;
  const liveSummary = stats?.liveSummary;
  const pendingPayments = pending?.pendingPayments ?? 0;
  const pendingOptionalPayments = pending?.pendingOptionalPayments ?? 0;
  const pendingLogs = pending?.pendingClassLogs ?? 0;
  const pendingRequests = pending?.pendingStudentRequests ?? 0;
  const newTrials = pending?.newTrials ?? 0;
  const newContacts = pending?.newContacts ?? 0;
  const newAdmissions = pending?.newStudentAdmissions ?? 0;
  const newTeacherApps = pending?.newTeacherApplications ?? 0;

  const actionItems = useMemo(() => {
    const items: IAdminDashboardActionItem[] = [];

    if (newContacts > 0) {
      items.push({
        id: "contacts",
        title: t("admin.dashboard.newContacts", { count: String(newContacts) }),
        actionLabel: t("actions.openInbox"),
        onAction: () => navigate("/admin/contact-messages"),
        accent: "sky",
      });
    }
    if (newTrials > 0) {
      items.push({
        id: "trials",
        title: t("admin.dashboard.newTrials", { count: String(newTrials) }),
        actionLabel: t("actions.reviewTrials"),
        onAction: () => navigate("/admin/trial-bookings"),
        accent: "amber",
      });
    }
    if (newAdmissions > 0) {
      items.push({
        id: "admissions",
        title: t("admin.dashboard.newAdmissions", { count: String(newAdmissions) }),
        actionLabel: t("actions.reviewAdmissions"),
        onAction: () => navigate("/admin/student-admissions"),
        accent: "violet",
      });
    }
    if (newTeacherApps > 0) {
      items.push({
        id: "teacher-apps",
        title: t("admin.dashboard.newTeacherApps", { count: String(newTeacherApps) }),
        actionLabel: t("actions.reviewApplications"),
        onAction: () => navigate("/admin/teacher-applications"),
        accent: "violet",
      });
    }
    if (pendingPayments > 0) {
      items.push({
        id: "payments",
        title: t("admin.dashboard.pendingPayments", { count: String(pendingPayments) }),
        actionLabel: t("actions.reviewPayments"),
        onAction: () => navigate("/admin/payments"),
        accent: "primary",
      });
    }
    if (pendingOptionalPayments > 0) {
      items.push({
        id: "optional-payments",
        title: t("admin.dashboard.pendingOptionalPayments", {
          count: String(pendingOptionalPayments),
        }),
        actionLabel: t("actions.reviewOptionalPayments"),
        onAction: () => navigate("/admin/gifts"),
        accent: "primary",
      });
    }
    if (pendingLogs > 0) {
      items.push({
        id: "class-logs",
        title: t("admin.dashboard.pendingClassLogs", { count: String(pendingLogs) }),
        actionLabel: t("actions.reviewClassLogs"),
        onAction: () => navigate("/admin/class-logs"),
        accent: "amber",
      });
    }
    if (pendingRequests > 0) {
      items.push({
        id: "student-requests",
        title: t("admin.dashboard.pendingRequests", { count: String(pendingRequests) }),
        actionLabel: t("actions.viewRequests"),
        onAction: () => navigate("/admin/student-requests"),
        accent: "rose",
      });
    }

    return items;
  }, [
    navigate,
    newAdmissions,
    newContacts,
    newTeacherApps,
    newTrials,
    pendingLogs,
    pendingPayments,
    pendingOptionalPayments,
    pendingRequests,
    t,
    locale,
  ]);

  return (
    <PageContainer>
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          Welcome back, {user?.name || "Admin"}
        </h1>
        {user?.role && (
          <span className="font-inter text-xs font-extrabold uppercase tracking-widest text-gold">
            {roleLabel(user.role)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mb-4">
        {/* Core Stats */}
        <StatCard
          label={t("admin.dashboard.statsStudents")}
          value={isLoading ? "—" : (stats?.totalStudents ?? 0)}
          icon={<Users className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label={t("admin.dashboard.statsTeachers")}
          value={isLoading ? "—" : (stats?.totalTeachers ?? 0)}
          icon={<GraduationCap className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label={t("admin.dashboard.statsClasses")}
          value={isLoading ? "—" : (stats?.totalClasses ?? 0)}
          icon={<BookOpen className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/classes")}
        />
        <StatCard
          label="Running now"
          value={isLoading ? "—" : (liveSummary?.liveCount ?? 0)}
          icon={<Activity className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/live-monitor")}
        />
        
        {/* Health Metrics */}
        <StatCard
          label={t("admin.dashboard.attendanceRate")}
          value={stats?.attendanceRate != null ? `${stats.attendanceRate}%` : "—"}
          icon={<Percent className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/attendance")}
        />
        <StatCard
          label={t("admin.dashboard.homeworkCompletion")}
          value={stats?.homeworkCompletion != null ? `${stats.homeworkCompletion}%` : "—"}
          icon={<CheckCircle2 className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/homework")}
        />
        <StatCard
          label={t("admin.dashboard.curriculumAssigned")}
          value={coverage ? `${coverage.studentsWithPrograms}/${coverage.totalStudents}` : "—"}
          icon={<Library className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          onClick={() => navigate("/admin/curriculum")}
        />
        <StatCard
          label="WhatsApp reminders"
          value={waQueue.length}
          icon={<MessageCircle className="text-portal-muted" />}
          iconBg="bg-portal-surface-muted/30"
          hint={waActionable > 0 ? `${waActionable} urgent WhatsApp reminders right now` : "No urgent WhatsApp reminders right now"}
          onClick={() => navigate("/admin/whatsapp-queue")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mb-6">
        {/* Quick Links */}
        <StatCard
          label="Users"
          icon={<Users className="text-primary" />}
          iconBg="bg-primary/5"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label="Payments"
          icon={<CreditCard className="text-gold" />}
          iconBg="bg-gold/5"
          onClick={() => navigate("/admin/payments")}
        />
        <StatCard
          label="Classes"
          icon={<BookOpen className="text-teal" />}
          iconBg="bg-teal/5"
          onClick={() => navigate("/admin/classes")}
        />
        <StatCard
          label="Routine"
          icon={<CalendarDays className="text-amber-500" />}
          iconBg="bg-amber-500/5"
          onClick={() => navigate("/admin/schedule/routine")}
        />
        <StatCard
          label="Live Monitor"
          icon={<Radio className="text-red-500" />}
          iconBg="bg-red-500/5"
          onClick={() => navigate("/admin/live-monitor")}
        />
        <StatCard
          label="Free Class Leads"
          icon={<CalendarCheck className="text-primary-dark" />}
          iconBg="bg-primary-dark/5"
          onClick={() => navigate("/admin/trial-bookings")}
        />
        <StatCard
          label="Contact Inbox"
          icon={<Inbox className="text-blue-500" />}
          iconBg="bg-blue-500/5"
          onClick={() => navigate("/admin/contact-messages")}
        />
        <StatCard
          label="Student Admissions"
          icon={<GraduationCap className="text-violet-500" />}
          iconBg="bg-violet-500/5"
          onClick={() => navigate("/admin/student-admissions")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <AdminDashboardActionPanel items={actionItems} />

        <DashboardSection
          title="Today's classes"
          subtitle="Classes planned for today"
          actionLabel={t("actions.viewAll")}
          onAction={() => navigate("/admin/live-monitor")}
          elevated
          className="h-full rounded-2xl border border-portal bg-white shadow-sm dark:bg-portal-surface"
        >
          {isLoading ? (
            <PageLoading />
          ) : !stats?.todaysClasses?.length ? (
            <EmptyState
              icon={CalendarDays}
              title={t("empty.noClassesToday")}
              description={t("empty.noClassesTodayDesc")}
              actionLabel={t("actions.academyRoutine")}
              onAction={() => navigate("/admin/schedule/routine")}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {stats.todaysClasses.map((session) => (
                <LiveMonitorDashboardCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </DashboardSection>
      </div>
    </PageContainer>
  );
}
