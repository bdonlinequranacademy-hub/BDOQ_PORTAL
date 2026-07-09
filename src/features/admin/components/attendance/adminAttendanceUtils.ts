import type { AttendanceOverview, AdminClass, AdminStats } from "@/types/models";

export type AttendanceSort = "highest" | "lowest" | "most_records" | "class_name";

export interface IAttendanceTrendPoint {
  label: string;
  percentage: number;
}

export interface IAttendanceClassSegment {
  label: string;
  percentage: number;
  color: string;
}

export interface IAdminAttendanceStats {
  classesTracked: number;
  averageAttendance: number;
  totalStudents: number;
  presentMarks: number;
  absentMarks: number;
  totalMarks: number;
}

export const ATTENDANCE_CHART_COLORS = [
  "#32C991",
  "#2DD4BF",
  "#3B82F6",
  "#8B5CF6",
  "#D4A853",
  "#F59E0B",
  "#EF4444",
];

export function computeAttendanceStats(
  overview: AttendanceOverview[],
  stats?: AdminStats | null
): IAdminAttendanceStats {
  let presentMarks = 0;
  let absentMarks = 0;
  let totalMarks = 0;
  let percentageSum = 0;

  for (const row of overview) {
    presentMarks += row.present;
    absentMarks += row.absent;
    totalMarks += row.total;
    percentageSum += row.percentage;
  }

  const averageAttendance =
    overview.length > 0
      ? Math.round(percentageSum / overview.length)
      : Math.round(stats?.attendanceRate ?? 0);

  return {
    classesTracked: overview.length,
    averageAttendance,
    totalStudents: stats?.totalStudents ?? 0,
    presentMarks,
    absentMarks,
    totalMarks,
  };
}

export function pctOfTotal(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 1000) / 10}% of total`;
}

export function abbreviateClassTitle(title: string, max = 10): string {
  if (title.length <= max) return title;
  return `${title.slice(0, max).trimEnd()}…`;
}

export function buildAttendanceClassTrend(
  overview: AttendanceOverview[],
  limit = 12
): IAttendanceTrendPoint[] {
  return [...overview]
    .sort((a, b) => a.class.title.localeCompare(b.class.title))
    .slice(0, limit)
    .map((row) => ({
      label: abbreviateClassTitle(row.class.title),
      percentage: row.percentage,
    }));
}

export function groupAttendanceByClass(
  overview: AttendanceOverview[]
): IAttendanceClassSegment[] {
  return [...overview]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6)
    .map((row, index) => ({
      label: row.class.title,
      percentage: row.percentage,
      color: ATTENDANCE_CHART_COLORS[index % ATTENDANCE_CHART_COLORS.length],
    }));
}

export function getAttendanceSummary(overview: AttendanceOverview[]): {
  present: number;
  absent: number;
  total: number;
} {
  return overview.reduce(
    (acc, row) => ({
      present: acc.present + row.present,
      absent: acc.absent + row.absent,
      total: acc.total + row.total,
    }),
    { present: 0, absent: 0, total: 0 }
  );
}

export function findClassForRow(
  classes: AdminClass[],
  row: AttendanceOverview
): AdminClass | undefined {
  if (row.class._id) {
    return classes.find((cls) => cls._id === row.class._id);
  }
  return classes.find((cls) => cls.title === row.class.title);
}

export function getTeacherName(cls?: AdminClass): string {
  if (!cls) return "—";
  const teacher = cls.teacher;
  if (teacher && typeof teacher === "object") return teacher.name;
  return "—";
}

export function filterAttendanceOverview(
  overview: AttendanceOverview[],
  options: {
    search: string;
    classFilter: string;
    sortBy: AttendanceSort;
  },
  classes: AdminClass[]
): AttendanceOverview[] {
  const query = options.search.trim().toLowerCase();

  const filtered = overview.filter((row) => {
    const cls = findClassForRow(classes, row);
    const classId = cls?._id ?? row.class._id ?? "";
    if (options.classFilter && classId !== options.classFilter) return false;
    if (!query) return true;
    const teacher = getTeacherName(cls);
    return [row.class.title, teacher].join(" ").toLowerCase().includes(query);
  });

  const sorted = [...filtered];
  switch (options.sortBy) {
    case "lowest":
      sorted.sort((a, b) => a.percentage - b.percentage);
      break;
    case "most_records":
      sorted.sort((a, b) => b.total - a.total);
      break;
    case "class_name":
      sorted.sort((a, b) => a.class.title.localeCompare(b.class.title));
      break;
    default:
      sorted.sort((a, b) => b.percentage - a.percentage);
  }

  return sorted;
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportAttendanceFile(
  overview: AttendanceOverview[],
  classes: AdminClass[]
): void {
  const headers = [
    "Class",
    "Teacher",
    "Total marks",
    "Present",
    "Absent",
    "Attendance %",
  ];

  const rows = overview.map((row) => {
    const cls = findClassForRow(classes, row);
    return [
      row.class.title,
      getTeacherName(cls),
      String(row.total),
      String(row.present),
      String(row.absent),
      String(row.percentage),
    ];
  });

  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "attendance-analytics.csv";
  link.click();
  URL.revokeObjectURL(url);
}
