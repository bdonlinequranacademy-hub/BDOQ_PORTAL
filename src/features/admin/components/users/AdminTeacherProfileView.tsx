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
import { formatClockTime } from "@/i18n/format";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { parseTimeSortKey } from "@/lib/utils/schedule";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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

export function AdminTeacherProfileView({
  data,
  onEdit,
  onDeactivate,
}: IAdminTeacherProfileViewProps) {
  const {
    t,
    formatDate,
    formatBdt,
    formatNumber,
    statusLabel,
    dynamicLabel,
  } = usePortalTranslation();
  const [tab, setTab] = useState<TabId>("overview");

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: t("admin.teacherProfile.tabOverview") },
    { id: "classes", label: t("admin.teacherProfile.tabClasses") },
    { id: "students", label: t("admin.teacherProfile.tabStudents") },
    { id: "activity", label: t("admin.teacherProfile.tabActivity") },
    { id: "finance", label: t("admin.teacherProfile.tabFinance") },
  ];

  function formatTimeRange(time: string, duration: number): string {
    const startLabel = formatClockTime(time);
    const startMinutes = parseTimeSortKey(startLabel);
    const endMinutes = (startMinutes + duration) % (24 * 60);
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endLabel = formatClockTime(
      `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`
    );
    return `${startLabel} – ${endLabel}`;
  }
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

  const title = publicProfile?.title || t("admin.teacherProfile.defaultTitle");
  const specialty = (publicProfile?.skills ?? [])[0];
  const subtitle = specialty ? `${title} · ${specialty}` : title;
  const about =
    publicProfile?.about?.trim() ||
    publicProfile?.bio?.trim() ||
    t("admin.teacherProfile.defaultAbout", { name: user.name });
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
    { label: t("admin.teacherProfile.experience"), value: stats.experienceLabel, icon: GraduationCap },
    { label: t("tables.students"), value: `${formatNumber(stats.totalStudents)}+`, icon: Users },
    { label: t("admin.teacherProfile.activeClasses"), value: formatNumber(stats.activeClasses), icon: BookOpen },
    { label: t("admin.teacherProfile.homework"), value: formatNumber(stats.homeworkAssigned), icon: ClipboardList },
    {
      label: t("admin.teacherProfile.logsApproved"),
      value: formatNumber(stats.classLogsApproved),
      icon: Award,
    },
    {
      label: t("admin.teacherProfile.monthEarnings"),
      value: formatBdt(stats.earningsMonthBdt),
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
        {t("admin.teacherProfile.backToUsers")}
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
                {t("admin.teacherProfile.headerBadge")}
              </p>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                <Pencil className="size-3.5" aria-hidden />
                {t("admin.teacherProfile.editProfile")}
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
                  {statusLabel(user.isActive !== false ? "active" : "inactive")}
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-1 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold drop-shadow sm:text-3xl">
                    {user.name}
                  </h1>
                  {user.emailVerified ? (
                    <BadgeCheck className="size-5 text-[#2DD4BF]" aria-label={t("admin.teacherProfile.verified")} />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-white/85">{subtitle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/80 sm:text-sm">
                  {user.gender ? (
                    <span>{dynamicLabel(user.gender)}</span>
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
                    {t("admin.teacherProfile.joined", {
                      date: user.createdAt ? formatDate(user.createdAt) : "—",
                    })}
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
        {tabs.map((item) => (
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
            <h2 className="font-display text-lg font-semibold text-primary-dark">{t("admin.teacherProfile.about")}</h2>
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
                  {t("admin.teacherProfile.languages")}
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
              {t("admin.teacherProfile.accountIdentity")}
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                [t("admin.teacherProfile.name"), user.name],
                [t("labels.email"), user.email],
                [t("labels.gender"), user.gender ? dynamicLabel(user.gender) : "—"],
                [t("labels.country"), user.country ? formatCountryWithFlag(user.country) : "—"],
                [t("admin.teacherProfile.whatsapp"), user.whatsapp || "—"],
                [t("admin.teacherProfile.timezone"), user.timezone || "Asia/Dhaka"],
                [t("admin.teacherProfile.auth"), user.authProvider || "local"],
                [
                  t("admin.teacherProfile.emailVerified"),
                  user.emailVerified ? t("labels.yes") : t("labels.no"),
                ],
                [
                  t("tables.status"),
                  statusLabel(user.isActive !== false ? "active" : "inactive"),
                ],
                [t("labels.joined"), user.createdAt ? formatDate(user.createdAt) : "—"],
                [
                  t("admin.teacherProfile.publicProfile"),
                  publicProfile
                    ? `${publicProfile.showOnWebsite ? t("admin.teacherProfile.onWebsite") : statusLabel("hidden")}${publicProfile.featured ? ` · ${t("admin.teacherProfile.featured")}` : ""}`
                    : t("admin.teacherProfile.notLinked"),
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
              {t("admin.teacherProfile.qualifications")}
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
                {t("admin.teacherProfile.noQualifications")}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5 lg:col-span-2">
            <h2 className="mb-3 font-display text-lg font-semibold text-primary-dark">
              {t("admin.teacherProfile.quickActions")}
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
                  {t("admin.teacherProfile.messageTeacher")}
                </a>
              ) : null}
              <Link
                to="/admin/classes"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary-dark hover:bg-primary hover:text-white"
              >
                {t("admin.teacherProfile.viewClasses")}
              </Link>
              <Link
                to="/admin/earnings"
                className="inline-flex items-center gap-2 rounded-xl border border-portal px-4 py-2.5 text-sm font-semibold text-portal-heading hover:border-primary/40"
              >
                {t("admin.teacherProfile.earnings")}
              </Link>
              {publicProfile?.slug ? (
                <a
                  href={`https://bdonlinequranacademy.com/teachers/${publicProfile.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-portal px-4 py-2.5 text-sm font-semibold text-portal-heading hover:border-primary/40"
                >
                  {t("admin.teacherProfile.publicProfileLink")}
                </a>
              ) : null}
              {onDeactivate ? (
                <button
                  type="button"
                  onClick={onDeactivate}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  {user.isActive !== false
                    ? t("admin.teacherProfile.deactivateAccount")
                    : t("admin.teacherProfile.deleteAccount")}
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
              {t("admin.teacherProfile.assignedClasses")}
            </h2>
            {classes.length === 0 ? (
              <p className="mt-3 text-sm text-portal-muted">{t("admin.teacherProfile.noClassesAssigned")}</p>
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
                            {t("admin.teacherProfile.studentsCount", {
                              count: formatNumber(cls.studentCount),
                            })}
                            {cls.schedule
                              ? ` · ${cls.schedule.day} ${formatClockTime(cls.schedule.time)}`
                              : ""}
                            {cls.sessionRateBdt
                              ? ` · ${formatBdt(cls.sessionRateBdt)}${t("labels.session_suffix")}`
                              : ""}
                          </p>
                          {cls.meetingLink ? (
                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                              <Video className="size-3" aria-hidden />
                              {t("admin.teacherProfile.meetingLinkSet")}
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
                          {statusLabel(cls.isActive ? "active" : "inactive")}
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
                {t("admin.teacherProfile.weeklySchedule")}
              </h2>
              <Link
                to="/admin/schedule/routine"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.teacherProfile.fullRoutine")}
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
                  <p className="text-[10px] font-bold uppercase">
                    {dynamicLabel(day.toLowerCase()).slice(0, 3)}
                  </p>
                  <p className="mt-1 text-xs font-semibold">
                    {slots.length > 0 ? slots.length : "—"}
                  </p>
                </div>
              ))}
            </div>
            {busyDays.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.teacherProfile.noWeeklySlots")}</p>
            ) : (
              <div className="space-y-3">
                {busyDays.map(({ day, slots }) => (
                  <div key={day} className="rounded-xl border border-portal p-3">
                    <p className="text-sm font-semibold text-primary-dark">{dynamicLabel(day.toLowerCase())}</p>
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
                              {formatTimeRange(slot.time, slot.duration)} ·{" "}
                              {t("admin.teacherProfile.minutesShort", {
                                count: formatNumber(slot.duration),
                              })}
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
            {t("admin.teacherProfile.studentsTitle", { count: formatNumber(students.length) })}
          </h2>
          {students.length === 0 ? (
            <p className="mt-3 text-sm text-portal-muted">{t("admin.teacherProfile.noStudentsAssigned")}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-portal text-xs uppercase tracking-wide text-portal-muted">
                    <th className="px-3 py-2">{t("tables.student")}</th>
                    <th className="px-3 py-2">{t("admin.teacherProfile.studentId")}</th>
                    <th className="px-3 py-2">{t("tables.contact")}</th>
                    <th className="px-3 py-2">{t("tables.classes")}</th>
                    <th className="px-3 py-2">{t("tables.status")}</th>
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
                          {statusLabel(student.isActive ? "active" : "inactive")}
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
                {t("admin.teacherProfile.recentClassLogs")}
              </h2>
              <Link
                to="/admin/class-logs"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.teacherProfile.allLogs")}
              </Link>
            </div>
            {recentClassLogs.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.teacherProfile.noClassLogs")}</p>
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
                          {log.durationMinutes != null
                            ? t("admin.teacherProfile.minutesShort", {
                                count: formatNumber(log.durationMinutes),
                              })
                            : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-portal-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase text-portal-heading">
                        {statusLabel(log.status)}
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
                {t("admin.teacherProfile.homeworkAssigned")}
              </h2>
              <Link
                to="/admin/homework"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.teacherProfile.allHomework")}
              </Link>
            </div>
            {recentHomework.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.teacherProfile.noHomework")}</p>
            ) : (
              <ul className="space-y-2.5">
                {recentHomework.map((hw) => (
                  <li key={hw._id} className="rounded-xl border border-portal px-3 py-3">
                    <p className="text-sm font-semibold text-portal-heading">{hw.title}</p>
                    <p className="text-xs text-portal-muted">
                      {hw.classTitle} · {t("admin.teacherProfile.due", { date: formatDate(hw.dueDate) })} ·{" "}
                      {formatNumber(hw.submissionCount)}{" "}
                      {hw.submissionCount === 1
                        ? t("admin.teacherProfile.submission")
                        : t("admin.teacherProfile.submissions")}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mb-2 mt-6 text-sm font-semibold text-primary-dark">
              {t("admin.teacherProfile.studentRequests")}
            </h3>
            {studentRequests.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.teacherProfile.noStudentRequests")}</p>
            ) : (
              <ul className="space-y-2">
                {studentRequests.map((req) => (
                  <li key={req._id} className="rounded-xl border border-portal px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-portal-muted">
                        {req.createdAt ? formatDate(req.createdAt) : "—"}
                        {req.preferredCourseType ? ` · ${dynamicLabel(req.preferredCourseType)}` : ""}
                      </p>
                      <span className="text-[10px] font-bold uppercase">
                        {statusLabel(req.status)}
                      </span>
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
              {t("admin.teacherProfile.thisMonth", { month: earnings.month })}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-primary-light/40 p-4">
                <p className="text-xs text-portal-muted">{t("admin.teacherProfile.approvedEarnings")}</p>
                <p className="mt-1 text-xl font-bold text-primary-dark">
                  {formatBdt(earnings.totalBdt)}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs text-portal-muted">{t("admin.teacherProfile.pending")}</p>
                <p className="mt-1 text-xl font-bold text-amber-700">
                  {formatBdt(earnings.pendingBdt)}
                </p>
              </div>
              <div className="rounded-xl bg-portal-muted/25 p-4">
                <p className="text-xs text-portal-muted">{t("admin.teacherProfile.verifiedSessions")}</p>
                <p className="mt-1 text-xl font-bold text-portal-heading">
                  {formatNumber(earnings.verifiedSessions)}
                </p>
              </div>
              <div className="rounded-xl bg-portal-muted/25 p-4">
                <p className="text-xs text-portal-muted">{t("admin.teacherProfile.pendingRejected")}</p>
                <p className="mt-1 text-xl font-bold text-portal-heading">
                  {formatNumber(earnings.pendingSessions)} / {formatNumber(earnings.rejectedSessions)}
                </p>
              </div>
            </div>
            <Link
              to="/admin/earnings"
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              {t("admin.teacherProfile.openEarningsReport")}
            </Link>
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              {t("admin.teacherProfile.payoutDetails")}
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                <dt className="text-xs text-portal-muted">{t("admin.teacherProfile.bank")}</dt>
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
                <dt className="text-xs text-portal-muted">{t("admin.teacherProfile.defaultMeetingLink")}</dt>
                <dd className="font-medium text-portal-heading">
                  {user.meetingLink ? (
                    <a
                      href={user.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {t("actions.openLink")}
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
