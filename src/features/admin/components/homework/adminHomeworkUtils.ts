import type { AdminHomeworkItem } from "@/types/models";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { formatHomeworkDueLabel, isHomeworkOverdue } from "@/lib/homeworkDue";

export type AdminHomeworkTab = "all" | "awaiting_grade" | "overdue" | "fully_graded";

export type HomeworkGradingStatus =
  | "awaiting_grade"
  | "fully_graded"
  | "no_submissions"
  | "overdue"
  | "active";

export type HomeworkSort = "due_soonest" | "due_latest" | "newest" | "most_submissions";

export interface IAdminHomeworkStats {
  total: number;
  awaitingGrade: number;
  totalSubmissions: number;
  totalStudents: number;
  overdue: number;
  avgSubmissionRate: number;
  newThisMonth: number;
  submissionRateDelta: number | null;
}

const GRADING_STATUS_LABELS: Record<HomeworkGradingStatus, string> = {
  awaiting_grade: "Awaiting grade",
  fully_graded: "Fully graded",
  no_submissions: "No submissions",
  overdue: "Overdue",
  active: "Active",
};

export function homeworkGradingStatusLabel(status: HomeworkGradingStatus): string {
  return GRADING_STATUS_LABELS[status];
}

export function homeworkGradingStatusStyles(status: HomeworkGradingStatus): string {
  switch (status) {
    case "fully_graded":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    case "awaiting_grade":
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
    case "overdue":
      return "border-red-500/35 bg-red-500/10 text-red-800";
    case "no_submissions":
      return "border-zinc-400/35 bg-zinc-100 text-zinc-600";
    default:
      return "border-blue-500/35 bg-blue-500/10 text-blue-800";
  }
}

export function getHomeworkClassTitle(item: AdminHomeworkItem): string {
  const cls = item.class;
  if (cls && typeof cls === "object") return cls.title;
  return "Unknown class";
}

export function getHomeworkClassId(item: AdminHomeworkItem): string | null {
  const cls = item.class;
  if (cls && typeof cls === "object") return cls._id;
  if (typeof cls === "string") return cls;
  return null;
}

export function getHomeworkTeacherName(item: AdminHomeworkItem): string {
  const teacher = item.teacher;
  if (teacher && typeof teacher === "object") return teacher.name;
  return "Unknown teacher";
}

export function getHomeworkTeacherId(item: AdminHomeworkItem): string | null {
  const teacher = item.teacher;
  if (teacher && typeof teacher === "object") return teacher._id;
  if (typeof teacher === "string") return teacher;
  return null;
}

export function getHomeworkProgramLabel(item: AdminHomeworkItem): string {
  if (item.curriculumLabels?.program) {
    return formatCurriculumPath(item.curriculumLabels);
  }
  return "No program linked";
}

export function getSubmissionRate(item: AdminHomeworkItem): number {
  const total = item.totalStudents ?? 0;
  if (total <= 0) return 0;
  return Math.round((item.submissionCount / total) * 100);
}

export function getNotSubmittedCount(item: AdminHomeworkItem): number {
  const total = item.totalStudents ?? 0;
  return Math.max(total - item.submissionCount, 0);
}

export function isHomeworkFullyGraded(item: AdminHomeworkItem): boolean {
  return item.submissionCount > 0 && (item.pendingGradeCount ?? 0) === 0;
}

export function isHomeworkOverdueIncomplete(item: AdminHomeworkItem): boolean {
  if (!isHomeworkOverdue(item.dueDate)) return false;
  return getNotSubmittedCount(item) > 0;
}

export function getHomeworkGradingStatus(item: AdminHomeworkItem): HomeworkGradingStatus {
  if (isHomeworkOverdueIncomplete(item)) return "overdue";
  if ((item.pendingGradeCount ?? 0) > 0) return "awaiting_grade";
  if (item.submissionCount === 0) return "no_submissions";
  if (isHomeworkFullyGraded(item)) return "fully_graded";
  return "active";
}

export function formatDueDateDetailed(dueDate: string): {
  date: string;
  day: string;
  relative: string;
} {
  const value = new Date(dueDate);
  return {
    date: value
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase(),
    day: value.toLocaleDateString("en-US", { weekday: "short" }),
    relative: formatHomeworkDueLabel(dueDate),
  };
}

export function formatCreatedAt(iso: string): { date: string; time: string } {
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

export function homeworkSearchText(item: AdminHomeworkItem): string {
  return [
    item.title,
    item.description,
    getHomeworkClassTitle(item),
    getHomeworkTeacherName(item),
    getHomeworkProgramLabel(item),
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

function isLastMonth(iso: string): boolean {
  const value = new Date(iso);
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return (
    value.getFullYear() === lastMonth.getFullYear() &&
    value.getMonth() === lastMonth.getMonth()
  );
}

export function computeHomeworkStats(items: AdminHomeworkItem[]): IAdminHomeworkStats {
  let awaitingGrade = 0;
  let totalSubmissions = 0;
  let totalStudents = 0;
  let overdue = 0;
  let newThisMonth = 0;
  let thisMonthRateSum = 0;
  let thisMonthRateCount = 0;
  let lastMonthRateSum = 0;
  let lastMonthRateCount = 0;

  for (const item of items) {
    awaitingGrade += item.pendingGradeCount ?? 0;
    totalSubmissions += item.submissionCount;
    totalStudents += item.totalStudents ?? 0;
    if (isHomeworkOverdueIncomplete(item)) overdue += 1;
    if (isThisMonth(item.createdAt)) newThisMonth += 1;

    const rate = getSubmissionRate(item);
    if (isThisMonth(item.createdAt) && (item.totalStudents ?? 0) > 0) {
      thisMonthRateSum += rate;
      thisMonthRateCount += 1;
    }
    if (isLastMonth(item.createdAt) && (item.totalStudents ?? 0) > 0) {
      lastMonthRateSum += rate;
      lastMonthRateCount += 1;
    }
  }

  const avgSubmissionRate =
    totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0;

  const thisMonthAvg =
    thisMonthRateCount > 0 ? Math.round(thisMonthRateSum / thisMonthRateCount) : null;
  const lastMonthAvg =
    lastMonthRateCount > 0 ? Math.round(lastMonthRateSum / lastMonthRateCount) : null;

  const submissionRateDelta =
    thisMonthAvg !== null && lastMonthAvg !== null ? thisMonthAvg - lastMonthAvg : null;

  return {
    total: items.length,
    awaitingGrade,
    totalSubmissions,
    totalStudents,
    overdue,
    avgSubmissionRate,
    newThisMonth,
    submissionRateDelta,
  };
}

export function extractClassOptions(
  items: AdminHomeworkItem[]
): { id: string; title: string }[] {
  const map = new Map<string, string>();
  for (const item of items) {
    const id = getHomeworkClassId(item);
    if (!id) continue;
    map.set(id, getHomeworkClassTitle(item));
  }
  return Array.from(map.entries())
    .map(([id, title]) => ({ id, title }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function extractTeacherOptions(
  items: AdminHomeworkItem[]
): { id: string; name: string }[] {
  const map = new Map<string, string>();
  for (const item of items) {
    const id = getHomeworkTeacherId(item);
    if (!id) continue;
    map.set(id, getHomeworkTeacherName(item));
  }
  return Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function extractProgramOptions(items: AdminHomeworkItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    if (item.curriculumProgram) set.add(item.curriculumProgram);
  }
  return Array.from(set);
}

function matchesTab(item: AdminHomeworkItem, tab: AdminHomeworkTab): boolean {
  switch (tab) {
    case "awaiting_grade":
      return (item.pendingGradeCount ?? 0) > 0;
    case "overdue":
      return isHomeworkOverdueIncomplete(item);
    case "fully_graded":
      return isHomeworkFullyGraded(item);
    default:
      return true;
  }
}

function matchesDateRange(iso: string, dateFrom: string, dateTo: string): boolean {
  if (!dateFrom && !dateTo) return true;
  const value = new Date(iso);
  if (dateFrom) {
    const from = new Date(dateFrom);
    from.setHours(0, 0, 0, 0);
    if (value < from) return false;
  }
  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    if (value > to) return false;
  }
  return true;
}

function sortHomework(items: AdminHomeworkItem[], sortBy: HomeworkSort): AdminHomeworkItem[] {
  const sorted = [...items];
  switch (sortBy) {
    case "due_latest":
      sorted.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "most_submissions":
      sorted.sort((a, b) => b.submissionCount - a.submissionCount);
      break;
    default:
      sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
  return sorted;
}

export function filterHomework(
  items: AdminHomeworkItem[],
  options: {
    tab: AdminHomeworkTab;
    search: string;
    programFilter: string;
    classFilter: string;
    teacherFilter: string;
    dateFrom: string;
    dateTo: string;
    sortBy: HomeworkSort;
  }
): AdminHomeworkItem[] {
  const query = options.search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (!matchesTab(item, options.tab)) return false;
    if (options.programFilter && item.curriculumProgram !== options.programFilter) return false;
    if (options.classFilter && getHomeworkClassId(item) !== options.classFilter) return false;
    if (options.teacherFilter && getHomeworkTeacherId(item) !== options.teacherFilter) return false;
    if (!matchesDateRange(item.dueDate, options.dateFrom, options.dateTo)) return false;
    if (query && !homeworkSearchText(item).includes(query)) return false;
    return true;
  });

  return sortHomework(filtered, options.sortBy);
}

export function groupSubmissionsOverview(items: AdminHomeworkItem[]): {
  label: string;
  count: number;
  color: string;
}[] {
  let submitted = 0;
  let pendingGrade = 0;
  let notSubmitted = 0;

  for (const item of items) {
    submitted += item.gradedCount ?? 0;
    pendingGrade += item.pendingGradeCount ?? 0;
    notSubmitted += getNotSubmittedCount(item);
  }

  return [
    { label: "Graded", count: submitted, color: "#32C991" },
    { label: "Awaiting grade", count: pendingGrade, color: "#F59E0B" },
    { label: "Not submitted", count: notSubmitted, color: "#EF4444" },
  ].filter((segment) => segment.count > 0);
}

export function groupProgramsByCount(
  items: AdminHomeworkItem[]
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const label = getHomeworkProgramLabel(item);
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function getUpcomingDeadlines(
  items: AdminHomeworkItem[],
  limit = 5
): AdminHomeworkItem[] {
  const now = new Date();
  return [...items]
    .filter((item) => new Date(item.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);
}

export interface IHomeworkTeacherRow {
  teacherId: string;
  teacherName: string;
  assignmentCount: number;
  submissions: number;
  pendingGrade: number;
  graded: number;
}

export function groupHomeworkByTeacher(items: AdminHomeworkItem[]): IHomeworkTeacherRow[] {
  const map = new Map<string, IHomeworkTeacherRow>();

  for (const item of items) {
    const teacherId = getHomeworkTeacherId(item) ?? "unknown";
    const teacherName = getHomeworkTeacherName(item);
    const existing = map.get(teacherId) ?? {
      teacherId,
      teacherName,
      assignmentCount: 0,
      submissions: 0,
      pendingGrade: 0,
      graded: 0,
    };

    existing.assignmentCount += 1;
    existing.submissions += item.submissionCount;
    existing.pendingGrade += item.pendingGradeCount ?? 0;
    existing.graded += item.gradedCount ?? 0;
    map.set(teacherId, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.assignmentCount - a.assignmentCount);
}

export type HomeworkTrendRange = "year" | "six_months";

export interface IHomeworkTrendPoint {
  label: string;
  assignments: number;
  submissions: number;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildHomeworkSubmissionTrend(
  items: AdminHomeworkItem[],
  range: HomeworkTrendRange
): IHomeworkTrendPoint[] {
  const now = new Date();
  const monthCount = range === "year" ? now.getMonth() + 1 : 6;
  const startMonth = range === "year" ? 0 : Math.max(0, now.getMonth() - 5);
  const year = now.getFullYear();

  const buckets = Array.from({ length: monthCount }, (_, index) => {
    const monthIndex = range === "year" ? index : startMonth + index;
    return {
      label: MONTH_LABELS[monthIndex],
      monthIndex,
      assignments: 0,
      submissions: 0,
    };
  });

  for (const item of items) {
    const created = new Date(item.createdAt);
    if (created.getFullYear() !== year) continue;

    const bucket = buckets.find((entry) => entry.monthIndex === created.getMonth());
    if (!bucket) continue;

    bucket.assignments += 1;
    bucket.submissions += item.submissionCount;
  }

  return buckets.map(({ label, assignments, submissions }) => ({
    label,
    assignments,
    submissions,
  }));
}

export function getAwaitingGradeHomework(items: AdminHomeworkItem[]): AdminHomeworkItem[] {
  return [...items]
    .filter((item) => (item.pendingGradeCount ?? 0) > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface IHomeworkActivityItem {
  id: string;
  timeLabel: string;
  title: string;
  detail?: string;
}

export function buildHomeworkActivity(items: AdminHomeworkItem[]): IHomeworkActivityItem[] {
  return [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map((item) => {
      const created = formatCreatedAt(item.createdAt);
      return {
        id: item._id,
        timeLabel: `${created.date} · ${created.time}`,
        title: item.title,
        detail: `${getHomeworkTeacherName(item)} · ${item.submissionCount} submitted`,
      };
    });
}

export const PROGRAM_DONUT_COLORS = [
  "#32C991",
  "#2DD4BF",
  "#3B82F6",
  "#8B5CF6",
  "#D4A853",
  "#F59E0B",
  "#EF4444",
];

export function groupProgramsForDonut(
  items: AdminHomeworkItem[]
): { label: string; count: number; color: string }[] {
  return groupProgramsByCount(items)
    .slice(0, 6)
    .map((program, index) => ({
      ...program,
      color: PROGRAM_DONUT_COLORS[index % PROGRAM_DONUT_COLORS.length],
    }));
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportHomeworkFile(items: AdminHomeworkItem[], filename: string): void {
  const headers = [
    "Title",
    "Program",
    "Class",
    "Teacher",
    "Due Date",
    "Submissions",
    "Total Students",
    "Graded",
    "Pending Grade",
    "Status",
    "Created At",
  ];

  const rows = items.map((item) => [
    item.title,
    getHomeworkProgramLabel(item),
    getHomeworkClassTitle(item),
    getHomeworkTeacherName(item),
    new Date(item.dueDate).toLocaleDateString(),
    String(item.submissionCount),
    String(item.totalStudents ?? ""),
    String(item.gradedCount ?? 0),
    String(item.pendingGradeCount ?? 0),
    homeworkGradingStatusLabel(getHomeworkGradingStatus(item)),
    new Date(item.createdAt).toLocaleString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
