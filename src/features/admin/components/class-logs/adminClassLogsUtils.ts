import type { ClassLogStatus, ClassLogView } from "@/types/models";
import { formatAmPmTime } from "@/i18n/format";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { matchesProgramFilter } from "@/lib/api/curriculumApi";

export type AdminClassLogsTab = "all" | ClassLogStatus;

export interface IAdminClassLogsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgSessionRate: number | null;
}

export interface ITeacherLogCount {
  teacherId: string;
  teacherName: string;
  pendingCount: number;
}

export interface IClassLogActivityItem {
  id: string;
  timeLabel: string;
  title: string;
  detail?: string;
  tone: "pending" | "approved" | "rejected" | "neutral";
}

export function computeClassLogsStats(logs: ClassLogView[]): IAdminClassLogsStats {
  const pending = logs.filter((log) => log.status === "pending").length;
  const approved = logs.filter((log) => log.status === "approved").length;
  const rejected = logs.filter((log) => log.status === "rejected").length;

  const approvedRates = logs
    .filter((log) => log.status === "approved" && log.earningsBdt != null)
    .map((log) => log.earningsBdt as number);

  const avgSessionRate =
    approvedRates.length > 0
      ? Math.round(
          approvedRates.reduce((sum, rate) => sum + rate, 0) / approvedRates.length
        )
      : null;

  return {
    total: logs.length,
    pending,
    approved,
    rejected,
    avgSessionRate,
  };
}

export interface ITeacherFilterOption {
  teacherId: string;
  teacherName: string;
}

export function extractTeacherOptions(logs: ClassLogView[]): ITeacherFilterOption[] {
  const map = new Map<string, string>();

  for (const log of logs) {
    map.set(log.teacher._id, log.teacher.name);
  }

  return [...map.entries()]
    .map(([teacherId, teacherName]) => ({ teacherId, teacherName }))
    .sort((a, b) => a.teacherName.localeCompare(b.teacherName));
}

export function pendingLogsByTeacher(logs: ClassLogView[]): ITeacherLogCount[] {
  const map = new Map<string, ITeacherLogCount>();

  for (const log of logs) {
    if (log.status !== "pending") continue;
    const existing = map.get(log.teacher._id);
    if (existing) {
      existing.pendingCount += 1;
    } else {
      map.set(log.teacher._id, {
        teacherId: log.teacher._id,
        teacherName: log.teacher.name,
        pendingCount: 1,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.pendingCount - a.pendingCount);
}

export function logSearchText(log: ClassLogView): string {
  return [
    log.student?.name,
    log.teacher?.name,
    log.classTitle,
    log.lessonReport,
    log.curriculumLabels?.program,
    log.curriculumLabels?.topic,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function formatLogDateLabel(sessionDate: string): string {
  const date = new Date(sessionDate);
  if (Number.isNaN(date.getTime())) return sessionDate;
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function formatLogTopic(log: ClassLogView): string {
  if (log.curriculumLabels?.program) {
    return formatCurriculumPath(log.curriculumLabels);
  }
  if (log.topicsCovered.length > 0) {
    return log.topicsCovered.slice(0, 2).join(", ");
  }
  return log.courseType;
}

export function filterAdminClassLogs(
  logs: ClassLogView[],
  options: {
    tab: AdminClassLogsTab;
    search: string;
    programFilter: string;
    teacherFilter: string;
    dateFrom: string;
    dateTo: string;
  }
): ClassLogView[] {
  const query = options.search.trim().toLowerCase();

  return logs
    .filter((log) => {
      if (options.tab !== "all" && log.status !== options.tab) return false;
      if (!matchesProgramFilter(log.curriculumProgram, options.programFilter)) return false;
      if (options.teacherFilter && log.teacher._id !== options.teacherFilter) return false;

      const sessionDate = new Date(log.sessionDate);
      if (options.dateFrom && sessionDate < new Date(`${options.dateFrom}T00:00:00`)) {
        return false;
      }
      if (options.dateTo && sessionDate > new Date(`${options.dateTo}T23:59:59`)) {
        return false;
      }

      if (!query) return true;
      return logSearchText(log).includes(query);
    })
    .sort(
      (a, b) =>
        new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime() ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function buildClassLogActivity(logs: ClassLogView[]): IClassLogActivityItem[] {
  return [...logs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map((log) => ({
      id: log._id,
      timeLabel: formatAmPmTime(log.createdAt),
      title: `${log.teacher.name} submitted a log`,
      detail: `${log.classTitle} · ${log.student.name}`,
      tone: log.status,
    }));
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

export function exportClassLogsFile(logs: ClassLogView[], filenamePrefix: string): void {
  const filename = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  const header = [
    "Date",
    "BD Time",
    "Teacher",
    "Student",
    "Class",
    "Topic",
    "Duration",
    "Rate BDT",
    "Status",
  ];

  const lines = [
    header.join(","),
    ...logs.map((log) =>
      [
        csvEscape(log.sessionDate),
        csvEscape(log.times.academy.time),
        csvEscape(log.teacher.name),
        csvEscape(log.student.name),
        csvEscape(log.classTitle),
        csvEscape(formatLogTopic(log)),
        csvEscape(log.durationLabel),
        csvEscape(log.earningsBdt != null ? String(log.earningsBdt) : ""),
        csvEscape(log.status),
      ].join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
