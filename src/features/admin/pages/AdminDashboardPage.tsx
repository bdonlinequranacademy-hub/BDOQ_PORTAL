import { useMemo } from "react";
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
  MessageSquareQuote,
  Percent,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { useAdminStats, useAdminWhatsAppQueue } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/shared/StatCard";
import { EnrollmentChart } from "@/components/ui/shared/EnrollmentChart";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardTwoColumn } from "@/components/dashboard/DashboardTwoColumn";
import { HealthMetricRow } from "@/components/dashboard/HealthMetricRow";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { LiveMonitorDashboardCard } from "@/features/admin/components/liveMonitor/LiveMonitorDashboardCard";
import { AdminDashboardWhatsAppStrip } from "@/features/admin/components/dashboard/AdminDashboardWhatsAppStrip";
import {
  AdminDashboardActionPanel,
  type IAdminDashboardActionItem,
} from "@/features/admin/components/dashboard/AdminDashboardActionPanel";

export function AdminDashboardPage() {
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

  const actionItems = useMemo(() => {
    const items: IAdminDashboardActionItem[] = [];

    if (newContacts > 0) {
      items.push({
        id: "contacts",
        title: `${newContacts} new contact message${newContacts === 1 ? "" : "s"}`,
        actionLabel: "Open inbox",
        onAction: () => navigate("/admin/contact-messages"),
        accent: "sky",
      });
    }
    if (newTrials > 0) {
      items.push({
        id: "trials",
        title: `${newTrials} new trial lead${newTrials === 1 ? "" : "s"}`,
        actionLabel: "Review trial bookings",
        onAction: () => navigate("/admin/trial-bookings"),
        accent: "amber",
      });
    }
    if (newAdmissions > 0) {
      items.push({
        id: "admissions",
        title: `${newAdmissions} new admission${newAdmissions === 1 ? "" : "s"}`,
        actionLabel: "Review admissions",
        onAction: () => navigate("/admin/student-admissions"),
        accent: "violet",
      });
    }
    if (newTeacherApps > 0) {
      items.push({
        id: "teacher-apps",
        title: `${newTeacherApps} teacher application${newTeacherApps === 1 ? "" : "s"}`,
        actionLabel: "Review applications",
        onAction: () => navigate("/admin/teacher-applications"),
        accent: "violet",
      });
    }
    if (pendingPayments > 0) {
      items.push({
        id: "payments",
        title: `${pendingPayments} payment proof${pendingPayments === 1 ? "" : "s"} to review`,
        actionLabel: "Review payments",
        onAction: () => navigate("/admin/payments"),
        accent: "primary",
      });
    }
    if (pendingLogs > 0) {
      items.push({
        id: "class-logs",
        title: `${pendingLogs} class log${pendingLogs === 1 ? "" : "s"} pending`,
        actionLabel: "Review class logs",
        onAction: () => navigate("/admin/class-logs"),
        accent: "amber",
      });
    }
    if (pendingRequests > 0) {
      items.push({
        id: "student-requests",
        title: `${pendingRequests} student request${pendingRequests === 1 ? "" : "s"}`,
        actionLabel: "View requests",
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
    pendingRequests,
  ]);

  const liveBadge = liveSummary
    ? liveSummary.liveCount > 0
      ? `${liveSummary.liveCount} live`
      : `${liveSummary.totalToday} today`
    : undefined;

  return (
    <PageContainer className="flex flex-col gap-5 lg:gap-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Students"
          value={isLoading ? "—" : (stats?.totalStudents ?? 0)}
          icon={<Users className="size-5 text-primary" />}
          iconBg="bg-primary/10"
          hint={stats?.activeClasses ? `${stats.activeClasses} active classes` : undefined}
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <DashboardSection
            title="Live monitor"
            subtitle={
              liveSummary
                ? `${liveSummary.upcomingCount} upcoming · ${liveSummary.totalToday} total today`
                : "Today's scheduled sessions"
            }
            badge={liveBadge}
            actionLabel="View all"
            onAction={() => navigate("/admin/live-monitor")}
            elevated
            className="h-full rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
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
        </div>

        <AdminDashboardActionPanel items={actionItems} />
      </div>

      <AdminDashboardWhatsAppStrip
        queue={waQueue}
        actionableCount={waActionable}
        onOpenQueue={() => navigate("/admin/whatsapp-queue")}
      />

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
          <DashboardSection
            title="Quick access"
            subtitle="Jump to admin tools"
            className="rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
          >
            <QuickActionGrid
              columns={4}
              actions={adminQuickLinks.map((link) => ({
                label: link.label,
                icon: link.icon,
                iconBg: "bg-primary/10",
                onClick: () => navigate(link.to),
              }))}
            />
          </DashboardSection>
        }
        aside={
          <>
            <DashboardSection
              title="Enrollment overview"
              subtitle="Estimated from active roster"
              className="rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
            >
              <EnrollmentChart data={enrollmentBars} />
            </DashboardSection>

            {coverage ? (
              <DashboardSection
                title="Curriculum coverage"
                actionLabel="Manage"
                onAction={() => navigate("/admin/curriculum")}
                className="rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
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
