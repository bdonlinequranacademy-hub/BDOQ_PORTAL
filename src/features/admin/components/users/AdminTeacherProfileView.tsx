import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BookOpen,
  ClipboardList,
  Clock,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";
import type { AdminTeacherProfileDetail } from "@/types/models";

interface IAdminTeacherProfileViewProps {
  data: AdminTeacherProfileDetail;
  onEdit: () => void;
  onDeactivate?: () => void;
}

type TabId = "overview" | "classes" | "students" | "activity" | "finance";

const WEEK_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "classes", label: "Classes & Schedule" },
  { id: "students", label: "Students" },
  { id: "activity", label: "Teaching Activity" },
  { id: "finance", label: "Earnings & Payout" },
];

function formatJoined(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeRange(time: string, duration: number): string {
  const [hRaw, mRaw] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(Number.isFinite(hRaw) ? hRaw : 0, Number.isFinite(mRaw) ? mRaw : 0, 0, 0);
  const end = new Date(start.getTime() + duration * 60_000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function moneyBdt(amount: number): string {
  return `৳ ${amount.toLocaleString()}`;
}

export function AdminTeacherProfileView({
  data,
  onEdit,
  onDeactivate,
}: IAdminTeacherProfileViewProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const {
    user,
    publicProfile,
    stats,
    scheduleSlots,
    classes,
    students,
    recentClassLogs,
    recentHomework,
    studentRequests,
    earnings,
  } = data;

  const title = publicProfile?.title || "Quran Teacher";
  const specialty = (publicProfile?.skills ?? [])[0];
  const subtitle = specialty ? `${title} · ${specialty}` : title;
  const about =
    publicProfile?.about?.trim() ||
    publicProfile?.bio?.trim() ||
    `${user.name} teaches at BD Online Quran Academy.`;
  const skills = publicProfile?.skills?.length
    ? publicProfile.skills
    : publicProfile?.languages ?? [];
  const qualifications = publicProfile?.qualifications ?? [];
  const languages = publicProfile?.languages ?? [];
  const waUrl = user.whatsapp ? waMeUrlFromRaw(user.whatsapp, user.country) : null;

  const slotsByDay = WEEK_DAYS.map((day) => ({
    day,
    slots: scheduleSlots.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time)),
  }));
  const busyDays = slotsByDay.filter((d) => d.slots.length > 0);

  const statCards = [
    { label: "Experience", value: stats.experienceLabel, icon: GraduationCap },
    { label: "Students", value: `${stats.totalStudents}+`, icon: Users },
    { label: "Active Classes", value: String(stats.activeClasses), icon: BookOpen },
    { label: "Homework", value: String(stats.homeworkAssigned), icon: ClipboardList },
    {
      label: "Logs Approved",
      value: String(stats.classLogsApproved),
      icon: Award,
    },
    {
      label: "Month Earnings",
      value: moneyBdt(stats.earningsMonthBdt),
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
                Ustadh Profile · Full dossier
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
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold drop-shadow sm:text-3xl">
                    {user.name}
                  </h1>
                  {user.emailVerified ? (
                    <BadgeCheck className="size-5 text-[#2DD4BF]" aria-label="Verified" />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-white/85">{subtitle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/80 sm:text-sm">
                  {user.gender ? (
                    <span className="capitalize">{user.gender}</span>
                  ) : null}
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
            <h2 className="font-display text-lg font-semibold text-primary-dark">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-portal-muted">{about}</p>
            {skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
            {languages.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-portal-muted">
                  <Languages className="size-3.5" aria-hidden />
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-portal px-3 py-1 text-xs font-medium text-portal-heading"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              Account identity
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                ["Name", user.name],
                ["Email", user.email],
                ["Gender", user.gender ? user.gender : "—"],
                ["Country", user.country ? formatCountryWithFlag(user.country) : "—"],
                ["WhatsApp", user.whatsapp || "—"],
                ["Timezone", user.timezone || "Asia/Dhaka"],
                ["Auth", user.authProvider || "local"],
                ["Email verified", user.emailVerified ? "Yes" : "No"],
                ["Status", user.isActive !== false ? "Active" : "Inactive"],
                ["Joined", formatJoined(user.createdAt)],
                [
                  "Public profile",
                  publicProfile
                    ? `${publicProfile.showOnWebsite ? "On website" : "Hidden"}${publicProfile.featured ? " · Featured" : ""}`
                    : "Not linked",
                ],
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

          <section className="rounded-2xl border border-portal bg-portal-surface p-5 lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              Qualifications
            </h2>
            {qualifications.length > 0 ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {qualifications.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 rounded-xl border border-portal px-3 py-2.5 text-sm text-portal-heading"
                  >
                    <Award className="mt-0.5 size-4 shrink-0 text-gold-dark" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-portal-muted">
                No public qualifications linked yet. These come from the website teacher
                profile CMS when linked.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5 lg:col-span-2">
            <h2 className="mb-3 font-display text-lg font-semibold text-primary-dark">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-2">
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Message Teacher
                </a>
              ) : null}
              <Link
                to="/admin/classes"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary hover:text-white"
              >
                View Classes
              </Link>
              <Link
                to="/admin/earnings"
                className="inline-flex items-center gap-2 rounded-xl border border-portal px-4 py-2.5 text-sm font-semibold text-portal-heading hover:border-primary/40"
              >
                Earnings
              </Link>
              {publicProfile?.slug ? (
                <a
                  href={`https://bdonlinequranacademy.com/teachers/${publicProfile.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-portal px-4 py-2.5 text-sm font-semibold text-portal-heading hover:border-primary/40"
                >
                  Public Profile
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
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              Assigned Classes
            </h2>
            {classes.length === 0 ? (
              <p className="mt-3 text-sm text-portal-muted">No classes assigned.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {classes.map((cls) => (
                  <li key={cls._id}>
                    <Link
                      to={`/admin/classes/${cls._id}`}
                      className="block rounded-xl border border-portal px-4 py-3 transition hover:border-primary/40 hover:bg-primary-light/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-portal-heading">{cls.title}</p>
                          <p className="mt-1 text-xs text-portal-muted">
                            {cls.studentCount} students
                            {cls.schedule
                              ? ` · ${cls.schedule.day} ${cls.schedule.time}`
                              : ""}
                            {cls.sessionRateBdt
                              ? ` · ${moneyBdt(cls.sessionRateBdt)}/session`
                              : ""}
                          </p>
                          {cls.meetingLink ? (
                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                              <Video className="size-3" aria-hidden />
                              Meeting link set
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
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Weekly Schedule
              </h2>
              <Link
                to="/admin/schedule/routine"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Full routine →
              </Link>
            </div>
            <div className="mb-4 grid grid-cols-7 gap-1.5">
              {slotsByDay.map(({ day, slots }) => (
                <div
                  key={day}
                  className={cn(
                    "rounded-xl px-1 py-2 text-center",
                    slots.length > 0
                      ? "bg-primary text-white"
                      : "border border-dashed border-portal text-portal-muted"
                  )}
                >
                  <p className="text-[10px] font-bold uppercase">{day.slice(0, 3)}</p>
                  <p className="mt-1 text-xs font-semibold">
                    {slots.length > 0 ? slots.length : "—"}
                  </p>
                </div>
              ))}
            </div>
            {busyDays.length === 0 ? (
              <p className="text-sm text-portal-muted">No weekly slots yet.</p>
            ) : (
              <div className="space-y-3">
                {busyDays.map(({ day, slots }) => (
                  <div key={day} className="rounded-xl border border-portal p-3">
                    <p className="text-sm font-semibold text-primary-dark">{day}</p>
                    <ul className="mt-2 space-y-2">
                      {slots.map((slot) => (
                        <li
                          key={`${slot.day}-${slot.time}-${slot.classTitle}`}
                          className="flex items-start gap-2 rounded-lg bg-primary-light/30 px-3 py-2"
                        >
                          <Clock className="mt-0.5 size-4 text-primary" aria-hidden />
                          <div>
                            <p className="text-sm font-semibold text-portal-heading">
                              {slot.classTitle}
                            </p>
                            <p className="text-xs text-portal-muted">
                              {formatTimeRange(slot.time, slot.duration)} · {slot.duration}{" "}
                              min
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}

      {tab === "students" ? (
        <section className="rounded-2xl border border-portal bg-portal-surface p-5">
          <h2 className="font-display text-lg font-semibold text-primary-dark">
            Students ({students.length})
          </h2>
          {students.length === 0 ? (
            <p className="mt-3 text-sm text-portal-muted">No students assigned yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-portal text-xs uppercase tracking-wide text-portal-muted">
                    <th className="px-3 py-2">Student</th>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Classes</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-portal">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-portal-muted/20">
                      <td className="px-3 py-3">
                        <Link
                          to={`/admin/users/${student._id}`}
                          className="font-semibold text-primary-dark hover:underline"
                        >
                          {student.name}
                        </Link>
                        <p className="text-xs text-portal-muted">{student.email}</p>
                      </td>
                      <td className="px-3 py-3 text-portal-muted">
                        {student.studentId || "—"}
                      </td>
                      <td className="px-3 py-3 text-portal-muted">
                        {student.whatsapp || "—"}
                        {student.country ? (
                          <p className="text-xs">{formatCountryWithFlag(student.country)}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-xs text-portal-muted">
                        {student.classTitles.join(", ")}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            student.isActive
                              ? "bg-primary/15 text-primary-dark"
                              : "bg-red-50 text-red-600"
                          )}
                        >
                          {student.isActive ? "Active" : "Off"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {tab === "activity" ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Recent Class Logs
              </h2>
              <Link
                to="/admin/class-logs"
                className="text-xs font-semibold text-primary hover:underline"
              >
                All logs →
              </Link>
            </div>
            {recentClassLogs.length === 0 ? (
              <p className="text-sm text-portal-muted">No class logs yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {recentClassLogs.map((log) => (
                  <li key={log._id} className="rounded-xl border border-portal px-3 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-portal-heading">
                          {log.classTitle}
                        </p>
                        <p className="text-xs text-portal-muted">
                          {log.studentName}
                          {log.studentId ? ` (${log.studentId})` : ""} · {log.sessionDate} ·{" "}
                          {log.durationMinutes} min
                        </p>
                      </div>
                      <span className="rounded-full bg-portal-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase text-portal-heading">
                        {log.status}
                      </span>
                    </div>
                    {log.lessonReport ? (
                      <p className="mt-2 line-clamp-2 text-xs text-portal-muted">
                        {log.lessonReport}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                Homework Assigned
              </h2>
              <Link
                to="/admin/homework"
                className="text-xs font-semibold text-primary hover:underline"
              >
                All homework →
              </Link>
            </div>
            {recentHomework.length === 0 ? (
              <p className="text-sm text-portal-muted">No homework assigned yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {recentHomework.map((hw) => (
                  <li key={hw._id} className="rounded-xl border border-portal px-3 py-3">
                    <p className="text-sm font-semibold text-portal-heading">{hw.title}</p>
                    <p className="text-xs text-portal-muted">
                      {hw.classTitle} · Due {formatJoined(hw.dueDate)} ·{" "}
                      {hw.submissionCount} submission
                      {hw.submissionCount === 1 ? "" : "s"}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mb-2 mt-6 text-sm font-semibold text-primary-dark">
              Student requests
            </h3>
            {studentRequests.length === 0 ? (
              <p className="text-sm text-portal-muted">No student requests.</p>
            ) : (
              <ul className="space-y-2">
                {studentRequests.map((req) => (
                  <li key={req._id} className="rounded-xl border border-portal px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-portal-muted">
                        {formatJoined(req.createdAt)}
                        {req.preferredCourseType ? ` · ${req.preferredCourseType}` : ""}
                      </p>
                      <span className="text-[10px] font-bold uppercase">{req.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-portal-heading">{req.message}</p>
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
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              This month ({earnings.month})
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-primary-light/40 p-4">
                <p className="text-xs text-portal-muted">Approved earnings</p>
                <p className="mt-1 text-xl font-bold text-primary-dark">
                  {moneyBdt(earnings.totalBdt)}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs text-portal-muted">Pending</p>
                <p className="mt-1 text-xl font-bold text-amber-700">
                  {moneyBdt(earnings.pendingBdt)}
                </p>
              </div>
              <div className="rounded-xl bg-portal-muted/25 p-4">
                <p className="text-xs text-portal-muted">Verified sessions</p>
                <p className="mt-1 text-xl font-bold text-portal-heading">
                  {earnings.verifiedSessions}
                </p>
              </div>
              <div className="rounded-xl bg-portal-muted/25 p-4">
                <p className="text-xs text-portal-muted">Pending / rejected</p>
                <p className="mt-1 text-xl font-bold text-portal-heading">
                  {earnings.pendingSessions} / {earnings.rejectedSessions}
                </p>
              </div>
            </div>
            <Link
              to="/admin/earnings"
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Open earnings report →
            </Link>
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              Payout details
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                <dt className="text-xs text-portal-muted">Bank</dt>
                <dd className="font-medium text-portal-heading">
                  {user.bankName || "—"}
                  {user.bankAccount ? ` · ${user.bankAccount}` : ""}
                </dd>
              </div>
              <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                <dt className="text-xs text-portal-muted">bKash</dt>
                <dd className="font-medium text-portal-heading">
                  {user.bKashNumber || "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                <dt className="text-xs text-portal-muted">Default meeting link</dt>
                <dd className="font-medium text-portal-heading">
                  {user.meetingLink ? (
                    <a
                      href={user.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open link
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      ) : null}
    </div>
  );
}
