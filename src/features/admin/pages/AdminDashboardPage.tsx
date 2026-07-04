import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  BarChart3,
  ClipboardList,
  Newspaper,
  CalendarDays,
  Banknote,
  ClipboardCheck,
  CalendarCheck,
  Inbox,
  Briefcase,
  BookOpenCheck,
  Library,
  CreditCard,
  MessageCircle,
  Percent,
  CheckCircle2,
  Radio,
  MessageSquareQuote,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStats, useAdminWhatsAppQueue } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/shared/StatCard";
import { EnrollmentChart } from "@/components/ui/shared/EnrollmentChart";
import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTwoColumn } from "@/components/dashboard/DashboardTwoColumn";
import { AlertActionCard } from "@/components/dashboard/AlertActionCard";
import { HealthMetricRow } from "@/components/dashboard/HealthMetricRow";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { LiveMonitorBanner } from "@/features/admin/components/liveMonitor/LiveMonitorBanner";
import { LiveMonitorDashboardCard } from "@/features/admin/components/liveMonitor/LiveMonitorDashboardCard";

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAdminStats();
  const { data: waQueue = [] } = useAdminWhatsAppQueue();
  const waActionable = waQueue.filter((i) => i.category !== "missing_whatsapp").length;

  const pending = stats?.pendingActions;
  const coverage = stats?.curriculumCoverage;
  const liveSummary = stats?.liveSummary;
  const pendingPayments = pending?.pendingPayments ?? 0;
  const pendingLogs = pending?.pendingClassLogs ?? 0;
  const pendingRequests = pending?.pendingStudentRequests ?? 0;
  const newTrials = pending?.newTrials ?? 0;
  const newContacts = pending?.newContacts ?? 0;
  const newAdmissions = pending?.newStudentAdmissions ?? 0;
  const newTeacherApps = pending?.newTeacherApplications ?? 0;

  const hasPending =
    pendingLogs > 0 ||
    pendingRequests > 0 ||
    newTrials > 0 ||
    newContacts > 0 ||
    newAdmissions > 0 ||
    newTeacherApps > 0 ||
    pendingPayments > 0;

  const enrollmentBars = [
    { month: "Jan", count: Math.max(1, Math.floor((stats?.totalStudents ?? 0) * 0.12)) },
    { month: "Feb", count: Math.max(1, Math.floor((stats?.totalStudents ?? 0) * 0.14)) },
    { month: "Mar", count: Math.max(1, Math.floor((stats?.totalStudents ?? 0) * 0.16)) },
    { month: "Apr", count: Math.max(1, Math.floor((stats?.totalStudents ?? 0) * 0.18)) },
    { month: "May", count: Math.max(1, Math.floor((stats?.totalStudents ?? 0) * 0.2)) },
    { month: "Jun", count: Math.max(1, Math.floor((stats?.totalStudents ?? 0) * 0.2)) },
  ];

  const adminQuickLinks = [
    { label: "Users", to: "/admin/users", icon: <Users className="size-5 text-primary" /> },
    { label: "Payments", to: "/admin/payments", icon: <CreditCard className="size-5 text-primary" /> },
    { label: "Resources", to: "/admin/resources", icon: <Library className="size-5 text-primary" /> },
    { label: "Classes", to: "/admin/classes", icon: <BookOpen className="size-5 text-primary" /> },
    { label: "Routine", to: "/admin/schedule/routine", icon: <CalendarDays className="size-5 text-primary" /> },
    { label: "Live monitor", to: "/admin/live-monitor", icon: <Radio className="size-5 text-red-500" /> },
    { label: "Class logs", to: "/admin/class-logs", icon: <ClipboardCheck className="size-5 text-primary" /> },
    { label: "Trial leads", to: "/admin/trial-bookings", icon: <CalendarCheck className="size-5 text-primary" /> },
    { label: "Contact inbox", to: "/admin/contact-messages", icon: <Inbox className="size-5 text-primary" /> },
    { label: "Admissions", to: "/admin/student-admissions", icon: <GraduationCap className="size-5 text-primary" /> },
    { label: "Teacher apps", to: "/admin/teacher-applications", icon: <Briefcase className="size-5 text-primary" /> },
    { label: "Curriculum", to: "/admin/curriculum", icon: <Library className="size-5 text-teal" /> },
    { label: "Blog CMS", to: "/admin/blog", icon: <Newspaper className="size-5 text-primary" /> },
    { label: "Reviews", to: "/admin/testimonials", icon: <MessageSquareQuote className="size-5 text-primary" /> },
  ];

  return (
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      <DashboardHero
        eyebrow="BDOQ Academy administration"
        name={user?.name ?? "Admin"}
        subtitle={BDOQ_BRAND.tagline}
        dateLabel={todayLabel()}
        roleBadge="Admin"
      />

      <div className="rounded-2xl border border-[#25D366]/25 bg-gradient-to-r from-[#25D366]/8 to-teal/5 p-4 shadow-sm dark:border-[#25D366]/35 dark:from-[#25D366]/15 dark:to-teal/10 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 size-5 shrink-0 text-[#128C7E]" aria-hidden />
            <div>
              <p className="font-semibold text-portal-heading">WhatsApp message queue</p>
              <p className="text-sm text-portal-muted">
                {waActionable > 0
                  ? `${waActionable} ready-to-send reminder${waActionable === 1 ? "" : "s"}`
                  : "No urgent WhatsApp messages right now"}
                {waQueue.some((i) => i.category === "missing_whatsapp")
                  ? ` · ${waQueue.filter((i) => i.category === "missing_whatsapp").length} users need numbers`
                  : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/whatsapp-queue")}
            className="shrink-0 rounded-xl bg-[#128C7E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0e6b60]"
          >
            Open queue →
          </button>
        </div>
      </div>

      {liveSummary ? (
        <LiveMonitorBanner
          summary={liveSummary}
          compact
          onOpenMonitor={() => navigate("/admin/live-monitor")}
        />
      ) : null}

      {hasPending ? (
        <DashboardSection title="Action required" subtitle="Review these items first">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {newContacts > 0 ? (
              <AlertActionCard
                tone="blue"
                title={`${newContacts} new contact message${newContacts === 1 ? "" : "s"}`}
                actionLabel="Open inbox"
                onAction={() => navigate("/admin/contact-messages")}
              />
            ) : null}
            {newTrials > 0 ? (
              <AlertActionCard
                tone="amber"
                title={`${newTrials} new trial lead${newTrials === 1 ? "" : "s"}`}
                actionLabel="Review trial bookings"
                onAction={() => navigate("/admin/trial-bookings")}
              />
            ) : null}
            {newAdmissions > 0 ? (
              <AlertActionCard
                tone="violet"
                title={`${newAdmissions} new admission${newAdmissions === 1 ? "" : "s"}`}
                actionLabel="Review admissions"
                onAction={() => navigate("/admin/student-admissions")}
              />
            ) : null}
            {newTeacherApps > 0 ? (
              <AlertActionCard
                tone="indigo"
                title={`${newTeacherApps} teacher application${newTeacherApps === 1 ? "" : "s"}`}
                actionLabel="Review applications"
                onAction={() => navigate("/admin/teacher-applications")}
              />
            ) : null}
            {pendingPayments > 0 ? (
              <AlertActionCard
                tone="emerald"
                title={`${pendingPayments} payment proof${pendingPayments === 1 ? "" : "s"} to review`}
                actionLabel="Review payments"
                onAction={() => navigate("/admin/payments")}
              />
            ) : null}
            {pendingLogs > 0 ? (
              <AlertActionCard
                tone="amber"
                title={`${pendingLogs} class log${pendingLogs === 1 ? "" : "s"} pending`}
                actionLabel="Review class logs"
                onAction={() => navigate("/admin/class-logs")}
              />
            ) : null}
            {pendingRequests > 0 ? (
              <AlertActionCard
                tone="neutral"
                title={`${pendingRequests} student request${pendingRequests === 1 ? "" : "s"}`}
                actionLabel="View requests"
                onAction={() => navigate("/admin/student-requests")}
              />
            ) : null}
          </div>
        </DashboardSection>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Students"
          value={isLoading ? "—" : (stats?.totalStudents ?? 0)}
          icon={<Users className="size-5 text-primary" />}
          iconBg="bg-primary/10"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label="Teachers"
          value={isLoading ? "—" : (stats?.totalTeachers ?? 0)}
          icon={<GraduationCap className="size-5 text-gold" />}
          iconBg="bg-gold/15"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label="Classes"
          value={isLoading ? "—" : (stats?.totalClasses ?? 0)}
          icon={<BookOpen className="size-5 text-teal" />}
          iconBg="bg-teal/10"
          onClick={() => navigate("/admin/classes")}
        />
        <StatCard
          label="Active classes"
          value={isLoading ? "—" : (stats?.activeClasses ?? 0)}
          icon={<Activity className="size-5 text-primary-dark" />}
          iconBg="bg-bg-light"
          onClick={() => navigate("/admin/classes")}
        />
      </div>

      {stats ? (
        <HealthMetricRow
          metrics={[
            {
              label: "Attendance rate",
              value: stats.attendanceRate != null ? `${stats.attendanceRate}%` : "—",
              icon: <Percent className="size-5" />,
              tone: "teal",
            },
            {
              label: "Homework completion",
              value:
                stats.homeworkCompletion != null ? `${stats.homeworkCompletion}%` : "—",
              icon: <CheckCircle2 className="size-5" />,
              tone: "gold",
            },
            {
              label: "Curriculum assigned",
              value: coverage
                ? `${coverage.studentsWithPrograms}/${coverage.totalStudents}`
                : "—",
              icon: <Library className="size-5" />,
              tone: "primary",
            },
          ]}
        />
      ) : null}

      <DashboardTwoColumn
        main={
          <>
            <DashboardSection
              title="Today's classes"
              badge={
                isLoading
                  ? "…"
                  : `${liveSummary?.totalToday ?? stats?.todaysClasses?.length ?? 0} scheduled`
              }
              actionLabel="Live monitor"
              onAction={() => navigate("/admin/live-monitor")}
              elevated
            >
              {isLoading ? (
                <PageLoading />
              ) : !stats?.todaysClasses?.length ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No classes today"
                  description="Check academy routine or assign students to classes."
                  actionLabel="Academy routine"
                  onAction={() => navigate("/admin/schedule/routine")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {stats.todaysClasses.map((session) => (
                    <LiveMonitorDashboardCard key={session._id} session={session} />
                  ))}
                </div>
              )}
            </DashboardSection>

            <DashboardSection title="Quick links" subtitle="Jump to admin tools">
              <QuickActionGrid
                columns={3}
                actions={adminQuickLinks.map((link) => ({
                  label: link.label,
                  icon: link.icon,
                  iconBg: "bg-primary/10",
                  onClick: () => navigate(link.to),
                }))}
              />
            </DashboardSection>
          </>
        }
        aside={
          <>
            <DashboardSection
              title="Enrollment overview"
              subtitle="Estimated from active roster"
            >
              <EnrollmentChart data={enrollmentBars} />
            </DashboardSection>

            {coverage ? (
              <DashboardSection
                title="Curriculum coverage"
                actionLabel="Manage"
                onAction={() => navigate("/admin/curriculum")}
              >
                <ul className="space-y-2 text-sm text-portal-muted">
                  <li>
                    {coverage.studentsWithPrograms}/{coverage.totalStudents} students with
                    programs
                  </li>
                  {coverage.progressMissingProgram > 0 ? (
                    <li className="text-amber-700">
                      {coverage.progressMissingProgram} progress record
                      {coverage.progressMissingProgram === 1 ? "" : "s"} missing program
                    </li>
                  ) : null}
                  {coverage.logsMissingProgram > 0 ? (
                    <li className="text-amber-700">
                      {coverage.logsMissingProgram} class log
                      {coverage.logsMissingProgram === 1 ? "" : "s"} missing program
                    </li>
                  ) : null}
                </ul>
              </DashboardSection>
            ) : null}

            <QuickActionGrid
              columns={2}
              actions={[
                {
                  label: "Attendance",
                  icon: <ClipboardList className="size-5 text-teal-600" />,
                  iconBg: "bg-teal/10",
                  onClick: () => navigate("/admin/attendance"),
                },
                {
                  label: "Progress",
                  icon: <BarChart3 className="size-5 text-primary" />,
                  iconBg: "bg-primary/10",
                  onClick: () => navigate("/admin/progress"),
                },
                {
                  label: "Earnings",
                  icon: <Banknote className="size-5 text-gold" />,
                  iconBg: "bg-gold/15",
                  onClick: () => navigate("/admin/earnings"),
                },
                {
                  label: "Homework",
                  icon: <BookOpenCheck className="size-5 text-primary-dark" />,
                  iconBg: "bg-bg-light",
                  onClick: () => navigate("/admin/homework"),
                },
              ]}
            />
          </>
        }
      />
    </PageContainer>
  );
}
