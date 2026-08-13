import type {
  StudentAdmissionStatus,
  StudentAdmissionView,
  StudentAdmissionClassDay,
} from "@/types/models";
import { parseWhatsApp } from "@/lib/whatsapp";
import {
  admissionConfirmedMessage,
  admissionFollowUpMessage,
} from "@/lib/whatsappMessageTemplates";
import { formatClockTime } from "@/i18n/format";
import { formatTrialMeetingPlatformLabel } from "@/lib/trialMeetingPlatform";
import type {
  PortalTranslate,
  StatusLabelFn,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

export type AdminStudentAdmissionsTab = "all" | StudentAdmissionStatus;

export const STUDENT_ADMISSION_STATUSES: StudentAdmissionStatus[] = [
  "new",
  "reviewing",
  "approved",
  "closed",
];

export const ADMISSION_CLASS_DAYS: StudentAdmissionClassDay[] = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const PACKAGE_DEFAULTS = {
  basic: { classesPerWeek: 2, durationMinutes: 30, monthlyFeeBdt: 2000, monthlyFeeUsd: 25 },
  standard: { classesPerWeek: 3, durationMinutes: 40, monthlyFeeBdt: 3000, monthlyFeeUsd: 35 },
  advance: { classesPerWeek: 4, durationMinutes: 50, monthlyFeeBdt: 4000, monthlyFeeUsd: 45 },
  premium: { classesPerWeek: 5, durationMinutes: 60, monthlyFeeBdt: 5000, monthlyFeeUsd: 55 },
} as const;

function getPackageDefaults(plan?: string) {
  const key = plan?.trim().toLowerCase() as keyof typeof PACKAGE_DEFAULTS;
  return PACKAGE_DEFAULTS[key] ?? PACKAGE_DEFAULTS.standard;
}

function parseClassTimeFrom24h(time?: string): {
  classTimeHour: string;
  classTimeMinute: string;
  classTimePeriod: "AM" | "PM";
} {
  if (!time?.trim()) {
    return { classTimeHour: "6", classTimeMinute: "00", classTimePeriod: "PM" };
  }
  const [hourRaw, minuteRaw] = time.split(":");
  const hour24 = Number.parseInt(hourRaw ?? "18", 10);
  const minute = minuteRaw?.padStart(2, "0") ?? "00";
  if (Number.isNaN(hour24)) {
    return { classTimeHour: "6", classTimeMinute: "00", classTimePeriod: "PM" };
  }
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return {
    classTimeHour: String(hour12),
    classTimeMinute: minute,
    classTimePeriod: period,
  };
}

export interface IAdmissionEnrollmentPayload {
  classStartDate?: string;
  classDays?: StudentAdmissionClassDay[];
  classesPerWeek?: number;
  classDurationMinutes?: number;
  classTimeHour?: string;
  classTimeMinute?: string;
  classTimePeriod?: "AM" | "PM";
  assignedTeacherSlug?: string;
  meetingPlatform?: string;
  meetingLink?: string;
  monthlyFeeAmount?: number;
  monthlyFeeCurrency?: "bdt" | "usd";
}

export function buildAdmissionEnrollmentFormState(application: StudentAdmissionView) {
  const formData = application.formData;
  const packagePlan =
    typeof formData.packagePlan === "string" ? formData.packagePlan : "standard";
  const defaults = getPackageDefaults(packagePlan);
  const preferredTime = parseClassTimeFrom24h(
    application.classTime ||
      (typeof formData.preferredHour === "string"
        ? `${formData.preferredHour}:${formData.preferredMinute ?? "00"}`
        : undefined)
  );

  if (formData.preferredPeriod === "AM" || formData.preferredPeriod === "PM") {
    preferredTime.classTimePeriod = formData.preferredPeriod;
  }
  if (typeof formData.preferredHour === "string") {
    preferredTime.classTimeHour = formData.preferredHour;
  }
  if (typeof formData.preferredMinute === "string") {
    preferredTime.classTimeMinute = formData.preferredMinute;
  }

  const currency =
    application.monthlyFeeCurrency ||
    (formData.admissionFeeCurrency === "usd" ? "usd" : "bdt");

  return {
    classStartDate: application.classStartDate ?? "",
    classDays: application.classDays?.length
      ? application.classDays
      : ([] as StudentAdmissionClassDay[]),
    classesPerWeek: application.classesPerWeek ?? defaults.classesPerWeek,
    classDurationMinutes:
      application.classDurationMinutes ?? defaults.durationMinutes,
    classTimeHour: preferredTime.classTimeHour,
    classTimeMinute: preferredTime.classTimeMinute,
    classTimePeriod: preferredTime.classTimePeriod,
    teacherSlug:
      application.assignedTeacherSlug ??
      (typeof formData.assignedTeacherSlug === "string"
        ? formData.assignedTeacherSlug
        : ""),
    meetingPlatform:
      application.meetingPlatform ??
      (typeof formData.meetingPlatform === "string"
        ? (formData.meetingPlatform as
            | "google_meet"
            | "zoom"
            | "teams"
            | "whatsapp"
            | "custom"
            | "")
        : ""),
    meetingLink:
      application.meetingLink ??
      (typeof formData.meetingLink === "string" ? formData.meetingLink : ""),
    monthlyFeeAmount:
      application.monthlyFeeAmount ??
      (currency === "usd" ? defaults.monthlyFeeUsd : defaults.monthlyFeeBdt),
    monthlyFeeCurrency: currency,
  };
}

export interface IAdminStudentAdmissionsStats {
  total: number;
  new: number;
  reviewing: number;
  underReview: number;
  approved: number;
  closed: number;
  newToday: number;
  newThisWeek: number;
  conversionRate: number;
}

export type DynamicLabelFn = (key: string) => string;

export function admissionStatusStyles(status: StudentAdmissionStatus): string {
  switch (status) {
    case "reviewing":
      return "border-orange-500/35 bg-orange-500/10 text-orange-800";
    case "approved":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    case "closed":
      return "border-red-500/35 bg-red-500/10 text-red-800";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

function formatSlug(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRawValue(
  value: unknown,
  dynamicLabel: DynamicLabelFn
): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => formatRawValue(item, dynamicLabel))
      .filter((part): part is string => Boolean(part));
    return parts.length > 0 ? parts.join(", ") : null;
  }
  if (typeof value === "object") return null;
  const str = String(value).trim();
  if (!str) return null;
  return dynamicLabel(str) !== str.replace(/_/g, " ")
    ? dynamicLabel(str)
    : dynamicLabel(str.replace(/-/g, "_")) !== str.replace(/-/g, "_")
      ? dynamicLabel(str.replace(/-/g, "_"))
      : str;
}

export function getAdmissionFeeSummary(
  app: StudentAdmissionView,
  dynamicLabel: DynamicLabelFn
): string | null {
  const formData = app.formData;
  const amount = formatRawValue(formData.admissionFeeAmount, dynamicLabel);
  const currency = formatRawValue(formData.admissionFeeCurrency, dynamicLabel);
  const method = formatRawValue(formData.admissionFeePaymentMethod, dynamicLabel);

  if (!amount && !method) return null;
  if (amount && currency) {
    return method ? `${amount} ${currency} · ${method}` : `${amount} ${currency}`;
  }
  return method;
}

export function getAdmissionCountry(app: StudentAdmissionView): string | null {
  const formData = app.formData;
  return (
    formatRawValue(formData.currentCountry, (k) => k) ??
    formatRawValue(formData.country, (k) => k) ??
    formatRawValue(formData.nationality, (k) => k)
  );
}

export function getAdmissionProgram(
  app: StudentAdmissionView,
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): string {
  const formData = app.formData;
  const course =
    formatRawValue(formData.courseInterest, dynamicLabel) ??
    formatRawValue(formData.programInterest, dynamicLabel) ??
    formatRawValue(formData.topicsOfInterest, dynamicLabel);

  if (!course) return t("admin.admissions.generalProgram");
  if (course.includes(",")) {
    return course
      .split(",")
      .map((part) => {
        const trimmed = part.trim();
        const labeled = dynamicLabel(trimmed.replace(/-/g, "_"));
        return labeled !== trimmed.replace(/-/g, "_") ? labeled : formatSlug(trimmed);
      })
      .join(", ");
  }
  const labeled = dynamicLabel(course.replace(/-/g, "_"));
  return labeled !== course.replace(/-/g, "_") ? labeled : formatSlug(course);
}

export function getAdmissionProgramDetail(
  app: StudentAdmissionView,
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): string {
  const formData = app.formData;
  const parts = [
    formatRawValue(formData.classType, dynamicLabel),
    formatRawValue(formData.packagePlan ?? formData.packageName, dynamicLabel),
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : t("admin.admissions.sourceAdmissionForm");
}

export function getAdmissionSource(
  app: StudentAdmissionView,
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): string {
  const source = formatRawValue(app.formData.referralSources, dynamicLabel);
  return source ?? t("admin.admissions.sourceWebsite");
}

export function getAdmissionSourceDetail(t: PortalTranslate): string {
  return t("admin.admissions.sourceAdmissionForm");
}

export function buildAdmissionWhatsAppMessage(
  app: StudentAdmissionView,
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): string {
  if (app.status !== "approved" && app.status !== "closed") {
    return admissionFollowUpMessage(app.fullName);
  }

  const planDetail = getAdmissionProgramDetail(app, t, dynamicLabel);
  const plan =
    planDetail === t("admin.admissions.sourceAdmissionForm") ? undefined : planDetail;

  const monthlyFee =
    app.monthlyFeeAmount != null
      ? `${app.monthlyFeeAmount} ${app.monthlyFeeCurrency === "usd" ? "USD" : "BDT"}`
      : getAdmissionFeeSummary(app, dynamicLabel) ?? undefined;

  const paymentStatus =
    app.paymentStatus === "verified"
      ? "Verified"
      : app.paymentStatus === "rejected"
        ? "Rejected"
        : app.paymentStatus === "pending"
          ? "Pending"
          : undefined;

  const startDate = app.classStartDate
    ? new Date(`${app.classStartDate}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : undefined;

  return admissionConfirmedMessage({
    name: app.fullName,
    status: app.status,
    program: getAdmissionProgram(app, t, dynamicLabel),
    plan,
    teacherName: app.assignedTeacherName?.trim() || undefined,
    classDays: app.classDays,
    classTime: app.classTime ? formatClockTime(app.classTime) : undefined,
    durationMinutes: app.classDurationMinutes,
    classesPerWeek: app.classesPerWeek,
    startDate,
    platform: app.meetingPlatform
      ? formatTrialMeetingPlatformLabel(app.meetingPlatform, t)
      : undefined,
    meetingLink: app.meetingLink?.trim() || undefined,
    monthlyFee,
    paymentStatus,
  });
}

export function admissionSearchText(app: StudentAdmissionView): string {
  const fee = app.formData;
  return [
    app.fullName,
    app.email,
    app.whatsapp,
    getAdmissionCountry(app),
    fee.admissionFeeAmount,
    fee.admissionPaymentReference,
    fee.admissionFeePaymentMethod,
    app.adminNote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function computeStudentAdmissionsStats(
  applications: StudentAdmissionView[]
): IAdminStudentAdmissionsStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  let newToday = 0;
  let newThisWeek = 0;

  for (const app of applications) {
    const created = new Date(app.createdAt);
    if (created >= todayStart && app.status === "new") newToday += 1;
    if (created >= weekStart) newThisWeek += 1;
  }

  const newCount = applications.filter((app) => app.status === "new").length;
  const reviewing = applications.filter((app) => app.status === "reviewing").length;
  const approved = applications.filter((app) => app.status === "approved").length;
  const total = applications.length;

  return {
    total,
    new: newCount,
    reviewing,
    underReview: newCount + reviewing,
    approved,
    closed: applications.filter((app) => app.status === "closed").length,
    newToday,
    newThisWeek,
    conversionRate: total > 0 ? Math.round((approved / total) * 100) : 0,
  };
}

export function extractProgramOptions(
  applications: StudentAdmissionView[],
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): string[] {
  const programs = new Set<string>();
  for (const app of applications) {
    const program = getAdmissionProgram(app, t, dynamicLabel);
    if (program !== t("admin.admissions.generalProgram")) programs.add(program);
  }
  return [...programs].sort((a, b) => a.localeCompare(b));
}

export function extractCountryOptions(applications: StudentAdmissionView[]): string[] {
  const countries = new Set<string>();
  for (const app of applications) {
    const country = getAdmissionCountry(app);
    if (country) countries.add(country);
  }
  return [...countries].sort((a, b) => a.localeCompare(b));
}

export function extractSourceOptions(
  applications: StudentAdmissionView[],
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): string[] {
  const sources = new Set<string>();
  for (const app of applications) {
    sources.add(getAdmissionSource(app, t, dynamicLabel));
  }
  return [...sources].sort((a, b) => a.localeCompare(b));
}

export function filterStudentAdmissions(
  applications: StudentAdmissionView[],
  options: {
    tab: AdminStudentAdmissionsTab;
    search: string;
    programFilter: string;
    countryFilter: string;
    sourceFilter: string;
    dateFrom: string;
    dateTo: string;
    t: PortalTranslate;
    dynamicLabel: DynamicLabelFn;
  }
): StudentAdmissionView[] {
  const query = options.search.trim().toLowerCase();

  return applications
    .filter((app) => {
      if (options.tab !== "all" && app.status !== options.tab) return false;
      if (
        options.programFilter &&
        getAdmissionProgram(app, options.t, options.dynamicLabel) !== options.programFilter
      ) {
        return false;
      }
      if (options.countryFilter && getAdmissionCountry(app) !== options.countryFilter) {
        return false;
      }
      if (
        options.sourceFilter &&
        getAdmissionSource(app, options.t, options.dynamicLabel) !== options.sourceFilter
      ) {
        return false;
      }

      const created = new Date(app.createdAt);
      if (options.dateFrom && created < new Date(`${options.dateFrom}T00:00:00`)) return false;
      if (options.dateTo && created > new Date(`${options.dateTo}T23:59:59`)) return false;

      if (!query) return true;
      return admissionSearchText(app).includes(query);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function nextAdmissionStatus(
  status: StudentAdmissionStatus
): StudentAdmissionStatus | null {
  switch (status) {
    case "new":
      return "reviewing";
    case "reviewing":
      return "approved";
    case "approved":
      return "closed";
    default:
      return null;
  }
}

export function nextAdmissionActionLabel(
  status: StudentAdmissionStatus,
  t: PortalTranslate,
  statusLabel: StatusLabelFn
): string | null {
  const next = nextAdmissionStatus(status);
  if (!next) return null;
  switch (next) {
    case "reviewing":
      return t("admin.admissions.actionStartReview");
    case "approved":
      return t("admin.admissions.actionApprove");
    case "closed":
      return t("admin.admissions.actionClose");
    default:
      return statusLabel(next);
  }
}

export function admissionStatusActions(
  status: StudentAdmissionStatus,
  t: PortalTranslate
): { label: string; status: StudentAdmissionStatus }[] {
  switch (status) {
    case "new":
      return [{ label: t("admin.admissions.actionStartReview"), status: "reviewing" }];
    case "reviewing":
      return [
        { label: t("admin.admissions.actionApprove"), status: "approved" },
        { label: t("admin.admissions.actionClose"), status: "closed" },
      ];
    case "approved":
      return [{ label: t("admin.admissions.actionClose"), status: "closed" }];
    default:
      return [];
  }
}

export function admissionTelHref(raw: string, countryHint?: string): string | null {
  const parsed = parseWhatsApp(raw, countryHint);
  if (!parsed.ok) return null;
  return `tel:${parsed.value.e164}`;
}

export function admissionMailtoHref(
  app: StudentAdmissionView,
  t: PortalTranslate
): string {
  const subject = encodeURIComponent(t("admin.admissions.modalTitle"));
  const body = encodeURIComponent(
    t("admin.trialLeads.mailBodyIntro", { name: app.fullName })
  );
  return `mailto:${app.email}?subject=${subject}&body=${body}`;
}

export function groupAdmissionSources(
  applications: StudentAdmissionView[],
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const app of applications) {
    const label = getAdmissionSource(app, t, dynamicLabel);
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function groupAdmissionPrograms(
  applications: StudentAdmissionView[],
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const app of applications) {
    const label = getAdmissionProgram(app, t, dynamicLabel);
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportStudentAdmissionsFile(
  applications: StudentAdmissionView[],
  filenamePrefix: string,
  t: PortalTranslate,
  dynamicLabel: DynamicLabelFn
): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    t("admin.trialLeads.csvName"),
    t("admin.trialLeads.csvEmail"),
    t("admin.trialLeads.csvWhatsapp"),
    t("admin.admissions.tableProgram"),
    t("admin.admissions.tableCountry"),
    t("admin.admissions.tableSource"),
    t("admin.trialLeads.csvStatus"),
    t("admin.admissions.tableSubmitted"),
  ];
  const lines = [
    header.join(","),
    ...applications.map((app) =>
      [
        csvEscape(app.fullName),
        csvEscape(app.email),
        csvEscape(app.whatsapp),
        csvEscape(getAdmissionProgram(app, t, dynamicLabel)),
        csvEscape(getAdmissionCountry(app) ?? ""),
        csvEscape(getAdmissionSource(app, t, dynamicLabel)),
        csvEscape(app.status),
        csvEscape(app.createdAt),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
