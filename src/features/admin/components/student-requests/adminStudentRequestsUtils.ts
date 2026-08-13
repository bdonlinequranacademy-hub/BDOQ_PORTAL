import type { StudentRequestStatus, StudentRequestView } from "@/types/models";
import { formatAmPmTime } from "@/i18n/format";
import type { PortalTranslate } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

export type AdminStudentRequestsTab = "all" | StudentRequestStatus;

export interface IAdminStudentRequestsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  newThisWeek: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
}

export interface IStudentRequestActivityItem {
  id: string;
  timeLabel: string;
  title: string;
  detail?: string;
}

const STATUS_LABELS: Record<StudentRequestStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export function studentRequestStatusLabel(status: StudentRequestStatus): string {
  return STATUS_LABELS[status];
}

export function studentRequestStatusStyles(status: StudentRequestStatus): string {
  switch (status) {
    case "approved":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    case "rejected":
      return "border-red-500/35 bg-red-500/10 text-red-800";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

export function formatRequestTime(iso: string): { date: string; time: string } {
  const value = new Date(iso);
  return {
    date: value
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase(),
    time: formatAmPmTime(value),
  };
}

export function getRequestCourseLabel(request: StudentRequestView): string {
  return request.preferredCourseType?.trim() || "General assignment";
}

export function messagePreview(message: string, max = 120): string {
  const trimmed = message.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function requestSearchText(request: StudentRequestView): string {
  return [
    request.teacher.name,
    request.teacher.email,
    request.message,
    request.preferredCourseType,
    request.adminNote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isThisMonth(iso: string): boolean {
  const value = new Date(iso);
  const now = new Date();
  return (
    value.getFullYear() === now.getFullYear() && value.getMonth() === now.getMonth()
  );
}

export function computeStudentRequestsStats(
  requests: StudentRequestView[]
): IAdminStudentRequestsStats {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  let newThisWeek = 0;
  let approvedThisMonth = 0;
  let rejectedThisMonth = 0;

  for (const request of requests) {
    const created = new Date(request.createdAt);
    if (created >= weekStart) newThisWeek += 1;

    const resolvedAt = request.resolvedAt ?? request.createdAt;
    if (request.status === "approved" && isThisMonth(resolvedAt)) approvedThisMonth += 1;
    if (request.status === "rejected" && isThisMonth(resolvedAt)) rejectedThisMonth += 1;
  }

  return {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    approved: requests.filter((request) => request.status === "approved").length,
    rejected: requests.filter((request) => request.status === "rejected").length,
    newThisWeek,
    approvedThisMonth,
    rejectedThisMonth,
  };
}

export function extractTeacherOptions(
  requests: StudentRequestView[]
): { id: string; name: string }[] {
  const map = new Map<string, string>();
  for (const request of requests) {
    map.set(request.teacher._id, request.teacher.name);
  }
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function extractCourseOptions(requests: StudentRequestView[]): string[] {
  const courses = new Set<string>();
  for (const request of requests) {
    courses.add(getRequestCourseLabel(request));
  }
  return [...courses].sort((a, b) => a.localeCompare(b));
}

export type StudentRequestSort = "newest" | "oldest";

export function filterStudentRequests(
  requests: StudentRequestView[],
  options: {
    tab: AdminStudentRequestsTab;
    search: string;
    teacherFilter: string;
    courseFilter: string;
    dateFrom: string;
    dateTo: string;
    sortBy: StudentRequestSort;
  }
): StudentRequestView[] {
  const query = options.search.trim().toLowerCase();

  const filtered = requests.filter((request) => {
    if (options.tab !== "all" && request.status !== options.tab) return false;
    if (options.teacherFilter && request.teacher._id !== options.teacherFilter) {
      return false;
    }
    if (options.courseFilter && getRequestCourseLabel(request) !== options.courseFilter) {
      return false;
    }

    const created = new Date(request.createdAt);
    if (options.dateFrom && created < new Date(`${options.dateFrom}T00:00:00`)) return false;
    if (options.dateTo && created > new Date(`${options.dateTo}T23:59:59`)) return false;

    if (!query) return true;
    return requestSearchText(request).includes(query);
  });

  return filtered.sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return options.sortBy === "newest" ? diff : -diff;
  });
}

export function groupRequestsByStatus(
  requests: StudentRequestView[]
): { label: string; count: number; color: string }[] {
  const stats = computeStudentRequestsStats(requests);
  return [
    { label: "Pending", count: stats.pending, color: "#F59E0B" },
    { label: "Approved", count: stats.approved, color: "#32C991" },
    { label: "Rejected", count: stats.rejected, color: "#EF4444" },
  ].filter((segment) => segment.count > 0);
}

export function groupCoursesRequested(
  requests: StudentRequestView[]
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const request of requests) {
    const label = getRequestCourseLabel(request);
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildStudentRequestActivity(
  requests: StudentRequestView[]
): IStudentRequestActivityItem[] {
  const items: IStudentRequestActivityItem[] = [];

  for (const request of requests) {
    const submitted = formatRequestTime(request.createdAt);
    items.push({
      id: `${request._id}-submitted`,
      timeLabel: `${submitted.date} · ${submitted.time}`,
      title: `${request.teacher.name} submitted a request`,
      detail: getRequestCourseLabel(request),
    });

    if (request.status !== "pending" && request.resolvedAt) {
      const resolved = formatRequestTime(request.resolvedAt);
      items.push({
        id: `${request._id}-resolved`,
        timeLabel: `${resolved.date} · ${resolved.time}`,
        title:
          request.status === "approved"
            ? `Request approved for ${request.teacher.name}`
            : `Request rejected for ${request.teacher.name}`,
        detail: request.adminNote,
      });
    }
  }

  return items
    .sort((a, b) => b.timeLabel.localeCompare(a.timeLabel))
    .slice(0, 8);
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

export function exportStudentRequestsFile(
  requests: StudentRequestView[],
  filenamePrefix: string
): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    "Teacher",
    "Email",
    "Course",
    "Message",
    "Status",
    "Admin Note",
    "Requested At",
  ];
  const lines = [
    header.join(","),
    ...requests.map((request) =>
      [
        csvEscape(request.teacher.name),
        csvEscape(request.teacher.email ?? ""),
        csvEscape(getRequestCourseLabel(request)),
        csvEscape(request.message),
        csvEscape(request.status),
        csvEscape(request.adminNote ?? ""),
        csvEscape(request.createdAt),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function studentRequestsStatHint(
  key: "pending" | "approved" | "rejected",
  stats: IAdminStudentRequestsStats,
  t: PortalTranslate,
  formatNumber: (n: number) => string
): string {
  switch (key) {
    case "pending":
      return t("admin.studentRequests.alertTitle");
    case "approved":
      return stats.approvedThisMonth > 0
        ? t("stats.thisMonth", { count: formatNumber(stats.approvedThisMonth) })
        : t("stats.ofTotal", {
            pct: formatNumber(
              stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0
            ),
          });
    case "rejected":
      return stats.rejectedThisMonth > 0
        ? t("stats.thisMonth", { count: formatNumber(stats.rejectedThisMonth) })
        : t("stats.ofTotal", {
            pct: formatNumber(
              stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0
            ),
          });
    default:
      return "";
  }
}
