import type { AdminEarningsOverview, ClassLogView } from "@/types/models";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { formatBdt } from "@/lib/utils/month";

export type EarningsTrendRange = "year" | "six_months";

export interface IAdminEarningsStats {
  totalCombinedBdt: number;
  verifiedBdt: number;
  pendingBdt: number;
  pendingSessions: number;
  verifiedSessions: number;
  totalDeltaPct: number | null;
}

export interface IEarningsTrendPoint {
  label: string;
  amount: number;
}

export interface IEarningsProgramSegment {
  label: string;
  amount: number;
  color: string;
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

export const EARNINGS_PROGRAM_COLORS = [
  "#32C991",
  "#2DD4BF",
  "#3B82F6",
  "#8B5CF6",
  "#D4A853",
  "#F59E0B",
  "#EF4444",
];

export function previousMonthValue(month: string): string {
  const [year, monthNum] = month.split("-").map(Number);
  const date = new Date(year, monthNum - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function sumPendingBdt(data?: AdminEarningsOverview | null): number {
  return (data?.teachers ?? []).reduce((sum, teacher) => sum + teacher.pendingBdt, 0);
}

export function computeEarningsStats(
  data: AdminEarningsOverview | null | undefined,
  previous?: AdminEarningsOverview | null
): IAdminEarningsStats {
  const verifiedBdt = data?.totalBdt ?? 0;
  const pendingBdt = sumPendingBdt(data);
  const totalCombinedBdt = verifiedBdt + pendingBdt;
  const prevCombined =
    (previous?.totalBdt ?? 0) + sumPendingBdt(previous);

  const totalDeltaPct =
    prevCombined > 0
      ? Math.round(((totalCombinedBdt - prevCombined) / prevCombined) * 1000) / 10
      : null;

  return {
    totalCombinedBdt,
    verifiedBdt,
    pendingBdt,
    pendingSessions: data?.pendingSessions ?? 0,
    verifiedSessions: data?.verifiedSessions ?? 0,
    totalDeltaPct,
  };
}

export function pctOfTotal(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 1000) / 10}% of total`;
}

export function logMatchesMonth(log: ClassLogView, month: string): boolean {
  const sessionMonth = log.sessionDate.slice(0, 7);
  return sessionMonth === month;
}

export function getProgramLabel(log: ClassLogView): string {
  if (log.curriculumLabels?.program) {
    return formatCurriculumPath(log.curriculumLabels);
  }
  return log.courseType || log.classTitle;
}

export function groupEarningsByProgram(
  logs: ClassLogView[],
  month: string
): IEarningsProgramSegment[] {
  const map = new Map<string, number>();

  for (const log of logs) {
    if (log.status !== "approved" || !logMatchesMonth(log, month)) continue;
    const amount = log.earningsBdt ?? 0;
    if (amount <= 0) continue;
    const label = getProgramLabel(log);
    map.set(label, (map.get(label) ?? 0) + amount);
  }

  return [...map.entries()]
    .map(([label, amount], index) => ({
      label,
      amount,
      color: EARNINGS_PROGRAM_COLORS[index % EARNINGS_PROGRAM_COLORS.length],
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);
}

export function buildEarningsTrend(
  logs: ClassLogView[],
  range: EarningsTrendRange
): IEarningsTrendPoint[] {
  const now = new Date();
  const year = now.getFullYear();
  const monthCount = range === "year" ? now.getMonth() + 1 : 6;
  const startMonth = range === "year" ? 0 : Math.max(0, now.getMonth() - 5);

  const buckets = Array.from({ length: monthCount }, (_, index) => {
    const monthIndex = range === "year" ? index : startMonth + index;
    return {
      label: MONTH_LABELS[monthIndex],
      monthIndex,
      amount: 0,
    };
  });

  for (const log of logs) {
    if (log.status !== "approved") continue;
    const session = new Date(log.sessionDate);
    if (session.getFullYear() !== year) continue;
    const bucket = buckets.find((entry) => entry.monthIndex === session.getMonth());
    if (!bucket) continue;
    bucket.amount += log.earningsBdt ?? 0;
  }

  return buckets.map(({ label, amount }) => ({ label, amount }));
}

export function getPendingApprovalLogs(logs: ClassLogView[]): ClassLogView[] {
  return [...logs]
    .filter((log) => log.status === "pending")
    .sort(
      (a, b) =>
        new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime() ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getUpcomingPendingLogs(logs: ClassLogView[], limit = 4): ClassLogView[] {
  return getPendingApprovalLogs(logs).slice(0, limit);
}

export function getRecentVerifiedLogs(logs: ClassLogView[], limit = 5): ClassLogView[] {
  return [...logs]
    .filter((log) => log.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.approvedAt ?? b.sessionDate).getTime() -
        new Date(a.approvedAt ?? a.sessionDate).getTime()
    )
    .slice(0, limit);
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportEarningsTeachersFile(
  data: AdminEarningsOverview | null | undefined,
  month: string
): void {
  const headers = [
    "Teacher",
    "Verified Sessions",
    "Verified Pay (BDT)",
    "Pending Sessions",
    "Pending Est. (BDT)",
  ];

  const rows = (data?.teachers ?? []).map((teacher) => [
    teacher.teacherName,
    String(teacher.verifiedSessions),
    String(teacher.totalBdt),
    String(teacher.pendingSessions),
    String(teacher.pendingBdt),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `teacher-pay-${month}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatEarningsAmount(amount: number): string {
  return formatBdt(amount);
}

export function formatShortBdt(amount: number): string {
  if (amount >= 1000) {
    return `৳${Math.round(amount / 100) / 10}k`;
  }
  return formatBdt(amount);
}
