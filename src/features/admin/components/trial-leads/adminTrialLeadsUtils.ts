import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import {
  formatTrialBangladeshSchedule,
  formatTrialParentSchedule,
} from "@/lib/trialScheduleDisplay";
import { formatTrialMeetingPlatformLabel } from "@/lib/trialMeetingPlatform";
import { parseWhatsApp } from "@/lib/whatsapp";

export type AdminTrialLeadsTab = "all" | TrialBookingStatus;

export type PortalTranslate = (
  key: string,
  params?: Record<string, string>
) => string;

export type StatusLabelFn = (status: string) => string;

export interface IAdminTrialLeadsStats {
  total: number;
  pending: number;
  contacted: number;
  scheduled: number;
  reviewing: number;
  approved: number;
  rejected: number;
  newToday: number;
  newThisWeek: number;
}

export function trialLeadStatusStyles(status: TrialBookingStatus): string {
  switch (status) {
    case "contacted":
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
    case "scheduled":
      return "border-violet-500/35 bg-violet-500/10 text-violet-800";
    case "rejected":
      return "border-red-500/35 bg-red-500/10 text-red-800";
    case "reviewing":
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

export function formatCourseInterest(
  slug: string | undefined,
  t: PortalTranslate
): string {
  if (!slug) return t("admin.trialLeads.generalTrialClass");
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatLeadSource(
  booking: TrialBookingView,
  t: PortalTranslate
): string {
  if (booking.source?.trim()) return booking.source.trim();
  if (booking.utmSource?.trim()) return booking.utmSource.trim();
  return t("admin.trialLeads.sourceWebsite");
}

export function formatLeadSourceDetail(
  booking: TrialBookingView,
  t: PortalTranslate
): string {
  if (booking.utmMedium?.trim()) return booking.utmMedium.trim();
  return t("admin.trialLeads.sourceFreeTrialForm");
}

const LEGACY_GENDER_PREFIX = "Learner: ";

export function extractTrialLeadGender(
  booking: TrialBookingView
): "male" | "female" | undefined {
  if (booking.learnerGender === "male" || booking.learnerGender === "female") {
    return booking.learnerGender;
  }
  const legacy = booking.preferredDays.find((entry) =>
    entry.startsWith(LEGACY_GENDER_PREFIX)
  );
  if (!legacy) return undefined;
  const value = legacy.slice(LEGACY_GENDER_PREFIX.length).trim();
  return value === "male" || value === "female" ? value : undefined;
}

export function extractTrialLeadPreferredTimes(booking: TrialBookingView): string[] {
  return booking.preferredDays.filter(
    (entry) => !entry.startsWith(LEGACY_GENDER_PREFIX)
  );
}

const TIME_SLOT_I18N: Record<NonNullable<TrialBookingView["timeSlot"]>, string> = {
  anytime: "admin.trialLeads.timeSlotAnytime",
  early_morning: "admin.trialLeads.timeSlotEarlyMorning",
  morning: "admin.trialLeads.timeSlotMorning",
  afternoon: "admin.trialLeads.timeSlotAfternoon",
  evening: "admin.trialLeads.timeSlotEvening",
  late_evening: "admin.trialLeads.timeSlotLateEvening",
};

const LEARNER_TYPE_I18N: Record<TrialBookingView["learnerType"], string> = {
  child: "admin.trialLeads.learnerTypeChild",
  teen: "admin.trialLeads.learnerTypeTeen",
  adult: "admin.trialLeads.learnerTypeAdult",
};

const TEACHER_PREFERENCE_I18N: Record<TrialBookingView["teacherPreference"], string> = {
  any: "admin.trialLeads.teacherPreferenceAny",
  male: "admin.trialLeads.teacherPreferenceMale",
  female: "admin.trialLeads.teacherPreferenceFemale",
};

export function formatTrialTimeSlot(
  slot: TrialBookingView["timeSlot"],
  t: PortalTranslate
): string {
  if (!slot) return t("admin.trialLeads.notProvided");
  return t(TIME_SLOT_I18N[slot]);
}

export function formatLearnerTypeLabel(
  learnerType: TrialBookingView["learnerType"],
  t: PortalTranslate
): string {
  return t(LEARNER_TYPE_I18N[learnerType]);
}

export function formatTeacherPreferenceLabel(
  preference: TrialBookingView["teacherPreference"],
  t: PortalTranslate
): string {
  return t(TEACHER_PREFERENCE_I18N[preference]);
}

export interface ITrialLeadDisplayRow {
  key: string;
  label: string;
  value: string;
  fullWidth?: boolean;
}

export interface ITrialLeadDisplaySection {
  title: string;
  rows: ITrialLeadDisplayRow[];
}

export function buildTrialLeadDisplaySections(
  lead: TrialBookingView,
  t: PortalTranslate
): ITrialLeadDisplaySection[] {
  const gender = extractTrialLeadGender(lead);
  const preferredTimes = extractTrialLeadPreferredTimes(lead);
  const genderLabel =
    gender === "male"
      ? t("admin.trialLeads.genderMale")
      : gender === "female"
        ? t("admin.trialLeads.genderFemale")
        : t("admin.trialLeads.notProvided");

  const parentLocalSchedule = formatTrialParentSchedule(
    lead.preferredTrialDate,
    lead.preferredTrialTime,
    lead.timezone
  );
  const bdSchedule = formatTrialBangladeshSchedule(
    lead.preferredTrialDate,
    lead.preferredTrialTime,
    lead.timezone
  );

  return [
    {
      title: t("admin.trialLeads.modalSectionContact"),
      rows: [
        { key: "parentName", label: t("admin.trialLeads.fieldParentName"), value: lead.parentName },
        {
          key: "studentName",
          label: t("admin.trialLeads.fieldStudentName"),
          value: lead.studentName?.trim() || t("admin.trialLeads.notProvided"),
        },
        { key: "whatsapp", label: t("admin.trialLeads.csvWhatsapp"), value: lead.whatsapp },
        {
          key: "email",
          label: t("admin.trialLeads.csvEmail"),
          value: lead.email?.trim() || t("admin.trialLeads.notProvided"),
        },
        {
          key: "country",
          label: t("admin.trialLeads.csvCountry"),
          value: lead.country?.trim() || t("admin.trialLeads.notProvided"),
        },
      ],
    },
    {
      title: t("admin.trialLeads.modalSectionLearner"),
      rows: [
        {
          key: "age",
          label: t("admin.trialLeads.fieldAge"),
          value: lead.age?.trim() || t("admin.trialLeads.notProvided"),
        },
        { key: "gender", label: t("admin.trialLeads.fieldGender"), value: genderLabel },
        {
          key: "learnerType",
          label: t("admin.trialLeads.fieldLearnerType"),
          value: formatLearnerTypeLabel(lead.learnerType, t),
        },
      ],
    },
    {
      title: t("admin.trialLeads.modalSectionBooking"),
      rows: [
        {
          key: "course",
          label: t("admin.trialLeads.csvCourse"),
          value: formatCourseInterest(lead.courseSlug, t),
        },
        {
          key: "teacher",
          label: t("admin.trialLeads.fieldTeacherPreference"),
          value: formatTeacherPreferenceLabel(lead.teacherPreference, t),
        },
        ...(parentLocalSchedule
          ? [
              {
                key: "trialLocal",
                label: t("admin.trialLeads.fieldTrialLocalTime"),
                value: parentLocalSchedule,
              },
              {
                key: "trialBd",
                label: t("admin.trialLeads.fieldTrialBdTime"),
                value: bdSchedule ?? t("admin.trialLeads.notProvided"),
              },
            ]
          : [
              {
                key: "timeSlot",
                label: t("admin.trialLeads.fieldTimeSlot"),
                value: formatTrialTimeSlot(lead.timeSlot, t),
              },
              {
                key: "preferredTimes",
                label: t("admin.trialLeads.fieldPreferredTimes"),
                value:
                  preferredTimes.length > 0
                    ? preferredTimes.join(", ")
                    : t("admin.trialLeads.notProvided"),
                fullWidth: true,
              },
            ]),
        {
          key: "timezone",
          label: t("admin.trialLeads.fieldTimezone"),
          value: lead.timezone?.trim() || t("admin.trialLeads.notProvided"),
        },
        {
          key: "additionalNote",
          label: t("admin.trialLeads.fieldAdditionalNote"),
          value: lead.additionalNote?.trim() || t("admin.trialLeads.notProvided"),
          fullWidth: true,
        },
      ],
    },
    {
      title: t("admin.trialLeads.modalSectionScheduling"),
      rows: [
        {
          key: "assignedTeacher",
          label: t("admin.trialLeads.fieldAssignedTeacher"),
          value: lead.teacherSlug?.trim() || t("admin.trialLeads.notProvided"),
        },
        {
          key: "meetingPlatform",
          label: t("admin.trialLeads.fieldMeetingPlatform"),
          value: formatTrialMeetingPlatformLabel(lead.meetingPlatform, t),
        },
        {
          key: "meetingLink",
          label: t("admin.trialLeads.fieldMeetingLink"),
          value: lead.meetingLink?.trim() || t("admin.trialLeads.notProvided"),
          fullWidth: true,
        },
        {
          key: "invitationSent",
          label: t("admin.trialLeads.fieldInvitationSent"),
          value: lead.invitationSentAt
            ? t("admin.trialLeads.invitationSentYes")
            : t("admin.trialLeads.invitationNotSent"),
        },
        {
          key: "converted",
          label: t("admin.trialLeads.fieldConverted"),
          value: lead.convertedAdmissionId
            ? t("admin.trialLeads.convertedYes")
            : t("admin.trialLeads.convertedNo"),
        },
      ],
    },
    {
      title: t("admin.trialLeads.modalSectionSource"),
      rows: [
        {
          key: "source",
          label: t("admin.trialLeads.csvSource"),
          value: formatLeadSource(lead, t),
        },
        {
          key: "sourceDetail",
          label: t("admin.trialLeads.fieldSourceDetail"),
          value: formatLeadSourceDetail(lead, t),
        },
        {
          key: "utmSource",
          label: t("admin.trialLeads.fieldUtmSource"),
          value: lead.utmSource?.trim() || t("admin.trialLeads.notProvided"),
        },
        {
          key: "utmMedium",
          label: t("admin.trialLeads.fieldUtmMedium"),
          value: lead.utmMedium?.trim() || t("admin.trialLeads.notProvided"),
        },
        {
          key: "utmCampaign",
          label: t("admin.trialLeads.fieldUtmCampaign"),
          value: lead.utmCampaign?.trim() || t("admin.trialLeads.notProvided"),
        },
      ],
    },
  ];
}

export function trialLeadStatusActions(
  status: TrialBookingStatus,
  t: PortalTranslate,
  statusLabel: StatusLabelFn
): { status: TrialBookingStatus; label: string }[] {
  const next = nextTrialLeadStatus(status);
  if (!next) return [];
  const label = nextTrialLeadActionLabel(status, t, statusLabel);
  if (!label) return [];
  return [{ status: next, label }];
}

export function leadSearchText(booking: TrialBookingView): string {
  const gender = extractTrialLeadGender(booking);
  return [
    booking.parentName,
    booking.studentName,
    booking.email,
    booking.whatsapp,
    booking.country,
    booking.age,
    gender,
    booking.courseSlug,
    booking.source,
    booking.utmSource,
    booking.timezone,
    booking.preferredTrialDate,
    booking.preferredTrialTime,
    booking.additionalNote,
    ...extractTrialLeadPreferredTimes(booking),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function computeTrialLeadsStats(bookings: TrialBookingView[]): IAdminTrialLeadsStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  let newToday = 0;
  let newThisWeek = 0;

  for (const booking of bookings) {
    const created = new Date(booking.createdAt);
    if (created >= todayStart && booking.status === "pending") newToday += 1;
    if (created >= weekStart) newThisWeek += 1;
  }

  return {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === "pending").length,
    contacted: bookings.filter((booking) => booking.status === "contacted").length,
    scheduled: bookings.filter((booking) => booking.status === "scheduled").length,
    reviewing: bookings.filter((booking) => booking.status === "reviewing").length,
    approved: bookings.filter((booking) => booking.status === "approved").length,
    rejected: bookings.filter((booking) => booking.status === "rejected").length,
    newToday,
    newThisWeek,
  };
}

export function extractCourseOptions(bookings: TrialBookingView[]): string[] {
  const slugs = new Set<string>();
  for (const booking of bookings) {
    if (booking.courseSlug?.trim()) slugs.add(booking.courseSlug.trim());
  }
  return [...slugs].sort((a, b) => a.localeCompare(b));
}

export function extractSourceOptions(
  bookings: TrialBookingView[],
  t: PortalTranslate
): string[] {
  const sources = new Set<string>();
  for (const booking of bookings) {
    sources.add(formatLeadSource(booking, t));
  }
  return [...sources].sort((a, b) => a.localeCompare(b));
}

export function filterTrialLeads(
  bookings: TrialBookingView[],
  options: {
    tab: AdminTrialLeadsTab;
    search: string;
    courseFilter: string;
    sourceFilter: string;
    dateFrom: string;
    dateTo: string;
    t: PortalTranslate;
  }
): TrialBookingView[] {
  const query = options.search.trim().toLowerCase();

  return bookings
    .filter((booking) => {
      if (options.tab !== "all" && booking.status !== options.tab) return false;
      if (options.courseFilter && booking.courseSlug !== options.courseFilter) return false;
      if (
        options.sourceFilter &&
        formatLeadSource(booking, options.t) !== options.sourceFilter
      ) {
        return false;
      }

      const created = new Date(booking.createdAt);
      if (options.dateFrom && created < new Date(`${options.dateFrom}T00:00:00`)) return false;
      if (options.dateTo && created > new Date(`${options.dateTo}T23:59:59`)) return false;

      if (!query) return true;
      return leadSearchText(booking).includes(query);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function groupLeadSources(
  bookings: TrialBookingView[],
  t: PortalTranslate
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const booking of bookings) {
    const label = formatLeadSource(booking, t);
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTodayLeads(bookings: TrialBookingView[]): TrialBookingView[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return bookings
    .filter((booking) => new Date(booking.createdAt) >= todayStart)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function nextTrialLeadStatus(
  status: TrialBookingStatus
): TrialBookingStatus | null {
  switch (status) {
    case "pending":
      return "contacted";
    case "contacted":
      return "scheduled";
    case "scheduled":
      return "reviewing";
    case "reviewing":
      return "approved";
    case "approved":
      return "rejected";
    default:
      return null;
  }
}

export const TRIAL_LEAD_STATUSES: TrialBookingStatus[] = [
  "pending",
  "contacted",
  "scheduled",
  "reviewing",
  "approved",
  "rejected",
];

export const TRIAL_LEAD_AGE_OPTIONS = [
  ...Array.from({ length: 67 }, (_, index) => String(index + 4)),
  "70+",
];

export interface ITrialLeadUpdatePayload {
  parentName?: string;
  studentName?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  age?: string;
  learnerGender?: "male" | "female";
  preferredTrialDate?: string;
  preferredTrialTime?: string;
  additionalNote?: string;
  teacherSlug?: string;
  meetingPlatform?: "google_meet" | "zoom" | "teams" | "whatsapp" | "custom";
  meetingLink?: string;
  teacherPreference?: "any" | "female" | "male";
  preferredDays?: string[];
  timezone?: string;
  courseSlug?: string;
  status?: TrialBookingStatus;
}

export interface ITrialLeadSchedulingPayload {
  teacherSlug: string;
  meetingPlatform?: "google_meet" | "zoom" | "teams" | "whatsapp" | "custom";
  meetingLink: string;
}

export interface ITrialInvitationDelivery {
  emailSent: boolean;
  emailError?: string;
  whatsappUrl: string | null;
}

export function buildTrialLeadEditDefaults(lead: TrialBookingView) {
  return {
    parentName: lead.parentName,
    studentName: lead.studentName ?? "",
    email: lead.email ?? "",
    whatsapp: lead.whatsapp,
    country: lead.country ?? "Bangladesh",
    age: lead.age ?? "",
    learnerGender: extractTrialLeadGender(lead) ?? ("male" as const),
    courseSlug: lead.courseSlug ?? "",
    teacherPreference: lead.teacherPreference,
    preferredTrialDate: lead.preferredTrialDate ?? "",
    preferredTrialTime: lead.preferredTrialTime ?? "",
    additionalNote: lead.additionalNote ?? "",
    preferredTimes: extractTrialLeadPreferredTimes(lead).join(", "),
    timezone: lead.timezone ?? "",
    status: lead.status,
  };
}

export function nextTrialLeadActionLabel(
  status: TrialBookingStatus,
  t: PortalTranslate,
  statusLabel: StatusLabelFn
): string | null {
  const next = nextTrialLeadStatus(status);
  if (!next) return null;
  return t("admin.trialLeads.markStatus", {
    status: statusLabel(next).toLowerCase(),
  });
}

export function trialLeadTelHref(raw: string, country?: string): string | null {
  const parsed = parseWhatsApp(raw, country);
  if (!parsed.ok) return null;
  return `tel:${parsed.value.e164}`;
}

export function trialLeadMailtoHref(
  email: string | undefined,
  parentName: string,
  t: PortalTranslate
): string | null {
  const trimmed = email?.trim();
  if (!trimmed) return null;

  const subject = encodeURIComponent(t("admin.trialLeads.mailSubject"));
  const body = encodeURIComponent(
    t("admin.trialLeads.mailBodyIntro", { name: parentName })
  );

  return `mailto:${trimmed}?subject=${subject}&body=${body}`;
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

export function exportTrialLeadsFile(
  bookings: TrialBookingView[],
  filenamePrefix: string,
  t: PortalTranslate
): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    t("admin.trialLeads.csvName"),
    t("admin.trialLeads.csvEmail"),
    t("admin.trialLeads.csvWhatsapp"),
    t("admin.trialLeads.csvCountry"),
    t("admin.trialLeads.fieldAge"),
    t("admin.trialLeads.fieldGender"),
    t("admin.trialLeads.fieldLearnerType"),
    t("admin.trialLeads.csvCourse"),
    t("admin.trialLeads.fieldTeacherPreference"),
    t("admin.trialLeads.fieldPreferredTimes"),
    t("admin.trialLeads.fieldTimezone"),
    t("admin.trialLeads.csvSource"),
    t("admin.trialLeads.csvStatus"),
    t("admin.trialLeads.csvRequestedAt"),
  ];
  const lines = [
    header.join(","),
    ...bookings.map((booking) => {
      const gender = extractTrialLeadGender(booking);
      const preferredTimes = extractTrialLeadPreferredTimes(booking);
      return [
        csvEscape(booking.parentName),
        csvEscape(booking.email ?? ""),
        csvEscape(booking.whatsapp),
        csvEscape(booking.country ?? ""),
        csvEscape(booking.age ?? ""),
        csvEscape(gender ?? ""),
        csvEscape(formatLearnerTypeLabel(booking.learnerType, t)),
        csvEscape(formatCourseInterest(booking.courseSlug, t)),
        csvEscape(formatTeacherPreferenceLabel(booking.teacherPreference, t)),
        csvEscape(preferredTimes.join("; ")),
        csvEscape(booking.timezone ?? ""),
        csvEscape(formatLeadSource(booking, t)),
        csvEscape(booking.status),
        csvEscape(booking.createdAt),
      ].join(",");
    }),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
