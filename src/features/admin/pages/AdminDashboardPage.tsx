import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  ClipboardList,
  Newspaper,
  CalendarDays,
  UserPlus,
  Banknote,
  ClipboardCheck,
  CalendarCheck,
  Inbox,
  BookOpenCheck,
  TrendingUp,
  Flag,
  Library,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAdminStats } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { classTitle, teacherName, studentCount } from "@/lib/utils/class";

import { PageLoading } from "@/components/ui/PageLoading";

export function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAdminStats();

  const pending = stats?.pendingActions;
  const coverage = stats?.curriculumCoverage;
  const pendingPayments = pending?.pendingPayments ?? 0;
  const pendingLogs = pending?.pendingClassLogs ?? 0;
  const pendingRequests = pending?.pendingStudentRequests ?? 0;
  const newTrials = pending?.newTrials ?? 0;
  const newContacts = pending?.newContacts ?? 0;
  const newConcerns = pending?.newConcernReports ?? 0;

  const kpis = [
    {
      label: "Students",
      value: stats?.totalStudents ?? 0,
      icon: <Users className="size-5 text-[#2b7fff]" />,
      bg: "bg-[#2b7fff]/10",
    },
    {
      label: "Teachers",
      value: stats?.totalTeachers ?? 0,
      icon: <GraduationCap className="size-5 text-[#C4922B]" />,
      bg: "bg-[#FDF3E0]",
    },
    {
      label: "Classes",
      value: stats?.totalClasses ?? 0,
      icon: <BookOpen className="size-5 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Active",
      value: stats?.activeClasses ?? 0,
      icon: <Activity className="size-5 text-purple-600" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <PageContainer className="flex flex-col gap-6 lg:gap-8">
      <div>
        <span className="text-sm text-zinc-500">Administration</span>
        <h1 className="font-display text-2xl font-bold text-[#03214F] lg:text-3xl">
          {user?.name ?? "Admin"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Academy executive overview</p>
      </div>

      {(pendingLogs > 0 ||
        pendingRequests > 0 ||
        newTrials > 0 ||
        newContacts > 0 ||
        newConcerns > 0 ||
        pendingPayments > 0) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {newConcerns > 0 ? (
            <Card className="rounded-2xl border-0 bg-red-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-red-900">
                {newConcerns} new concern report{newConcerns === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/concern-reports")}
                className="mt-2 text-sm font-semibold text-[#03214F]"
              >
                Review reports →
              </button>
            </Card>
          ) : null}
          {newContacts > 0 ? (
            <Card className="rounded-2xl border-0 bg-blue-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-blue-900">
                {newContacts} new contact message{newContacts === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/contact-messages")}
                className="mt-2 text-sm font-semibold text-[#03214F]"
              >
                Open inbox →
              </button>
            </Card>
          ) : null}
          {newTrials > 0 ? (
            <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">
                {newTrials} new trial lead{newTrials === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/trial-bookings")}
                className="mt-2 text-sm font-semibold text-[#C4922B]"
              >
                Review trial bookings →
              </button>
            </Card>
          ) : null}
          {pendingPayments > 0 ? (
            <Card className="rounded-2xl border-0 bg-emerald-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-emerald-900">
                {pendingPayments} payment proof{pendingPayments === 1 ? "" : "s"} to review
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/payments")}
                className="mt-2 text-sm font-semibold text-[#03214F]"
              >
                Review payments →
              </button>
            </Card>
          ) : null}
          {pendingLogs > 0 ? (
            <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">
                {pendingLogs} class log{pendingLogs === 1 ? "" : "s"} pending
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/class-logs")}
                className="mt-2 text-sm font-semibold text-[#C4922B]"
              >
                Review approvals →
              </button>
            </Card>
          ) : null}
          {pendingRequests > 0 ? (
            <Card className="rounded-2xl border-0 bg-[#F8FAFF] p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#03214F]">
                {pendingRequests} student request{pendingRequests === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin/student-requests")}
                className="mt-2 text-sm font-semibold text-[#C4922B]"
              >
                View inbox →
              </button>
            </Card>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="flex flex-col gap-2 rounded-2xl border-0 p-4 shadow-sm">
            <div className={`flex size-9 items-center justify-center rounded-xl ${k.bg}`}>
              {k.icon}
            </div>
            <span className="text-2xl font-bold text-[#03214F]">
              {isLoading ? "—" : k.value}
            </span>
            <span className="text-xs text-zinc-400">{k.label}</span>
          </Card>
        ))}
      </div>

      {coverage ? (
        <Card className="rounded-2xl border-0 p-4 shadow-sm">
          <p className="text-sm font-bold text-[#03214F]">Curriculum coverage</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600">
            <li>
              {coverage.studentsWithPrograms}/{coverage.totalStudents} students with assigned
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
          <button
            type="button"
            onClick={() => navigate("/admin/curriculum")}
            className="mt-3 text-sm font-semibold text-[#C4922B]"
          >
            Manage curriculum →
          </button>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#03214F]">Today's Classes</span>
              <button
                onClick={() => navigate("/admin/classes")}
                className="text-xs font-semibold text-[#C4922B]"
              >
                View all
              </button>
            </div>
            {isLoading ? (
              <PageLoading />
            ) : !stats?.todaysClasses?.length ? (
              <p className="text-sm text-zinc-400">No classes scheduled today.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {stats.todaysClasses.map((cls) => (
                  <button
                    key={cls._id}
                    onClick={() => navigate(`/admin/classes/${cls._id}`)}
                    className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-left transition hover:border-[#03214F]/20"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#03214F]">
                        {classTitle(cls)}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {teacherName(
                          typeof cls.teacher === "object" ? cls.teacher : undefined
                        )}{" "}
                        · {studentCount(cls)} students
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-zinc-300" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Manage Users", to: "/admin/users", icon: Users },
              { label: "Payments", to: "/admin/payments", icon: CreditCard },
              { label: "Curriculum", to: "/admin/curriculum", icon: Library },
              { label: "Manage Classes", to: "/admin/classes", icon: BookOpen },
              { label: "Academy Routine", to: "/admin/schedule/routine", icon: CalendarDays },
              { label: "Class Logs", to: "/admin/class-logs", icon: ClipboardCheck },
              { label: "Trial Bookings", to: "/admin/trial-bookings", icon: CalendarCheck },
              { label: "Contact Messages", to: "/admin/contact-messages", icon: Inbox },
              { label: "Student Requests", to: "/admin/student-requests", icon: UserPlus },
              { label: "Homework", to: "/admin/homework", icon: BookOpenCheck },
              { label: "Monthly Progress", to: "/admin/monthly-progress", icon: TrendingUp },
              { label: "Earnings", to: "/admin/earnings", icon: Banknote },
              { label: "Attendance", to: "/admin/attendance", icon: ClipboardList },
              { label: "Progress", to: "/admin/progress", icon: BarChart3 },
              { label: "Student Care", to: "/admin/student-care", icon: ShieldAlert },
              { label: "Concern Reports", to: "/admin/concern-reports", icon: Flag },
              { label: "Blog", to: "/admin/blog", icon: Newspaper },
            ].map((a) => (
              <button
                key={a.to}
                onClick={() => navigate(a.to)}
                className="flex flex-col gap-2 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <a.icon className="size-5 text-[#03214F]" />
                <span className="text-sm font-semibold text-[#03214F]">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Card className="flex flex-col gap-4 rounded-3xl border-0 p-6 shadow-sm">
          <span className="text-base font-bold text-[#03214F]">Student Care Alerts</span>
          <p className="text-sm text-zinc-500">
            Attendance, homework, and progress flags load on the Student Care page.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/student-care")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C4922B]"
          >
            <ShieldAlert className="size-4" />
            Open Student Care →
          </button>
        </Card>
      </div>
    </PageContainer>
  );
}
