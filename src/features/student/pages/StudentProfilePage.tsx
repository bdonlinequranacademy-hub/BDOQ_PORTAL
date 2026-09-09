import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  useChangeStudentPassword,
  useStudentProfile,
  useStudentProfileHub,
  useUpdateStudentProfile,
  useUpdateApplicationData,
} from "@/features/student/hooks/useStudent";
import { ApplicationDataView } from "@/components/ui/shared/ApplicationDataView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formControlClass } from "@/lib/formControl";
import { PROFILE_TIMEZONE_OPTIONS } from "@/lib/profileTimezones";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { WhatsAppPhoneField } from "@/components/whatsapp/WhatsAppPhoneField";
import { toast } from "@/stores/uiStore";
import { PageLoading } from "@/components/ui/PageLoading";
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { useUploadProfileAvatar } from "@/hooks/useUploadProfileAvatar";
import { useAuthStore } from "@/stores/authStore";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formatClockTime } from "@/i18n/format";
import { formatTrialMeetingPlatformLabel } from "@/lib/trialMeetingPlatform";
import { cn } from "@/lib/utils/cn";
import type { ParentInfo, StudentEnrollmentSummary } from "@/types/models";

type TabId = "overview" | "classes" | "activity" | "payments" | "settings" | "application";

function ParentInfoCard({
  parentInfo,
  t,
}: {
  parentInfo?: ParentInfo;
  t: (key: string) => string;
}) {
  if (!parentInfo?.name && !parentInfo?.whatsapp && !parentInfo?.email) {
    return null;
  }

  return (
    <Card className="rounded-3xl border-0 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <UserRound className="size-5 text-primary-dark" aria-hidden />
        <h2 className="font-bold text-primary-dark">{t("student.parentGuardian")}</h2>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          [t("student.parentName"), parentInfo?.name || "—"],
          [t("student.parentRelationship"), parentInfo?.relationship || "—"],
          [t("student.parentWhatsapp"), parentInfo?.whatsapp || "—"],
          [t("student.parentEmail"), parentInfo?.email || "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-zinc-50 px-3 py-2">
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-primary-dark">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function EnrollmentCard({
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
    <Card className="rounded-3xl border border-primary/15 bg-primary-light/20 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="size-5 text-primary-dark" aria-hidden />
        <h2 className="font-bold text-primary-dark">{t("student.enrollmentSummary")}</h2>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          [t("student.enrollmentPlan"), enrollment.packagePlan || "—"],
          [
            t("student.enrollmentStart"),
            enrollment.classStartDate ? formatDate(enrollment.classStartDate) : "—",
          ],
          [
            t("student.enrollmentSchedule"),
            enrollment.classDays?.length
              ? `${enrollment.classDays.join(", ")}${enrollment.classTime ? ` · ${enrollment.classTime}` : ""}`
              : enrollment.classTime || "—",
          ],
          [t("student.enrollmentTeacher"), enrollment.assignedTeacherName || "—"],
          [
            t("student.enrollmentPlatform"),
            enrollment.meetingPlatform
              ? formatTrialMeetingPlatformLabel(enrollment.meetingPlatform, t)
              : "—",
          ],
          [
            t("student.enrollmentFee"),
            enrollment.monthlyFeeAmount != null
              ? formatMoney(
                  enrollment.monthlyFeeAmount,
                  enrollment.monthlyFeeCurrency?.toUpperCase() ?? "BDT"
                )
              : "—",
          ],
          [
            t("student.enrollmentPayment"),
            enrollment.paymentStatus ? statusLabel(enrollment.paymentStatus) : "—",
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white/70 px-3 py-2">
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-primary-dark">{value}</dd>
          </div>
        ))}
      </dl>
      {enrollment.meetingLink ? (
        <a
          href={enrollment.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {t("student.joinMeeting")}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ) : null}
    </Card>
  );
}

export function StudentProfilePage() {
  const { t, formatDate, formatMoney, formatNumber, statusLabel } = usePortalTranslation();
  const authUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: hub, isLoading: hubLoading } = useStudentProfileHub();
  const updateProfile = useUpdateStudentProfile();
  const updateApplicationData = useUpdateApplicationData();
  const changePassword = useChangeStudentPassword();
  const uploadAvatar = useUploadProfileAvatar("student");

  const [tab, setTab] = useState<TabId>("overview");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [country, setCountry] = useState("Bangladesh");
  const [whatsapp, setWhatsapp] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const displayProfile = hub?.profile ?? profile;

  useEffect(() => {
    if (!displayProfile) return;
    setName(displayProfile.name);
    setTimezone(displayProfile.timezone || "Asia/Dhaka");
    setCountry(displayProfile.country || "Bangladesh");
    setWhatsapp(displayProfile.whatsapp || "");
  }, [displayProfile]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: t("student.tabOverview") },
    { id: "classes", label: t("student.tabClasses") },
    { id: "activity", label: t("student.tabActivity") },
    { id: "payments", label: t("student.tabPayments") },
    { id: "settings", label: t("student.tabSettings") },
    { id: "application", label: "Application Data" },
  ];

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({ name, timezone, country, whatsapp });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("student.passwordsDoNotMatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("student.passwordMinLength"));
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  }

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const isLoading = profileLoading || hubLoading;

  return (
    <PageContainer className="flex flex-col gap-6" size="narrow">
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{t("student.myProfile")}</h1>
        <p className="text-sm text-zinc-500">{t("student.profileHubSubtitle")}</p>
      </div>

      <Card className="flex flex-col items-center gap-3 rounded-3xl border-0 p-8 shadow-sm">
        <ProfileAvatarUpload
          name={(displayProfile?.name ?? name) || "?"}
          avatarUrl={displayProfile?.avatarUrl ?? authUser?.avatarUrl}
          gender={displayProfile?.gender ?? authUser?.gender}
          isUploading={uploadAvatar.isPending}
          onUpload={async (file) => {
            await uploadAvatar.mutateAsync(file);
          }}
        />
        <div className="text-center">
          <p className="text-xl font-bold text-primary-dark">
            {(displayProfile?.name ?? name) || "—"}
          </p>
          <p className="text-sm text-zinc-500">{displayProfile?.email ?? "—"}</p>
          {displayProfile?.studentId ? (
            <p className="mt-1 text-xs text-zinc-400">
              {t("student.studentIdLabel", { id: displayProfile.studentId })}
            </p>
          ) : null}
        </div>
      </Card>

      {hub ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: t("student.statActiveClasses"),
              value: formatNumber(hub.stats.activeClasses),
            },
            {
              label: t("student.statAttendance"),
              value:
                hub.stats.attendanceRate != null
                  ? `${formatNumber(hub.stats.attendanceRate)}%`
                  : "—",
            },
            {
              label: t("student.statProgress"),
              value: formatNumber(hub.stats.progressRecords),
            },
            {
              label: t("student.statPayments"),
              value: formatNumber(hub.stats.recentPayments),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-primary-dark">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === item.id
                ? "bg-primary text-white shadow-sm"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-primary/30"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading label={t("student.loadingProfile")} />
      ) : (
        <>
          {tab === "overview" ? (
            <div className="flex flex-col gap-6">
              {hub?.enrollment ? (
                <EnrollmentCard
                  enrollment={hub.enrollment}
                  t={t}
                  formatDate={formatDate}
                  formatMoney={formatMoney}
                  statusLabel={statusLabel}
                />
              ) : null}
              <ParentInfoCard parentInfo={displayProfile?.parentInfo} t={t} />
              <Card className="rounded-3xl border-0 p-6 shadow-sm">
                <h2 className="mb-4 font-bold text-primary-dark">{t("student.accountLocation")}</h2>
                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-zinc-500">{t("student.displayName")}</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={formControlClass}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-zinc-500">{t("student.timezone")}</span>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className={formControlClass}
                    >
                      {PROFILE_TIMEZONE_OPTIONS.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <CountrySelect value={country} onChange={setCountry} />
                  <WhatsAppPhoneField
                    country={country}
                    value={whatsapp}
                    onChange={setWhatsapp}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="h-11 rounded-xl bg-primary-dark text-white"
                  >
                    {updateProfile.isPending ? t("student.saving") : t("student.saveProfile")}
                  </Button>
                </form>
              </Card>
            </div>
          ) : null}

          {tab === "classes" ? (
            <Card className="rounded-3xl border-0 p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-primary-dark">
                {t("student.profileClassesHeading", {
                  count: formatNumber(hub?.classes.length ?? 0),
                })}
              </h2>
              {(hub?.classes.length ?? 0) === 0 ? (
                <p className="text-sm text-zinc-500">{t("student.noClassesEnrolled")}</p>
              ) : (
                <ul className="space-y-3">
                  {hub?.classes.map((cls) => (
                    <li
                      key={cls._id}
                      className="rounded-2xl border border-zinc-100 px-4 py-3"
                    >
                      <p className="font-semibold text-primary-dark">{cls.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {cls.teacherName}
                        {cls.schedule
                          ? ` · ${cls.schedule.day} ${formatClockTime(cls.schedule.time)}`
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
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          {t("student.joinMeeting")}
                          <ExternalLink className="size-3" aria-hidden />
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/student/classes"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {t("student.viewAllClasses")}
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </Card>
          ) : null}

          {tab === "activity" ? (
            <div className="grid gap-4">
              {[
                {
                  to: "/student/attendance",
                  icon: CalendarCheck,
                  title: t("student.activityAttendance"),
                  desc: t("student.activityAttendanceDesc"),
                },
                {
                  to: "/student/progress",
                  icon: GraduationCap,
                  title: t("student.activityProgress"),
                  desc: t("student.activityProgressDesc"),
                },
                {
                  to: "/student/homework",
                  icon: BookOpen,
                  title: t("student.activityHomework"),
                  desc: t("student.activityHomeworkDesc"),
                },
              ].map(({ to, icon: Icon, title, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-4 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:border-primary/30"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary-dark">{title}</p>
                    <p className="text-sm text-zinc-500">{desc}</p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-zinc-400" aria-hidden />
                </Link>
              ))}
            </div>
          ) : null}

          {tab === "payments" ? (
            <Card className="rounded-3xl border-0 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="size-5 text-primary-dark" aria-hidden />
                <h2 className="font-bold text-primary-dark">{t("student.billingOverview")}</h2>
              </div>
              {hub?.billing ? (
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  {[
                    [
                      t("student.monthlyFee"),
                      formatMoney(hub.billing.monthlyFee, hub.billing.currency),
                    ],
                    [t("student.dueDay"), formatNumber(hub.billing.dueDay)],
                    [
                      t("student.paidUntil"),
                      hub.billing.paidUntil ? formatDate(hub.billing.paidUntil) : "—",
                    ],
                    [
                      t("student.billingStatus"),
                      statusLabel(hub.billing.isActive ? "active" : "inactive"),
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-zinc-50 px-3 py-2">
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-primary-dark">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-sm text-zinc-500">{t("student.noBillingSetup")}</p>
              )}
              {(hub?.recentPayments.length ?? 0) > 0 ? (
                <ul className="space-y-2">
                  {hub?.recentPayments.map((p) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between rounded-xl border border-zinc-100 px-3 py-2 text-sm"
                    >
                      <span className="font-semibold text-primary-dark">
                        {formatMoney(p.amount, p.currency)}
                      </span>
                      <span className="text-xs uppercase text-zinc-500">
                        {statusLabel(p.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">{t("student.noRecentPayments")}</p>
              )}
              <Link
                to="/student/payments"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {t("student.managePayments")}
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </Card>
          ) : null}

          {tab === "settings" ? (
            <Card className="rounded-3xl border-0 p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-primary-dark">{t("student.changePassword")}</h2>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-zinc-500">
                    {t("student.currentPassword")}
                  </span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={formControlClass}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-zinc-500">{t("student.newPassword")}</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={formControlClass}
                    minLength={6}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-zinc-500">
                    {t("student.confirmNewPassword")}
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={formControlClass}
                    minLength={6}
                    required
                  />
                </label>
                {passwordMismatch ? (
                  <p className="text-xs text-red-600">{t("student.passwordsDoNotMatch")}</p>
                ) : null}
                <Button
                  type="submit"
                  disabled={changePassword.isPending || passwordMismatch}
                  className="h-11 rounded-xl bg-primary-dark text-white"
                >
                  {changePassword.isPending ? t("student.updating") : t("student.updatePassword")}
                </Button>
              </form>
            </Card>
          ) : null}

          {tab === "application" ? (
            displayProfile?.applicationId && displayProfile?.applicationData ? (
              <ApplicationDataView
                applicationId={displayProfile.applicationId}
                applicationData={displayProfile.applicationData}
                onUpdate={async (appId, updatedData) => {
                  await updateApplicationData.mutateAsync({
                    applicationId: appId,
                    applicationData: updatedData,
                  });
                }}
                isUpdating={updateApplicationData.isPending}
              />
            ) : (
              <Card className="rounded-3xl border-0 p-6 shadow-sm">
                <p className="text-sm text-zinc-500 text-center py-4">
                  No application data found for your profile.
                </p>
              </Card>
            )
          ) : null}
        </>
      )}
    </PageContainer>
  );
}
