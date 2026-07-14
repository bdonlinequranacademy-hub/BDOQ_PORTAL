import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Wallet,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";
import type { AdminStudentProfileDetail } from "@/types/models";

interface IAdminStudentProfileViewProps {
  data: AdminStudentProfileDetail;
  onEdit: () => void;
  onDeactivate?: () => void;
}

type TabId = "overview" | "classes" | "learning" | "finance";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "classes", label: "Classes & Teachers" },
  { id: "learning", label: "Learning Activity" },
  { id: "finance", label: "Billing & Certificates" },
];

function formatJoined(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function AdminStudentProfileView({
  data,
  onEdit,
  onDeactivate,
}: IAdminStudentProfileViewProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const {
    user,
    stats,
    classes,
    progress,
    recentAttendance,
    homework,
    billing,
    recentPayments,
    certificates,
  } = data;

  const waUrl = user.whatsapp ? waMeUrlFromRaw(user.whatsapp, user.country) : null;

  const statCards = [
    { label: "Active Classes", value: String(stats.activeClasses), icon: BookOpen },
    {
      label: "Attendance",
      value: stats.attendanceRate != null ? `${stats.attendanceRate}%` : "—",
      icon: CheckCircle2,
    },
    { label: "HW Done", value: String(stats.submittedHomework), icon: ClipboardList },
    { label: "HW Pending", value: String(stats.pendingHomework), icon: Clock },
    {
      label: "Certificates",
      value: String(stats.certificatesCount),
      icon: Award,
    },
    {
      label: "Payments",
      value: String(stats.paymentsCount),
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-5">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-portal-muted transition hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Users
      </Link>

      <section className="overflow-hidden rounded-3xl border border-portal shadow-[0_12px_40px_-24px_rgba(38,155,111,0.45)]">
        <div className="relative h-[300px] w-full bg-[#0b2418] sm:h-[320px]">
          <img
            src="/images/profile-cover.png"
            alt=""
            className="absolute inset-0 size-full select-none object-cover object-center"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/20"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-sm font-semibold tracking-wide text-white/90">
                Student Profile · Full dossier
              </p>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                <Pencil className="size-3.5" aria-hidden />
                Edit Profile
              </button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
              <div className="relative shrink-0 self-start sm:self-end">
                <div className="rounded-full bg-white p-1 shadow-lg">
                  <UserAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    gender={user.gender}
                    size="xl"
                    shape="circle"
                    className="!size-24 !text-2xl sm:!size-28"
                  />
                </div>
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow",
                    user.isActive !== false ? "bg-primary" : "bg-red-500"
                  )}
                >
                  {user.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-1 text-white">
                <h1 className="font-display text-2xl font-bold drop-shadow sm:text-3xl">
                  {user.name}
                </h1>
                <p className="mt-1 text-sm text-white/85">
                  {user.studentId ? `ID: ${user.studentId}` : "Student"}
                  {user.gender
                    ? ` · ${user.gender === "female" ? "Female" : "Male"}`
                    : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/80 sm:text-sm">
                  {user.country ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {formatCountryWithFlag(user.country)}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{user.email}</span>
                  </span>
                  {user.whatsapp ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5 shrink-0" aria-hidden />
                      {user.whatsapp}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 shrink-0" aria-hidden />
                    Joined {formatJoined(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-portal-muted">
                  {label}
                </p>
                <p className="mt-1 truncate text-lg font-bold text-portal-heading">{value}</p>
              </div>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-dark">
                <Icon className="size-4" aria-hidden />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-portal pb-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-[8px] px-4 py-2 text-sm font-semibold transition",
              tab === item.id
                ? "bg-primary text-white shadow-sm"
                : "border border-portal bg-portal-surface text-portal-muted hover:border-primary/30 hover:text-primary-dark"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              Account identity
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                ["Name", user.name],
                ["Student ID", user.studentId || "—"],
                ["Email", user.email],
                ["Gender", user.gender || "—"],
                ["Country", user.country ? formatCountryWithFlag(user.country) : "—"],
                ["WhatsApp", user.whatsapp || "—"],
                ["Timezone", user.timezone || "Asia/Dhaka"],
                ["Auth", user.authProvider || "local"],
                ["Email verified", user.emailVerified ? "Yes" : "No"],
                ["Status", user.isActive !== false ? "Active" : "Inactive"],
                ["Joined", formatJoined(user.createdAt)],
                ["On platform", `${stats.yearsOnPlatform} yr(s)`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-portal-muted">
                    {label}
                  </dt>
                  <dd className="mt-0.5 font-medium capitalize text-portal-heading">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              Curriculum assignments
            </h2>
            {(user.curriculumAssignments?.length ?? 0) > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {user.curriculumAssignments?.map((a) => (
                  <span
                    key={`${a.programId}-${a.unitId ?? ""}-${a.topicId ?? ""}`}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark"
                  >
                    {a.programId}
                    {a.unitId ? ` / ${a.unitId}` : ""}
                    {a.topicId ? ` / ${a.topicId}` : ""}
                    {a.completed ? " ✓" : ""}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-portal-muted">No curriculum assigned yet.</p>
            )}

            <h3 className="mb-2 mt-6 text-sm font-semibold text-primary-dark">
              Attendance snapshot
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-xl bg-primary-light/40 p-3">
                <p className="text-xs text-portal-muted">Present</p>
                <p className="text-lg font-bold text-primary-dark">
                  {stats.attendancePresent}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs text-portal-muted">Late</p>
                <p className="text-lg font-bold text-amber-700">{stats.attendanceLate}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-xs text-portal-muted">Absent</p>
                <p className="text-lg font-bold text-red-600">{stats.attendanceAbsent}</p>
              </div>
              <div className="rounded-xl bg-portal-muted/30 p-3">
                <p className="text-xs text-portal-muted">Total</p>
                <p className="text-lg font-bold text-portal-heading">
                  {stats.attendanceTotal}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Message Student
                </a>
              ) : null}
              {onDeactivate && user.isActive !== false ? (
                <button
                  type="button"
                  onClick={onDeactivate}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Deactivate Account
                </button>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {tab === "classes" ? (
        <section className="rounded-2xl border border-portal bg-portal-surface p-5">
          <h2 className="font-display text-lg font-semibold text-primary-dark">
            Enrolled Classes ({classes.length})
          </h2>
          {classes.length === 0 ? (
            <p className="mt-3 text-sm text-portal-muted">Not enrolled in any class.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {classes.map((cls) => (
                <li
                  key={cls._id}
                  className="rounded-xl border border-portal px-4 py-3 transition hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/admin/classes/${cls._id}`}
                        className="font-semibold text-portal-heading hover:text-primary"
                      >
                        {cls.title}
                      </Link>
                      <p className="mt-1 text-xs text-portal-muted">
                        Teacher:{" "}
                        {cls.teacher ? (
                          <Link
                            to={`/admin/users/${cls.teacher._id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {cls.teacher.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                        {cls.schedule
                          ? ` · ${cls.schedule.day} ${cls.schedule.time}`
                          : ""}
                      </p>
                      {cls.teacher?.email || cls.teacher?.whatsapp ? (
                        <p className="mt-1 text-xs text-portal-muted">
                          {cls.teacher.email}
                          {cls.teacher.whatsapp ? ` · ${cls.teacher.whatsapp}` : ""}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        cls.isActive
                          ? "bg-primary/15 text-primary-dark"
                          : "bg-red-50 text-red-600"
                      )}
                    >
                      {cls.isActive ? "Active" : "Off"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === "learning" ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Attendance
              </h2>
              <Link
                to="/admin/attendance"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Open →
              </Link>
            </div>
            {recentAttendance.length === 0 ? (
              <p className="text-sm text-portal-muted">No attendance records.</p>
            ) : (
              <ul className="space-y-2">
                {recentAttendance.map((a) => (
                  <li
                    key={a._id}
                    className="flex items-center justify-between rounded-xl border border-portal px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-portal-heading">{a.classTitle}</p>
                      <p className="text-xs text-portal-muted">{formatJoined(a.date)}</p>
                    </div>
                    <span className="text-xs font-bold uppercase text-portal-muted">
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Progress
              </h2>
              <Link
                to="/admin/progress"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Open →
              </Link>
            </div>
            {progress.length === 0 ? (
              <p className="text-sm text-portal-muted">No progress records.</p>
            ) : (
              <ul className="space-y-2.5">
                {progress.map((p) => (
                  <li key={p._id} className="rounded-xl border border-portal px-3 py-2.5">
                    <p className="text-sm font-semibold text-portal-heading">
                      {p.classTitle || p.curriculumProgram || "Progress"}
                    </p>
                    <p className="mt-1 text-xs text-portal-muted">
                      Tajweed {p.tajweedScore ?? "—"} · Ayahs {p.memorizedAyahs}
                      {p.surahs.length ? ` · ${p.surahs.join(", ")}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Homework
              </h2>
              <Link
                to="/admin/homework"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Open →
              </Link>
            </div>
            {homework.length === 0 ? (
              <p className="text-sm text-portal-muted">No homework yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {homework.map((hw) => (
                  <li key={hw._id} className="rounded-xl border border-portal px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-portal-heading">{hw.title}</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                          hw.submitted
                            ? "bg-primary/15 text-primary-dark"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {hw.submitted ? "Done" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-portal-muted">
                      {hw.classTitle} · {hw.teacherName} · Due {formatJoined(hw.dueDate)}
                      {hw.grade ? ` · Grade ${hw.grade}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}

      {tab === "finance" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Billing & Payments
              </h2>
              <Link
                to="/admin/payments"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Open →
              </Link>
            </div>
            {billing ? (
              <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">Monthly fee</p>
                  <p className="font-semibold text-portal-heading">
                    {formatMoney(billing.monthlyFee, billing.currency)}
                  </p>
                </div>
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">Due day</p>
                  <p className="font-semibold text-portal-heading">{billing.dueDay}</p>
                </div>
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">Paid until</p>
                  <p className="font-semibold text-portal-heading">
                    {formatJoined(billing.paidUntil)}
                  </p>
                </div>
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">Billing status</p>
                  <p className="font-semibold text-portal-heading">
                    {billing.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-sm text-portal-muted">No billing setup yet.</p>
            )}

            {recentPayments.length === 0 ? (
              <p className="text-sm text-portal-muted">No payments recorded.</p>
            ) : (
              <ul className="space-y-2">
                {recentPayments.map((p) => (
                  <li
                    key={p._id}
                    className="flex items-center justify-between rounded-xl border border-portal px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-portal-heading">
                        {formatMoney(p.amount, p.currency)}
                      </p>
                      <p className="text-xs text-portal-muted">
                        {formatJoined(p.createdAt)}
                        {p.method ? ` · ${p.method}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-bold uppercase text-portal-muted">
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Certificates
              </h2>
              <Link
                to="/admin/certificates"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Open →
              </Link>
            </div>
            {certificates.length === 0 ? (
              <p className="text-sm text-portal-muted">No certificates issued yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {certificates.map((c) => (
                  <li key={c._id} className="rounded-xl border border-portal px-3 py-3">
                    <p className="text-sm font-semibold text-portal-heading">
                      {c.courseName}
                    </p>
                    <p className="mt-1 text-xs text-portal-muted">
                      {c.certificateId} · Grade {c.grade} · Issued{" "}
                      {formatJoined(c.issueDate)}
                    </p>
                    <Link
                      to={`/admin/certificates/${c._id}`}
                      className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline"
                    >
                      View certificate →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
