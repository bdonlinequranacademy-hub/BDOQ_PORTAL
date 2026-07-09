import type { AdminProgressRecord } from "@/types/models";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { matchesProgramFilter } from "@/lib/api/curriculumApi";

export type ProgressSort =
  | "highest"
  | "lowest"
  | "recent"
  | "student_name"
  | "most_surahs";

export type ProgressStatus = "excellent" | "on_track" | "needs_attention";

export type ProgressTrendRange = "year" | "six_months";

export interface IAdminProgressStats {
  totalStudents: number;
  totalRecords: number;
  avgTajweed: number;
  avgMemorization: number;
  completedSurahs: number;
  studentsOnTrack: number;
  newThisMonth: number;
  tajweedDelta: number | null;
  memorizationDelta: number | null;
}

export interface IProgressTrendPoint {
  label: string;
  tajweed: number;
  memorization: number;
}

export interface IProgressProgramSegment {
  label: string;
  count: number;
  color: string;
}

export interface IProgressDistributionSegment {
  label: string;
  count: number;
  color: string;
  range: string;
}

export interface IProgressTopStudent {
  studentId: string;
  name: string;
  program: string;
  overall: number;
  rank: number;
}

export interface IProgressRowView extends AdminProgressRecord {
  memorizationPct: number;
  overallPct: number;
  status: ProgressStatus;
  surahCount: number;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TOTAL_QURAN_AYAHS = 6236;
const TOTAL_SURAHS = 114;

export const PROGRESS_CHART_COLORS = [
  "#32C991",
  "#2DD4BF",
  "#3B82F6",
  "#8B5CF6",
  "#D4A853",
  "#F59E0B",
  "#94A3B8",
];

const STATUS_LABELS: Record<ProgressStatus, string> = {
  excellent: "Excellent",
  on_track: "On Track",
  needs_attention: "Needs Attention",
};

export function progressStatusLabel(status: ProgressStatus): string {
  return STATUS_LABELS[status];
}

export function progressStatusStyles(status: ProgressStatus): string {
  switch (status) {
    case "excellent":
      return "border-violet-500/35 bg-violet-500/10 text-violet-800";
    case "on_track":
      return "border-emerald-500/35 bg-emerald-500/10 text-emerald-800";
    default:
      return "border-amber-500/35 bg-amber-500/10 text-amber-800";
  }
}

export function getDefaultMonthRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function pctOfTotal(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 1000) / 10}% of total`;
}

export function getProgramLabel(record: AdminProgressRecord): string {
  if (record.curriculumLabels?.program) {
    return formatCurriculumPath(record.curriculumLabels);
  }
  return "No program linked";
}

export function getMemorizationPercent(record: AdminProgressRecord): number {
  if (typeof record.memorizedAyahs === "number" && record.memorizedAyahs > 0) {
    return Math.min(100, Math.round((record.memorizedAyahs / TOTAL_QURAN_AYAHS) * 100));
  }
  const surahCount = record.surahsMemorized?.length ?? 0;
  if (surahCount > 0) {
    return Math.min(100, Math.round((surahCount / TOTAL_SURAHS) * 100));
  }
  return 0;
}

export function getOverallPercent(record: AdminProgressRecord): number {
  const tajweed = record.tajweedScore ?? 0;
  const memorization = getMemorizationPercent(record);
  return Math.round((tajweed + memorization) / 2);
}

export function getProgressStatus(record: AdminProgressRecord): ProgressStatus {
  const overall = getOverallPercent(record);
  if (overall >= 80) return "excellent";
  if (overall >= 60) return "on_track";
  return "needs_attention";
}

export function enrichProgressRecord(record: AdminProgressRecord): IProgressRowView {
  const memorizationPct = getMemorizationPercent(record);
  return {
    ...record,
    memorizationPct,
    overallPct: getOverallPercent(record),
    status: getProgressStatus(record),
    surahCount: record.surahsMemorized?.length ?? 0,
  };
}

function isInMonth(dateIso: string | undefined, year: number, month: number): boolean {
  if (!dateIso) return false;
  const date = new Date(dateIso);
  return date.getFullYear() === year && date.getMonth() === month;
}

function isInDateRange(
  dateIso: string | undefined,
  dateFrom: string,
  dateTo: string
): boolean {
  if (!dateIso) return !dateFrom && !dateTo;
  const time = new Date(dateIso).getTime();
  if (dateFrom && time < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
  if (dateTo && time > new Date(`${dateTo}T23:59:59`).getTime()) return false;
  return true;
}

export function filterProgressRecords(
  records: AdminProgressRecord[],
  options: {
    search: string;
    programFilter: string;
    classFilter: string;
    dateFrom: string;
    dateTo: string;
    sortBy: ProgressSort;
  }
): IProgressRowView[] {
  const query = options.search.trim().toLowerCase();

  const filtered = records
    .filter((record) => matchesProgramFilter(record.curriculumProgram, options.programFilter))
    .filter((record) => {
      if (!options.classFilter) return true;
      return record.class?._id === options.classFilter;
    })
    .filter((record) => isInDateRange(record.updatedAt, options.dateFrom, options.dateTo))
    .filter((record) => {
      if (!query) return true;
      const studentName = record.student?.name?.toLowerCase() ?? "";
      const classTitle = record.class?.title?.toLowerCase() ?? "";
      const program = getProgramLabel(record).toLowerCase();
      return (
        studentName.includes(query) ||
        classTitle.includes(query) ||
        program.includes(query)
      );
    })
    .map(enrichProgressRecord);

  return sortProgressRows(filtered, options.sortBy);
}

function sortProgressRows(rows: IProgressRowView[], sortBy: ProgressSort): IProgressRowView[] {
  const sorted = [...rows];
  switch (sortBy) {
    case "lowest":
      return sorted.sort((a, b) => a.overallPct - b.overallPct);
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
      );
    case "student_name":
      return sorted.sort((a, b) =>
        (a.student?.name ?? "").localeCompare(b.student?.name ?? "")
      );
    case "most_surahs":
      return sorted.sort((a, b) => b.surahCount - a.surahCount);
    default:
      return sorted.sort((a, b) => b.overallPct - a.overallPct);
  }
}

export function countUniqueStudents(records: AdminProgressRecord[]): number {
  const ids = new Set<string>();
  for (const record of records) {
    if (record.student?._id) ids.add(record.student._id);
  }
  return ids.size;
}

export function computeProgressStats(records: AdminProgressRecord[]): IAdminProgressStats {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevMonthDate = new Date(thisYear, thisMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const enriched = records.map(enrichProgressRecord);
  const totalRecords = enriched.length;
  const totalStudents = countUniqueStudents(records);

  const avgTajweed =
    totalRecords > 0
      ? Math.round(enriched.reduce((sum, row) => sum + (row.tajweedScore ?? 0), 0) / totalRecords)
      : 0;

  const avgMemorization =
    totalRecords > 0
      ? Math.round(enriched.reduce((sum, row) => sum + row.memorizationPct, 0) / totalRecords)
      : 0;

  const completedSurahs = enriched.reduce((sum, row) => sum + row.surahCount, 0);

  const onTrackStudentIds = new Set<string>();
  for (const row of enriched) {
    if (row.overallPct >= 60 && row.student?._id) {
      onTrackStudentIds.add(row.student._id);
    }
  }

  const thisMonthRows = enriched.filter((row) => isInMonth(row.updatedAt, thisYear, thisMonth));
  const prevMonthRows = enriched.filter((row) => isInMonth(row.updatedAt, prevYear, prevMonth));

  const avgForMonth = (rows: IProgressRowView[], field: "tajweed" | "memorization") => {
    if (rows.length === 0) return null;
    if (field === "tajweed") {
      return Math.round(
        rows.reduce((sum, row) => sum + (row.tajweedScore ?? 0), 0) / rows.length
      );
    }
    return Math.round(rows.reduce((sum, row) => sum + row.memorizationPct, 0) / rows.length);
  };

  const thisTajweed = avgForMonth(thisMonthRows, "tajweed");
  const prevTajweed = avgForMonth(prevMonthRows, "tajweed");
  const thisMem = avgForMonth(thisMonthRows, "memorization");
  const prevMem = avgForMonth(prevMonthRows, "memorization");

  return {
    totalStudents,
    totalRecords,
    avgTajweed,
    avgMemorization,
    completedSurahs,
    studentsOnTrack: onTrackStudentIds.size,
    newThisMonth: thisMonthRows.length,
    tajweedDelta:
      thisTajweed !== null && prevTajweed !== null ? thisTajweed - prevTajweed : null,
    memorizationDelta: thisMem !== null && prevMem !== null ? thisMem - prevMem : null,
  };
}

export function buildProgressMonthlyTrend(
  records: AdminProgressRecord[],
  range: ProgressTrendRange
): IProgressTrendPoint[] {
  const now = new Date();
  const monthCount = range === "year" ? now.getMonth() + 1 : 6;
  const startMonth = range === "year" ? 0 : Math.max(0, now.getMonth() - 5);
  const year = now.getFullYear();

  const points: IProgressTrendPoint[] = [];

  for (let index = 0; index < monthCount; index++) {
    const month = startMonth + index;
    const monthRows = records.filter((record) => isInMonth(record.updatedAt, year, month));
    const enriched = monthRows.map(enrichProgressRecord);

    const tajweed =
      enriched.length > 0
        ? Math.round(
            enriched.reduce((sum, row) => sum + (row.tajweedScore ?? 0), 0) / enriched.length
          )
        : 0;

    const memorization =
      enriched.length > 0
        ? Math.round(enriched.reduce((sum, row) => sum + row.memorizationPct, 0) / enriched.length)
        : 0;

    points.push({
      label: MONTH_LABELS[month] ?? `M${month + 1}`,
      tajweed,
      memorization,
    });
  }

  return points;
}

export function groupProgressByProgram(records: AdminProgressRecord[]): IProgressProgramSegment[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    const label = record.curriculumLabels?.program ?? "Unassigned";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], index) => ({
      label,
      count,
      color: PROGRESS_CHART_COLORS[index % PROGRESS_CHART_COLORS.length],
    }));
}

export function buildProgressDistribution(
  records: AdminProgressRecord[]
): IProgressDistributionSegment[] {
  const buckets = {
    excellent: 0,
    good: 0,
    average: 0,
    low: 0,
  };

  for (const record of records) {
    const overall = getOverallPercent(record);
    if (overall >= 80) buckets.excellent += 1;
    else if (overall >= 60) buckets.good += 1;
    else if (overall >= 40) buckets.average += 1;
    else buckets.low += 1;
  }

  return [
    { label: "Excellent", count: buckets.excellent, color: "#8B5CF6", range: "80–100%" },
    { label: "Good", count: buckets.good, color: "#32C991", range: "60–79%" },
    { label: "Average", count: buckets.average, color: "#F59E0B", range: "40–59%" },
    { label: "Needs Improvement", count: buckets.low, color: "#EF4444", range: "<40%" },
  ];
}

export function getTopStudents(
  records: AdminProgressRecord[],
  limit = 5
): IProgressTopStudent[] {
  const byStudent = new Map<string, IProgressTopStudent>();

  for (const record of records) {
    const studentId = record.student?._id;
    const name = record.student?.name;
    if (!studentId || !name) continue;

    const overall = getOverallPercent(record);
    const existing = byStudent.get(studentId);

    if (!existing || overall > existing.overall) {
      byStudent.set(studentId, {
        studentId,
        name,
        program: getProgramLabel(record),
        overall,
        rank: 0,
      });
    }
  }

  return [...byStudent.values()]
    .sort((a, b) => b.overall - a.overall)
    .slice(0, limit)
    .map((student, index) => ({ ...student, rank: index + 1 }));
}

export function formatProgressDate(dateIso?: string): string {
  if (!dateIso) return "—";
  return new Date(dateIso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function exportProgressFile(records: IProgressRowView[]): void {
  const header = [
    "Student",
    "Class",
    "Program",
    "Tajweed %",
    "Memorization %",
    "Surahs",
    "Status",
    "Last Updated",
  ];

  const rows = records.map((row) => [
    row.student?.name ?? "",
    row.class?.title ?? "",
    getProgramLabel(row),
    String(row.tajweedScore ?? 0),
    String(row.memorizationPct),
    String(row.surahCount),
    progressStatusLabel(row.status),
    row.updatedAt ?? "",
  ]);

  const csv = [header, ...rows]
    .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `progress-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
