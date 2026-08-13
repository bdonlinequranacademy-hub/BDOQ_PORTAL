import type { TeacherApplicationStatus, TeacherApplicationView } from "@/types/models";
import { parseWhatsApp } from "@/lib/whatsapp";
import { toViewableUploadUrl } from "@/lib/toViewableUploadUrl";
import type {
  PortalTranslate,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

export type DynamicLabelFn = (key: string) => string;

export type AdminTeacherApplicationsTab = "all" | TeacherApplicationStatus;

export interface IAdminTeacherApplicationsStats {
  total: number;
  new: number;
  reviewing: number;
  underReview: number;
  approved: number;
  rejected: number;
  closed: number;
  newToday: number;
  newThisWeek: number;
}

const STATUS_LABELS: Record<TeacherApplicationStatus, string> = {
  new: "New",
  reviewing: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  closed: "Closed",
};

const SUBJECT_LABELS: Record<string, string> = {
  "quran-education": "Quran education",
  "quran-recitation": "Quran recitation",
  tajweed: "Tajweed",
  hifz: "Hifz",
  "surah-memorization": "Surah memorization",
  "islamic-studies": "Islamic studies",
  tafsir: "Tafsir",
  "seerah-history": "Seerah & history",
  arabic: "Arabic",
  urdu: "Urdu",
  english: "English",
  adab: "Adab",
  "noorani-qaida": "Noorani Qaida",
};

const VALUE_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  single: "Single",
  married: "Married",
  divorced: "Divorced",
  widowed: "Widowed",
  yes: "Yes",
  no: "No",
  bengali: "Bengali",
  english: "English",
  arabic: "Arabic",
  urdu: "Urdu",
  facebook: "Facebook",
  youtube: "YouTube",
  google: "Google search",
  friend: "Friend or family",
  laptop: "Laptop",
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
  wifi: "Wi‑Fi",
  both: "Wi‑Fi and mobile data",
  morning: "Morning",
  noon: "Noon",
  evening: "Evening",
  night: "Night",
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export const TEACHER_APPLICATION_STATUSES: TeacherApplicationStatus[] = [
  "new",
  "reviewing",
  "approved",
  "rejected",
  "closed",
];

export function getTeacherWhatsAppNumber(app: TeacherApplicationView): string {
  const fromForm = app.formData.whatsapp;
  if (typeof fromForm === "string" && fromForm.trim()) return fromForm.trim();
  return app.phone?.trim() ?? "";
}

export function teacherApplicationStatusLabel(status: TeacherApplicationStatus): string {
  return STATUS_LABELS[status];
}

export function teacherApplicationStatusStyles(status: TeacherApplicationStatus): string {
  switch (status) {
    case "reviewing":
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
    case "approved":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    case "rejected":
      return "border-red-500/35 bg-red-500/10 text-red-800";
    case "closed":
      return "border-violet-500/35 bg-violet-500/10 text-violet-800";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

function formatRawValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => formatRawValue(item))
      .filter((part): part is string => Boolean(part));
    return parts.length > 0 ? parts.join(", ") : null;
  }
  if (typeof value === "object") return null;
  const str = String(value).trim();
  if (!str) return null;
  return VALUE_LABELS[str] ?? SUBJECT_LABELS[str] ?? str;
}

function formatSubject(value: string): string {
  return SUBJECT_LABELS[value] ?? value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getTeacherSubjects(app: TeacherApplicationView): string[] {
  const raw = app.formData.subjects;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === "string" ? formatSubject(item) : null))
    .filter((item): item is string => Boolean(item));
}

export function formatTeacherSubjectsSummary(
  app: TeacherApplicationView,
  maxVisible = 2
): { visible: string; extra: number } {
  const subjects = getTeacherSubjects(app);
  if (subjects.length === 0) {
    return { visible: "Not specified", extra: 0 };
  }
  const visible = subjects.slice(0, maxVisible).join(", ");
  const extra = Math.max(subjects.length - maxVisible, 0);
  return { visible, extra };
}

export function getTeacherExperience(app: TeacherApplicationView): string {
  return (
    formatRawValue(app.formData.teachingExperience) ??
    formatRawValue(app.formData.experience) ??
    "Not specified"
  );
}

export function getTeacherQualification(app: TeacherApplicationView): string {
  const parts = [
    formatRawValue(app.formData.educationQualification),
    formatRawValue(app.formData.educationSubject),
    formatRawValue(app.formData.educationInstitution),
    formatRawValue(app.formData.islamicQualification),
  ].filter((part): part is string => Boolean(part));

  if (parts.length === 0) return "Not specified";
  return parts.slice(0, 2).join(" · ");
}

export function getTeacherQualificationDetail(app: TeacherApplicationView): string {
  const institution = formatRawValue(app.formData.educationInstitution);
  const country = getTeacherCountry(app);
  if (institution && country) return `${institution}, ${country}`;
  return institution ?? country ?? "Teacher registration form";
}

export function getTeacherCountry(app: TeacherApplicationView): string | null {
  const formData = app.formData;
  return (
    formatRawValue(formData.currentCountry) ??
    formatRawValue(formData.country) ??
    formatRawValue(formData.nationality) ??
    formatRawValue(formData.permanentCountry)
  );
}

export function getTeacherLocation(app: TeacherApplicationView): string | null {
  const city =
    formatRawValue(app.formData.currentCity) ?? formatRawValue(app.formData.permanentCity);
  const country = getTeacherCountry(app);
  if (city && country) return `${city}, ${country}`;
  return city ?? country;
}

export function formatAppliedAt(iso: string): { date: string; time: string } {
  const value = new Date(iso);
  return {
    date: value
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase(),
    time: value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export function teacherApplicationSearchText(app: TeacherApplicationView): string {
  return [
    app.fullName,
    app.email,
    app.phone,
    getTeacherLocation(app),
    getTeacherSubjects(app).join(" "),
    getTeacherExperience(app),
    getTeacherQualification(app),
    app.adminNote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function computeTeacherApplicationsStats(
  applications: TeacherApplicationView[]
): IAdminTeacherApplicationsStats {
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

  return {
    total: applications.length,
    new: newCount,
    reviewing,
    underReview: newCount + reviewing,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
    closed: applications.filter((app) => app.status === "closed").length,
    newToday,
    newThisWeek,
  };
}

export function extractSubjectOptions(applications: TeacherApplicationView[]): string[] {
  const subjects = new Set<string>();
  for (const app of applications) {
    for (const subject of getTeacherSubjects(app)) {
      subjects.add(subject);
    }
  }
  return [...subjects].sort((a, b) => a.localeCompare(b));
}

export function extractTeacherCountryOptions(
  applications: TeacherApplicationView[]
): string[] {
  const countries = new Set<string>();
  for (const app of applications) {
    const country = getTeacherCountry(app);
    if (country) countries.add(country);
  }
  return [...countries].sort((a, b) => a.localeCompare(b));
}

export function filterTeacherApplications(
  applications: TeacherApplicationView[],
  options: {
    tab: AdminTeacherApplicationsTab;
    search: string;
    subjectFilter: string;
    countryFilter: string;
    dateFrom: string;
    dateTo: string;
  }
): TeacherApplicationView[] {
  const query = options.search.trim().toLowerCase();

  return applications
    .filter((app) => {
      if (options.tab !== "all" && app.status !== options.tab) return false;
      if (options.subjectFilter && !getTeacherSubjects(app).includes(options.subjectFilter)) {
        return false;
      }
      if (options.countryFilter && getTeacherCountry(app) !== options.countryFilter) {
        return false;
      }

      const created = new Date(app.createdAt);
      if (options.dateFrom && created < new Date(`${options.dateFrom}T00:00:00`)) return false;
      if (options.dateTo && created > new Date(`${options.dateTo}T23:59:59`)) return false;

      if (!query) return true;
      return teacherApplicationSearchText(app).includes(query);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function nextTeacherApplicationStatus(
  status: TeacherApplicationStatus
): TeacherApplicationStatus | null {
  switch (status) {
    case "new":
      return "reviewing";
    case "reviewing":
      return "approved";
    case "approved":
    case "rejected":
      return "closed";
    default:
      return null;
  }
}

export function nextTeacherApplicationActionLabel(
  status: TeacherApplicationStatus
): string | null {
  const next = nextTeacherApplicationStatus(status);
  if (!next) return null;
  switch (next) {
    case "reviewing":
      return "Start review";
    case "approved":
      return "Approve";
    case "closed":
      return "Close";
    default:
      return `Mark ${teacherApplicationStatusLabel(next).toLowerCase()}`;
  }
}

export function teacherApplicationStatusActions(
  status: TeacherApplicationStatus
): { label: string; status: TeacherApplicationStatus }[] {
  switch (status) {
    case "new":
      return [{ label: "Start review", status: "reviewing" }];
    case "reviewing":
      return [
        { label: "Approve", status: "approved" },
        { label: "Reject", status: "rejected" },
      ];
    case "approved":
    case "rejected":
      return [{ label: "Close", status: "closed" }];
    default:
      return [];
  }
}

export function teacherApplicationTelHref(
  raw: string,
  countryHint?: string
): string | null {
  const parsed = parseWhatsApp(raw, countryHint);
  if (!parsed.ok) return null;
  return `tel:${parsed.value.e164}`;
}

export function teacherApplicationMailtoHref(app: TeacherApplicationView): string {
  const subject = encodeURIComponent("BD Online Quran Academy — Teacher application");
  const body = encodeURIComponent(
    `Assalamu alaikum ${app.fullName},\n\nThank you for applying to teach at BD Online Quran Academy.\n\n`
  );
  return `mailto:${app.email}?subject=${subject}&body=${body}`;
}

export function groupTeacherApplicationsByStatus(
  applications: TeacherApplicationView[]
): { label: string; count: number; color: string }[] {
  const stats = computeTeacherApplicationsStats(applications);
  return [
    { label: "New", count: stats.new, color: "#F59E0B" },
    { label: "Under review", count: stats.reviewing, color: "#3B82F6" },
    { label: "Approved", count: stats.approved, color: "#32C991" },
    { label: "Rejected", count: stats.rejected, color: "#EF4444" },
    { label: "Closed", count: stats.closed, color: "#8B5CF6" },
  ].filter((segment) => segment.count > 0);
}

export function groupTeacherSubjects(
  applications: TeacherApplicationView[]
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const app of applications) {
    for (const subject of getTeacherSubjects(app)) {
      map.set(subject, (map.get(subject) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRecentTeacherApplications(
  applications: TeacherApplicationView[]
): TeacherApplicationView[] {
  return [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
}

export interface ITeacherApplicationDisplayRow {
  key: string;
  label: string;
  value: string;
  fullWidth?: boolean;
}

export interface ITeacherApplicationDisplaySection {
  title: string;
  rows: ITeacherApplicationDisplayRow[];
}

const DISPLAY_SECTIONS: { title: string; fields: string[] }[] = [
  {
    title: "Personal information",
    fields: [
      "fatherName",
      "surname",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "whatsapp",
      "currentCity",
      "currentDistrict",
      "currentCountry",
    ],
  },
  {
    title: "Academic background",
    fields: [
      "educationQualification",
      "educationSubject",
      "educationInstitution",
      "educationYear",
      "isHafiz",
      "parasMemorized",
      "islamicQualification",
    ],
  },
  {
    title: "Teaching profile",
    fields: [
      "subjects",
      "teachingExperience",
      "experience",
      "availableDays",
      "availableTimeSlots",
      "languages",
      "expectedSalary",
      "referralSource",
      "tajweedExperience",
      "hifzExperience",
      "availability",
      "teachingDevices",
      "internetType",
    ],
  },
];

const HEADER_FIELDS = new Set(["fullName", "email", "phone"]);

export function buildTeacherApplicationDisplaySections(
  formData: Record<string, unknown>
): ITeacherApplicationDisplaySection[] {
  const usedKeys = new Set<string>();
  const sections: ITeacherApplicationDisplaySection[] = [];

  for (const section of DISPLAY_SECTIONS) {
    const rows: ITeacherApplicationDisplayRow[] = [];
    for (const key of section.fields) {
      if (HEADER_FIELDS.has(key)) continue;
      const value = formatRawValue(formData[key]);
      if (!value) continue;
      rows.push({
        key,
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (c) => c.toUpperCase()),
        value,
        fullWidth: value.length > 80,
      });
      usedKeys.add(key);
    }
    if (rows.length > 0) sections.push({ title: section.title, rows });
  }

  return sections;
}

export function teacherApplicationFileLinks(
  files: TeacherApplicationView["files"]
): { label: string; url: string }[] {
  const items: { label: string; url: string }[] = [];
  if (files.certificateUrl) {
    items.push({ label: "Certificate", url: toViewableUploadUrl(files.certificateUrl) });
  }
  if (files.cvUrl) {
    items.push({ label: "CV", url: toViewableUploadUrl(files.cvUrl) });
  }
  if (files.profilePhotoUrl) {
    items.push({ label: "Profile photo", url: toViewableUploadUrl(files.profilePhotoUrl) });
  }
  if (files.screenshotUrl) {
    items.push({
      label: "Social screenshot",
      url: toViewableUploadUrl(files.screenshotUrl),
    });
  }
  return items;
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

export function exportTeacherApplicationsFile(
  applications: TeacherApplicationView[],
  filenamePrefix: string
): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    "Name",
    "Email",
    "Phone",
    "Subjects",
    "Experience",
    "Qualification",
    "Country",
    "Status",
    "Applied At",
  ];
  const lines = [
    header.join(","),
    ...applications.map((app) =>
      [
        csvEscape(app.fullName),
        csvEscape(app.email),
        csvEscape(app.phone),
        csvEscape(getTeacherSubjects(app).join("; ")),
        csvEscape(getTeacherExperience(app)),
        csvEscape(getTeacherQualification(app)),
        csvEscape(getTeacherCountry(app) ?? ""),
        csvEscape(app.status),
        csvEscape(app.createdAt),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function teacherApplicationsStatHint(
  key: "underReview" | "approved" | "rejected" | "closed",
  stats: IAdminTeacherApplicationsStats,
  t: PortalTranslate,
  formatNumber: (n: number) => string
): string {
  switch (key) {
    case "underReview":
      return stats.new > 0
        ? `${formatNumber(stats.new)} ${t("admin.admissions.tabNew").toLowerCase()}`
        : t("stats.ofTotal", {
            pct: formatNumber(
              stats.total > 0 ? Math.round((stats.underReview / stats.total) * 100) : 0
            ),
          });
    case "approved":
    case "rejected":
    case "closed": {
      const part =
        key === "approved" ? stats.approved : key === "rejected" ? stats.rejected : stats.closed;
      return t("stats.ofTotal", {
        pct: formatNumber(stats.total > 0 ? Math.round((part / stats.total) * 100) : 0),
      });
    }
    default:
      return "";
  }
}
