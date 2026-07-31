import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import { parseWhatsApp } from "@/lib/whatsapp";

export type AdminTrialLeadsTab = "all" | TrialBookingStatus;

export type PortalTranslate = (
  key: string,
  params?: Record<string, string>
) => string;

export type StatusLabelFn = (status: string) => string;

export interface IAdminTrialLeadsStats {
  total: number;
  new: number;
  contacted: number;
  scheduled: number;
  closed: number;
  newToday: number;
  newThisWeek: number;
}

export function trialLeadStatusStyles(status: TrialBookingStatus): string {
  switch (status) {
    case "contacted":
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
    case "scheduled":
      return "border-violet-500/35 bg-violet-500/10 text-violet-800";
    case "closed":
      return "border-red-500/35 bg-red-500/10 text-red-800";
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

export function leadSearchText(booking: TrialBookingView): string {
  return [
    booking.parentName,
    booking.email,
    booking.whatsapp,
    booking.country,
    booking.courseSlug,
    booking.source,
    booking.utmSource,
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
    if (created >= todayStart && booking.status === "new") newToday += 1;
    if (created >= weekStart) newThisWeek += 1;
  }

  return {
    total: bookings.length,
    new: bookings.filter((booking) => booking.status === "new").length,
    contacted: bookings.filter((booking) => booking.status === "contacted").length,
    scheduled: bookings.filter((booking) => booking.status === "scheduled").length,
    closed: bookings.filter((booking) => booking.status === "closed").length,
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
    case "new":
      return "contacted";
    case "contacted":
      return "scheduled";
    case "scheduled":
      return "closed";
    default:
      return null;
  }
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
    t("admin.trialLeads.csvCourse"),
    t("admin.trialLeads.csvSource"),
    t("admin.trialLeads.csvStatus"),
    t("admin.trialLeads.csvRequestedAt"),
  ];
  const lines = [
    header.join(","),
    ...bookings.map((booking) =>
      [
        csvEscape(booking.parentName),
        csvEscape(booking.email ?? ""),
        csvEscape(booking.whatsapp),
        csvEscape(booking.country ?? ""),
        csvEscape(formatCourseInterest(booking.courseSlug, t)),
        csvEscape(formatLeadSource(booking, t)),
        csvEscape(booking.status),
        csvEscape(booking.createdAt),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
