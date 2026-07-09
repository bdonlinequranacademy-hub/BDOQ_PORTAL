import { Check, Download, Eye, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { ClassLogStatusBadge } from "@/components/schedule/ClassLogStatusBadge";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import type { CurriculumNode } from "@/lib/api/curriculumApi";
import type { ClassLogView } from "@/types/models";
import {
  formatLogDateLabel,
  formatLogTopic,
  type AdminClassLogsTab,
} from "@/features/admin/components/class-logs/adminClassLogsUtils";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminClassLogsTableProps {
  logs: ClassLogView[];
  busy: boolean;
  onView: (log: ClassLogView) => void;
  onApprove: (log: ClassLogView) => void;
  onReject: (log: ClassLogView) => void;
}

export function AdminClassLogsTable({
  logs,
  busy,
  onView,
  onApprove,
  onReject,
}: IAdminClassLogsTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Date &amp; time</th>
              <th className="px-5 py-3.5">Teacher</th>
              <th className="px-5 py-3.5">Class &amp; topic</th>
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">Rate</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                className="border-b border-portal/80 transition hover:bg-portal-muted/25"
              >
                <td className="px-5 py-4">
                  <p className="text-xs font-bold tracking-wide text-portal-muted">
                    {formatLogDateLabel(log.sessionDate)}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-portal-heading">
                    {log.times.academy.time}
                  </p>
                  <p className="text-[11px] text-portal-muted">BD · {log.times.student.time} stu</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <UserInitialAvatar name={log.teacher.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-portal-heading">
                        {log.teacher.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold capitalize text-portal-heading">
                    {log.classTitle}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-portal-muted">
                    {formatLogTopic(log)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-portal-heading">{log.student.name}</p>
                  {log.student.studentId ? (
                    <p className="text-xs text-portal-muted">{log.student.studentId}</p>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm text-portal-heading">{log.durationLabel}</td>
                <td className="px-5 py-4 text-sm font-semibold text-portal-heading">
                  {log.earningsBdt != null ? `৳${log.earningsBdt}` : "—"}
                </td>
                <td className="px-5 py-4">
                  <ClassLogStatusBadge status={log.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(log)}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary"
                      aria-label={`View log for ${log.classTitle}`}
                    >
                      <Eye className="size-4" aria-hidden />
                    </button>
                    {log.status === "pending" || log.status === "rejected" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onApprove(log)}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 transition hover:bg-emerald-500/20 disabled:opacity-50"
                        aria-label="Approve log"
                      >
                        <Check className="size-4" aria-hidden />
                      </button>
                    ) : null}
                    {log.status === "pending" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onReject(log)}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 transition hover:bg-red-500/20 disabled:opacity-50"
                        aria-label="Reject log"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

interface IAdminClassLogsToolbarProps {
  search: string;
  programFilter: string;
  teacherFilter: string;
  dateFrom: string;
  dateTo: string;
  tab: AdminClassLogsTab;
  tabCounts: Record<AdminClassLogsTab, number>;
  teachers: { teacherId: string; teacherName: string }[];
  curriculumTree: CurriculumNode[];
  onSearchChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onTeacherChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onTabChange: (tab: AdminClassLogsTab) => void;
  onExport: () => void;
}

const TABS: { id: AdminClassLogsTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const toolbarFieldClass = cn(
  formControlClass,
  "h-10 min-h-10 py-2 text-sm shadow-none"
);

export function AdminClassLogsToolbar({
  search,
  programFilter,
  teacherFilter,
  dateFrom,
  dateTo,
  tab,
  tabCounts,
  teachers,
  curriculumTree,
  onSearchChange,
  onProgramChange,
  onTeacherChange,
  onDateFromChange,
  onDateToChange,
  onTabChange,
  onExport,
}: IAdminClassLogsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">Search &amp; filters</h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          Narrow logs by teacher, program, or session date.
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
            aria-hidden
          />
          <input
            className={cn(toolbarFieldClass, "pl-9")}
            placeholder="Search teacher, student, class…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search class logs"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap xl:items-center xl:justify-end">
          <CurriculumProgramFilter
            tree={curriculumTree}
            value={programFilter}
            onChange={onProgramChange}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
          />
          <select
            value={teacherFilter}
            onChange={(event) => onTeacherChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[152px] xl:w-auto")}
            aria-label="Filter by teacher"
          >
            <option value="">All teachers</option>
            {teachers.map((teacher) => (
              <option key={teacher.teacherId} value={teacher.teacherId}>
                {teacher.teacherName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label="Date from"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={cn(toolbarFieldClass, "w-full sm:min-w-[140px] xl:w-auto")}
            aria-label="Date to"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-portal pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                tab === item.id
                  ? "bg-primary-dark text-white shadow-sm"
                  : "border border-portal bg-portal-muted/20 text-portal-heading hover:bg-portal-muted/40"
              )}
            >
              {item.label} ({tabCounts[item.id]})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl border border-portal px-4"
          >
            <Download className="size-4" aria-hidden />
            Export
          </Button>
          <Link
            to="/admin/earnings"
            className="inline-flex items-center rounded-xl border border-portal bg-portal-muted/20 px-4 py-2 text-sm font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary"
          >
            Earnings report
          </Link>
        </div>
      </div>
    </div>
  );
}
