import { Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { ProgressStatusBadge } from "@/features/admin/components/progress/ProgressStatusBadge";
import {
  formatProgressDate,
  type IProgressRowView,
} from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressTableProps {
  rows: IProgressRowView[];
  totalCount: number;
  onView: (row: IProgressRowView) => void;
}

const actionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

function ProgressBar({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="flex min-w-[110px] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-portal-muted/40">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-portal-heading">
        {value}%
      </span>
    </div>
  );
}

export function AdminProgressTable({ rows, totalCount, onView }: IAdminProgressTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">
          Student progress table ({totalCount})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Class</th>
              <th className="px-5 py-3.5">Program</th>
              <th className="px-5 py-3.5">Tajweed</th>
              <th className="px-5 py-3.5">Memorization</th>
              <th className="px-5 py-3.5">Surahs</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Last updated</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-sm text-portal-muted">
                  No progress rows match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-portal/80 transition hover:bg-portal-muted/25"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={row.student?.name ?? "?"} size="sm" />
                      <p className="font-semibold text-portal-heading">
                        {row.student?.name ?? "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-portal-heading">{row.class?.title ?? "—"}</td>
                  <td className="px-5 py-4">
                    {row.curriculumLabels?.program ? (
                      <span className="text-sm text-gold">
                        {formatCurriculumPath(row.curriculumLabels)}
                      </span>
                    ) : (
                      <MissingCurriculumBadge />
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <ProgressBar value={row.tajweedScore ?? 0} colorClass="bg-primary" />
                  </td>
                  <td className="px-5 py-4">
                    <ProgressBar value={row.memorizationPct} colorClass="bg-amber-500" />
                  </td>
                  <td className="px-5 py-4 tabular-nums text-portal-heading">{row.surahCount}</td>
                  <td className="px-5 py-4">
                    <ProgressStatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-4 text-portal-muted">
                    {formatProgressDate(row.updatedAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(row)}
                      className={actionClass}
                      aria-label={`View progress for ${row.student?.name ?? "student"}`}
                    >
                      <Eye className="size-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
