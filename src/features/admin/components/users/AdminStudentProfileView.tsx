import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  StickyNote,
  UserRound,
  Wallet,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { waMeUrlFromRaw } from "@/lib/whatsapp";
import { formatTrialMeetingPlatformLabel } from "@/lib/trialMeetingPlatform";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { useUpdateUser } from "@/features/admin/hooks/useAdmin";
import type { AdminStudentProfileDetail, ParentInfo, StudentEnrollmentSummary } from "@/types/models";

interface IAdminStudentProfileViewProps {
  data: AdminStudentProfileDetail;
  onEdit: () => void;
  onDeactivate?: () => void;
}

type TabId = "overview" | "classes" | "learning" | "finance" | "notes";

function ParentInfoSection({
  parentInfo,
  t,
}: {
  parentInfo?: ParentInfo;
  t: (key: string) => string;
}) {
  if (!parentInfo?.name && !parentInfo?.whatsapp && !parentInfo?.email) {
    return (
      <p className="mt-3 text-sm text-portal-muted">{t("admin.studentProfile.noParentInfo")}</p>
    );
  }

  return (
    <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
      {[
        [t("admin.studentProfile.parentName"), parentInfo?.name || "—"],
        [t("admin.studentProfile.parentRelationship"), parentInfo?.relationship || "—"],
        [t("admin.studentProfile.parentWhatsapp"), parentInfo?.whatsapp || "—"],
        [t("admin.studentProfile.parentEmail"), parentInfo?.email || "—"],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-portal-muted/20 px-3 py-2">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-portal-muted">
            {label}
          </dt>
          <dd className="mt-0.5 font-medium text-portal-heading">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function EnrollmentSummarySection({
  enrollment,
  t,
  formatDate,
  formatMoney,
  statusLabel,
}: {
  enrollment: StudentEnrollmentSummary;
  t: (key: string, params?: Record<string, string>) => string;
  formatDate: (value: string) => string;
  formatMoney: (amount: number, currency: string) => string;
  statusLabel: (status: string) => string;
}) {
  return (
    <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
      {[
        [t("admin.studentProfile.enrollmentPlan"), enrollment.packagePlan || "—"],
        [
          t("admin.studentProfile.enrollmentStart"),
          enrollment.classStartDate ? formatDate(enrollment.classStartDate) : "—",
        ],
        [
          t("admin.studentProfile.enrollmentSchedule"),
          enrollment.classDays?.length
            ? `${enrollment.classDays.join(", ")}${enrollment.classTime ? ` · ${enrollment.classTime}` : ""}`
            : enrollment.classTime || "—",
        ],
        [
          t("admin.studentProfile.enrollmentFrequency"),
          enrollment.classesPerWeek
            ? t("admin.studentProfile.classesPerWeek", {
                count: String(enrollment.classesPerWeek),
              })
            : "—",
        ],
        [
          t("admin.studentProfile.enrollmentDuration"),
          enrollment.classDurationMinutes
            ? t("admin.studentProfile.minutesShort", {
                count: String(enrollment.classDurationMinutes),
              })
            : "—",
        ],
        [t("admin.studentProfile.enrollmentTeacher"), enrollment.assignedTeacherName || "—"],
        [
          t("admin.studentProfile.enrollmentPlatform"),
          enrollment.meetingPlatform
            ? formatTrialMeetingPlatformLabel(enrollment.meetingPlatform, t)
            : "—",
        ],
        [
          t("admin.studentProfile.enrollmentFee"),
          enrollment.monthlyFeeAmount != null
            ? formatMoney(
                enrollment.monthlyFeeAmount,
                enrollment.monthlyFeeCurrency?.toUpperCase() ?? "BDT"
              )
            : "—",
        ],
        [
          t("admin.studentProfile.enrollmentPayment"),
          enrollment.paymentStatus ? statusLabel(enrollment.paymentStatus) : "—",
        ],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-primary-light/30 px-3 py-2">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-portal-muted">
            {label}
          </dt>
          <dd className="mt-0.5 font-medium text-portal-heading">{value}</dd>
        </div>
      ))}
      {enrollment.meetingLink ? (
        <div className="sm:col-span-2 rounded-xl bg-primary-light/30 px-3 py-2">
          <dt className="text-[11px] font-medium uppercase tracking-wide text-portal-muted">
            {t("admin.studentProfile.enrollmentMeetingLink")}
          </dt>
          <dd className="mt-0.5">
            <a
              href={enrollment.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {enrollment.meetingLink}
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

export function AdminStudentProfileView({
  data,
  onEdit,
  onDeactivate,
}: IAdminStudentProfileViewProps) {
  const {
    t,
    formatDate,
    formatMoney,
    formatNumber,
    statusLabel,
    dynamicLabel,
    paymentMethod,
  } = usePortalTranslation();
  const [tab, setTab] = useState<TabId>("overview");
  const updateUser = useUpdateUser(data.user.id);
  const [notesDraft, setNotesDraft] = useState(
    data.profileNotes ?? data.user.profileNotes ?? ""
  );

  useEffect(() => {
    setNotesDraft(data.profileNotes ?? data.user.profileNotes ?? "");
  }, [data.profileNotes, data.user.profileNotes, data.user.id]);

  const parentInfo = data.parentInfo ?? data.user.parentInfo;
  const enrollment = data.enrollment ?? null;

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: t("admin.studentProfile.tabOverview") },
    { id: "classes", label: t("admin.studentProfile.tabClasses") },
    { id: "learning", label: t("admin.studentProfile.tabLearning") },
    { id: "finance", label: t("admin.studentProfile.tabFinance") },
    { id: "notes", label: t("admin.studentProfile.tabNotes") },
  ];
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
    { label: t("admin.studentProfile.activeClasses"), value: formatNumber(stats.activeClasses), icon: BookOpen },
    {
      label: t("admin.studentProfile.attendance"),
      value: stats.attendanceRate != null ? `${formatNumber(stats.attendanceRate)}%` : "—",
      icon: CheckCircle2,
    },
    { label: t("admin.studentProfile.hwDone"), value: formatNumber(stats.submittedHomework), icon: ClipboardList },
    { label: t("admin.studentProfile.hwPending"), value: formatNumber(stats.pendingHomework), icon: Clock },
    {
      label: t("admin.studentProfile.certificates"),
      value: formatNumber(stats.certificatesCount),
      icon: Award,
    },
    {
      label: t("admin.studentProfile.payments"),
      value: formatNumber(stats.paymentsCount),
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
        {t("admin.studentProfile.backToUsers")}
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
                {t("admin.studentProfile.headerBadge")}
              </p>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                <Pencil className="size-3.5" aria-hidden />
                {t("admin.studentProfile.editProfile")}
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
                <h1 className="font-display text-2xl font-bold drop-shadow sm:text-3xl">
                  {user.name}
                </h1>
                <p className="mt-1 text-sm text-white/85">
                  {user.studentId
                    ? t("admin.studentProfile.studentIdLabel", { id: user.studentId })
                    : t("admin.studentProfile.student")}
                  {user.gender
                    ? ` · ${dynamicLabel(user.gender)}`
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
                    {t("admin.studentProfile.joined", {
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
          {enrollment ? (
            <section className="rounded-2xl border border-primary/20 bg-primary-light/20 p-5 lg:col-span-2">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary-dark" aria-hidden />
                <h2 className="font-display text-lg font-semibold text-primary-dark">
                  {t("admin.studentProfile.enrollmentSummary")}
                </h2>
              </div>
              <EnrollmentSummarySection
                enrollment={enrollment}
                t={t}
                formatDate={formatDate}
                formatMoney={formatMoney}
                statusLabel={statusLabel}
              />
            </section>
          ) : null}

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="flex items-center gap-2">
              <UserRound className="size-5 text-primary-dark" aria-hidden />
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                {t("admin.studentProfile.parentGuardian")}
              </h2>
            </div>
            <ParentInfoSection parentInfo={parentInfo} t={t} />
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              {t("admin.studentProfile.accountIdentity")}
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                [t("admin.studentProfile.name"), user.name],
                [t("admin.studentProfile.studentId"), user.studentId || "—"],
                [t("labels.email"), user.email],
                [t("labels.gender"), user.gender ? dynamicLabel(user.gender) : "—"],
                [t("labels.country"), user.country ? formatCountryWithFlag(user.country) : "—"],
                [t("admin.studentProfile.whatsapp"), user.whatsapp || "—"],
                [t("admin.studentProfile.timezone"), user.timezone || "Asia/Dhaka"],
                [t("admin.studentProfile.auth"), user.authProvider || "local"],
                [
                  t("admin.studentProfile.emailVerified"),
                  user.emailVerified ? t("labels.yes") : t("labels.no"),
                ],
                [
                  t("tables.status"),
                  statusLabel(user.isActive !== false ? "active" : "inactive"),
                ],
                [t("labels.joined"), user.createdAt ? formatDate(user.createdAt) : "—"],
                [
                  t("admin.studentProfile.onPlatform"),
                  t("admin.studentProfile.yearsOnPlatform", {
                    count: formatNumber(stats.yearsOnPlatform),
                  }),
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

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              {t("admin.studentProfile.curriculumAssignments")}
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
              <p className="mt-3 text-sm text-portal-muted">{t("admin.studentProfile.noCurriculum")}</p>
            )}

            <h3 className="mb-2 mt-6 text-sm font-semibold text-primary-dark">
              {t("admin.studentProfile.attendanceSnapshot")}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-xl bg-primary-light/40 p-3">
                <p className="text-xs text-portal-muted">{statusLabel("present")}</p>
                <p className="text-lg font-bold text-primary-dark">
                  {formatNumber(stats.attendancePresent)}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs text-portal-muted">{statusLabel("late")}</p>
                <p className="text-lg font-bold text-amber-700">{formatNumber(stats.attendanceLate)}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-xs text-portal-muted">{statusLabel("absent")}</p>
                <p className="text-lg font-bold text-red-600">{formatNumber(stats.attendanceAbsent)}</p>
              </div>
              <div className="rounded-xl bg-portal-muted/30 p-3">
                <p className="text-xs text-portal-muted">{t("admin.studentProfile.total")}</p>
                <p className="text-lg font-bold text-portal-heading">
                  {formatNumber(stats.attendanceTotal)}
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
                  {t("admin.studentProfile.messageStudent")}
                </a>
              ) : null}
              {onDeactivate ? (
                <button
                  type="button"
                  onClick={onDeactivate}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  {user.isActive !== false
                    ? t("admin.studentProfile.deactivateAccount")
                    : t("admin.studentProfile.deleteAccount")}
                </button>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {tab === "classes" ? (
        <section className="rounded-2xl border border-portal bg-portal-surface p-5">
          <h2 className="font-display text-lg font-semibold text-primary-dark">
            {t("admin.studentProfile.enrolledClasses", { count: formatNumber(classes.length) })}
          </h2>
          {classes.length === 0 ? (
            <p className="mt-3 text-sm text-portal-muted">{t("admin.studentProfile.notEnrolled")}</p>
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
                        {t("admin.studentProfile.teacherLabel")}{" "}
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
                        {cls.meetingPlatform
                          ? ` · ${formatTrialMeetingPlatformLabel(cls.meetingPlatform, t)}`
                          : ""}
                      </p>
                      {cls.meetingLink ? (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          {t("admin.studentProfile.joinMeeting")}
                          <ExternalLink className="size-3" aria-hidden />
                        </a>
                      ) : null}
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
                      {statusLabel(cls.isActive ? "active" : "inactive")}
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
                {t("admin.studentProfile.attendanceSection")}
              </h2>
              <Link
                to="/admin/attendance"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.studentProfile.openLink")}
              </Link>
            </div>
            {recentAttendance.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.studentProfile.noAttendanceRecords")}</p>
            ) : (
              <ul className="space-y-2">
                {recentAttendance.map((a) => (
                  <li
                    key={a._id}
                    className="flex items-center justify-between rounded-xl border border-portal px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-portal-heading">{a.classTitle}</p>
                      <p className="text-xs text-portal-muted">{formatDate(a.date)}</p>
                    </div>
                    <span className="text-xs font-bold uppercase text-portal-muted">
                      {statusLabel(a.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                {t("admin.studentProfile.progress")}
              </h2>
              <Link
                to="/admin/progress"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.studentProfile.openLink")}
              </Link>
            </div>
            {progress.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.studentProfile.noProgressRecords")}</p>
            ) : (
              <ul className="space-y-2.5">
                {progress.map((p) => (
                  <li key={p._id} className="rounded-xl border border-portal px-3 py-2.5">
                    <p className="text-sm font-semibold text-portal-heading">
                      {p.classTitle || p.curriculumProgram || t("admin.studentProfile.progress")}
                    </p>
                    <p className="mt-1 text-xs text-portal-muted">
                      {t("admin.studentProfile.tajweedAyahs", {
                        score: p.tajweedScore != null ? formatNumber(p.tajweedScore) : "—",
                        ayahs: formatNumber(p.memorizedAyahs),
                      })}
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
                {t("admin.studentProfile.homework")}
              </h2>
              <Link
                to="/admin/homework"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.studentProfile.openLink")}
              </Link>
            </div>
            {homework.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.studentProfile.noHomework")}</p>
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
                        {statusLabel(hw.submitted ? "submitted" : "pending")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-portal-muted">
                      {hw.classTitle} · {hw.teacherName} · {t("admin.studentProfile.due", { date: formatDate(hw.dueDate) })}
                      {hw.grade ? ` · ${t("admin.studentProfile.grade", { grade: hw.grade })}` : ""}
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
                {t("admin.studentProfile.billingPayments")}
              </h2>
              <Link
                to="/admin/payments"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.studentProfile.openLink")}
              </Link>
            </div>
            {billing ? (
              <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">{t("admin.studentProfile.monthlyFee")}</p>
                  <p className="font-semibold text-portal-heading">
                    {formatMoney(billing.monthlyFee, billing.currency)}
                  </p>
                </div>
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">{t("admin.studentProfile.dueDay")}</p>
                  <p className="font-semibold text-portal-heading">{formatNumber(billing.dueDay)}</p>
                </div>
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">{t("admin.studentProfile.paidUntil")}</p>
                  <p className="font-semibold text-portal-heading">
                    {billing.paidUntil ? formatDate(billing.paidUntil) : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-portal-muted/20 px-3 py-2">
                  <p className="text-xs text-portal-muted">{t("admin.studentProfile.billingStatus")}</p>
                  <p className="font-semibold text-portal-heading">
                    {statusLabel(billing.isActive ? "active" : "inactive")}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-sm text-portal-muted">{t("admin.studentProfile.noBillingSetup")}</p>
            )}

            {recentPayments.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.studentProfile.noPayments")}</p>
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
                        {p.createdAt ? formatDate(p.createdAt) : "—"}
                        {p.method ? ` · ${paymentMethod(p.method)}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-bold uppercase text-portal-muted">
                      {statusLabel(p.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-portal bg-portal-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary-dark">
                {t("admin.studentProfile.certificates")}
              </h2>
              <Link
                to="/admin/certificates"
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.studentProfile.openLink")}
              </Link>
            </div>
            {certificates.length === 0 ? (
              <p className="text-sm text-portal-muted">{t("admin.studentProfile.noCertificates")}</p>
            ) : (
              <ul className="space-y-2.5">
                {certificates.map((c) => (
                  <li key={c._id} className="rounded-xl border border-portal px-3 py-3">
                    <p className="text-sm font-semibold text-portal-heading">
                      {c.courseName}
                    </p>
                    <p className="mt-1 text-xs text-portal-muted">
                      {c.certificateId} · {t("admin.studentProfile.grade", { grade: c.grade })} ·{" "}
                      {t("admin.studentProfile.issued", {
                        date: c.issueDate ? formatDate(c.issueDate) : "—",
                      })}
                    </p>
                    <Link
                      to={`/admin/certificates/${c._id}`}
                      className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline"
                    >
                      {t("admin.studentProfile.viewCertificate")}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}

      {tab === "notes" ? (
        <section className="rounded-2xl border border-portal bg-portal-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote className="size-5 text-primary-dark" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-primary-dark">
              {t("admin.studentProfile.profileNotes")}
            </h2>
          </div>
          <p className="mb-3 text-sm text-portal-muted">{t("admin.studentProfile.profileNotesHint")}</p>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-portal bg-white px-4 py-3 text-sm text-portal-heading outline-none transition focus:border-primary/40"
            placeholder={t("admin.studentProfile.profileNotesPlaceholder")}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={updateUser.isPending}
              onClick={() => updateUser.mutate({ profileNotes: notesDraft })}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {updateUser.isPending
                ? t("admin.studentProfile.savingNotes")
                : t("admin.studentProfile.saveNotes")}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
