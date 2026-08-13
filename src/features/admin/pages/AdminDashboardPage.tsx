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
  Gift,
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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

const QUICK_LINK_PATHS = [
  { to: "/admin/users", icon: <Users className="size-5 text-primary" /> },
  { to: "/admin/payments", icon: <CreditCard className="size-5 text-primary" /> },
  { to: "/admin/gifts", icon: <Gift className="size-5 text-primary" /> },
  { to: "/admin/resources", icon: <Library className="size-5 text-primary" /> },
  { to: "/admin/classes", icon: <BookOpen className="size-5 text-primary" /> },
  { to: "/admin/schedule/routine", icon: <CalendarDays className="size-5 text-primary" /> },
  { to: "/admin/live-monitor", icon: <Radio className="size-5 text-red-500" /> },
  { to: "/admin/class-logs", icon: <ClipboardCheck className="size-5 text-primary" /> },
  { to: "/admin/trial-bookings", icon: <CalendarCheck className="size-5 text-primary" /> },
  { to: "/admin/contact-messages", icon: <Inbox className="size-5 text-primary" /> },
  { to: "/admin/student-admissions", icon: <GraduationCap className="size-5 text-primary" /> },
  { to: "/admin/teacher-applications", icon: <Briefcase className="size-5 text-primary" /> },
  { to: "/admin/curriculum", icon: <Library className="size-5 text-teal" /> },
  { to: "/admin/blog", icon: <Newspaper className="size-5 text-primary" /> },
  { to: "/admin/testimonials", icon: <MessageSquareQuote className="size-5 text-primary" /> },
] as const;

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { t, nav, locale } = usePortalTranslation();
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

  const enrollmentBars = useMemo(
    () =>
      (["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const).map((month, index) => ({
        month: t(`months.${month}`),
        count: Math.max(
          1,
          Math.floor((stats?.totalStudents ?? 0) * (0.12 + index * 0.016))
        ),
      })),
    [stats?.totalStudents, t, locale]
  );

  const adminQuickLinks = useMemo(
    () =>
      QUICK_LINK_PATHS.map((link) => ({
        label: nav(link.to),
        to: link.to,
        icon: link.icon,
      })),
    [nav, locale]
  );

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

  const liveBadge = liveSummary
    ? liveSummary.liveCount > 0
      ? t("admin.dashboard.liveBadge", { count: String(liveSummary.liveCount) })
      : t("admin.dashboard.todayBadge", { count: String(liveSummary.totalToday) })
    : undefined;

  return (
    <PageContainer>
      <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label={t("admin.dashboard.statsStudents")}
          value={isLoading ? "—" : (stats?.totalStudents ?? 0)}
          icon={<Users className="size-5 text-primary" />}
          iconBg="bg-primary/10"
          hint={
            stats?.activeClasses
              ? t("admin.dashboard.activeClassesHint", {
                  count: String(stats.activeClasses),
                })
              : undefined
          }
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label={t("admin.dashboard.statsTeachers")}
          value={isLoading ? "—" : (stats?.totalTeachers ?? 0)}
          icon={<GraduationCap className="size-5 text-gold" />}
          iconBg="bg-gold/15"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label={t("admin.dashboard.statsClasses")}
          value={isLoading ? "—" : (stats?.totalClasses ?? 0)}
          icon={<BookOpen className="size-5 text-teal" />}
          iconBg="bg-teal/10"
          onClick={() => navigate("/admin/classes")}
        />
        <StatCard
          label={t("admin.dashboard.statsActiveClasses")}
          value={isLoading ? "—" : (stats?.activeClasses ?? 0)}
          icon={<Activity className="size-5 text-primary-dark" />}
          iconBg="bg-bg-light"
          onClick={() => navigate("/admin/classes")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <DashboardSection
            title={t("admin.dashboard.liveMonitor")}
            subtitle={
              liveSummary
                ? t("admin.dashboard.liveSubtitle", {
                    upcoming: String(liveSummary.upcomingCount),
                    total: String(liveSummary.totalToday),
                  })
                : t("admin.dashboard.liveSubtitleFallback")
            }
            badge={liveBadge}
            actionLabel={t("actions.viewAll")}
            onAction={() => navigate("/admin/live-monitor")}
            elevated
            className="h-full rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
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
              label: t("admin.dashboard.attendanceRate"),
              value: stats.attendanceRate != null ? `${stats.attendanceRate}%` : "—",
              icon: <Percent className="size-5" />,
              tone: "teal",
            },
            {
              label: t("admin.dashboard.homeworkCompletion"),
              value:
                stats.homeworkCompletion != null ? `${stats.homeworkCompletion}%` : "—",
              icon: <CheckCircle2 className="size-5" />,
              tone: "gold",
            },
            {
              label: t("admin.dashboard.curriculumAssigned"),
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
            title={t("admin.dashboard.quickAccess")}
            subtitle={t("admin.dashboard.quickAccessSubtitle")}
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
              title={t("admin.dashboard.enrollmentOverview")}
              subtitle={t("admin.dashboard.enrollmentSubtitle")}
              className="rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
            >
              <EnrollmentChart data={enrollmentBars} />
            </DashboardSection>

            {coverage ? (
              <DashboardSection
                title={t("admin.dashboard.curriculumCoverage")}
                actionLabel={t("actions.manage")}
                onAction={() => navigate("/admin/curriculum")}
                className="rounded-2xl border border-portal shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]"
              >
                <ul className="space-y-2 text-sm text-portal-muted">
                  <li>
                    {t("admin.dashboard.studentsWithPrograms", {
                      withPrograms: String(coverage.studentsWithPrograms),
                      total: String(coverage.totalStudents),
                    })}
                  </li>
                  {coverage.progressMissingProgram > 0 ? (
                    <li className="text-amber-700">
                      {t("admin.dashboard.progressMissingProgram", {
                        count: String(coverage.progressMissingProgram),
                      })}
                    </li>
                  ) : null}
                  {coverage.logsMissingProgram > 0 ? (
                    <li className="text-amber-700">
                      {t("admin.dashboard.logsMissingProgram", {
                        count: String(coverage.logsMissingProgram),
                      })}
                    </li>
                  ) : null}
                </ul>
              </DashboardSection>
            ) : null}

            <QuickActionGrid
              columns={2}
              actions={[
                {
                  label: nav("/admin/attendance"),
                  icon: <ClipboardList className="size-5 text-teal-600" />,
                  iconBg: "bg-teal/10",
                  onClick: () => navigate("/admin/attendance"),
                },
                {
                  label: nav("/admin/progress"),
                  icon: <BarChart3 className="size-5 text-primary" />,
                  iconBg: "bg-primary/10",
                  onClick: () => navigate("/admin/progress"),
                },
                {
                  label: nav("/admin/earnings"),
                  icon: <Banknote className="size-5 text-gold" />,
                  iconBg: "bg-gold/15",
                  onClick: () => navigate("/admin/earnings"),
                },
                {
                  label: nav("/admin/homework"),
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
