import type { StudentAdmissionStatus, StudentAdmissionView } from "@/types/models";
import { parseWhatsApp } from "@/lib/whatsapp";

export type AdminStudentAdmissionsTab = "all" | StudentAdmissionStatus;

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

const STATUS_LABELS: Record<StudentAdmissionStatus, string> = {
  new: "New",
  reviewing: "Under review",
  approved: "Approved",
  closed: "Closed",
};

const VALUE_LABELS: Record<string, string> = {
  "noorani-qaida": "Noorani Qaida",
  "quran-recitation": "Quran recitation",
  tajweed: "Tajweed",
  hifz: "Hifz",
  "islamic-history": "Islamic history",
  "islamic-studies": "Islamic studies",
  arabic: "Arabic language",
  facebook: "Facebook",
  youtube: "YouTube",
  google: "Google search",
  friend: "Friend or family",
  private: "Private (one-to-one)",
  batch: "Batch (group)",
};

export function admissionStatusLabel(status: StudentAdmissionStatus): string {
  return STATUS_LABELS[status];
}

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
  return VALUE_LABELS[str] ?? str;
}

export function getAdmissionCountry(app: StudentAdmissionView): string | null {
  const formData = app.formData;
  return (
    formatRawValue(formData.currentCountry) ??
    formatRawValue(formData.country) ??
    formatRawValue(formData.nationality)
  );
}

export function getAdmissionProgram(app: StudentAdmissionView): string {
  const formData = app.formData;
  const course =
    formatRawValue(formData.courseInterest) ??
    formatRawValue(formData.programInterest) ??
    formatRawValue(formData.topicsOfInterest);

  if (!course) return "General admission";
  if (course.includes(",")) {
    return course
      .split(",")
      .map((part) => VALUE_LABELS[part.trim()] ?? formatSlug(part.trim()))
      .join(", ");
  }
  return VALUE_LABELS[course] ?? formatSlug(course);
}

export function getAdmissionProgramDetail(app: StudentAdmissionView): string {
  const formData = app.formData;
  const parts = [
    formatRawValue(formData.classType),
    formatRawValue(formData.packagePlan ?? formData.packageName),
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : "Student admission form";
}

export function getAdmissionSource(app: StudentAdmissionView): string {
  const source = formatRawValue(app.formData.referralSources);
  return source ?? "Website";
}

export function getAdmissionSourceDetail(): string {
  return "Admission form";
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

export function admissionSearchText(app: StudentAdmissionView): string {
  return [
    app.fullName,
    app.email,
    app.whatsapp,
    getAdmissionCountry(app),
    getAdmissionProgram(app),
    getAdmissionSource(app),
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

export function extractProgramOptions(applications: StudentAdmissionView[]): string[] {
  const programs = new Set<string>();
  for (const app of applications) {
    const program = getAdmissionProgram(app);
    if (program !== "General admission") programs.add(program);
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

export function extractSourceOptions(applications: StudentAdmissionView[]): string[] {
  const sources = new Set<string>();
  for (const app of applications) {
    sources.add(getAdmissionSource(app));
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
  }
): StudentAdmissionView[] {
  const query = options.search.trim().toLowerCase();

  return applications
    .filter((app) => {
      if (options.tab !== "all" && app.status !== options.tab) return false;
      if (options.programFilter && getAdmissionProgram(app) !== options.programFilter) {
        return false;
      }
      if (options.countryFilter && getAdmissionCountry(app) !== options.countryFilter) {
        return false;
      }
      if (options.sourceFilter && getAdmissionSource(app) !== options.sourceFilter) {
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

export function nextAdmissionActionLabel(status: StudentAdmissionStatus): string | null {
  const next = nextAdmissionStatus(status);
  if (!next) return null;
  switch (next) {
    case "reviewing":
      return "Start review";
    case "approved":
      return "Approve";
    case "closed":
      return "Close";
    default:
      return `Mark ${admissionStatusLabel(next).toLowerCase()}`;
  }
}

export function admissionStatusActions(
  status: StudentAdmissionStatus
): { label: string; status: StudentAdmissionStatus }[] {
  switch (status) {
    case "new":
      return [{ label: "Start review", status: "reviewing" }];
    case "reviewing":
      return [
        { label: "Approve", status: "approved" },
        { label: "Close", status: "closed" },
      ];
    case "approved":
      return [{ label: "Close", status: "closed" }];
    default:
      return [];
  }
}

export function admissionTelHref(raw: string, countryHint?: string): string | null {
  const parsed = parseWhatsApp(raw, countryHint);
  if (!parsed.ok) return null;
  return `tel:${parsed.value.e164}`;
}

export function admissionMailtoHref(app: StudentAdmissionView): string {
  const subject = encodeURIComponent("BD Online Quran Academy — Student admission");
  const body = encodeURIComponent(
    `Assalamu alaikum ${app.fullName},\n\nThank you for your student admission application at BD Online Quran Academy.\n\n`
  );
  return `mailto:${app.email}?subject=${subject}&body=${body}`;
}

export function groupAdmissionSources(
  applications: StudentAdmissionView[]
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const app of applications) {
    const label = getAdmissionSource(app);
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function groupAdmissionPrograms(
  applications: StudentAdmissionView[]
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const app of applications) {
    const label = getAdmissionProgram(app);
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
  filenamePrefix: string
): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    "Name",
    "Email",
    "WhatsApp",
    "Program",
    "Country",
    "Source",
    "Status",
    "Applied At",
  ];
  const lines = [
    header.join(","),
    ...applications.map((app) =>
      [
        csvEscape(app.fullName),
        csvEscape(app.email),
        csvEscape(app.whatsapp),
        csvEscape(getAdmissionProgram(app)),
        csvEscape(getAdmissionCountry(app) ?? ""),
        csvEscape(getAdmissionSource(app)),
        csvEscape(app.status),
        csvEscape(app.createdAt),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
