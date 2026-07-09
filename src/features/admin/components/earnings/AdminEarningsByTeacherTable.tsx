import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { AdminEarningsOverview } from "@/types/models";
import { formatEarningsAmount } from "@/features/admin/components/earnings/adminEarningsUtils";

interface IAdminEarningsByTeacherTableProps {
  data: AdminEarningsOverview | null | undefined;
  onViewAll?: () => void;
}

export function AdminEarningsByTeacherTable({
  data,
  onViewAll,
}: IAdminEarningsByTeacherTableProps) {
  const teachers = data?.teachers ?? [];
  const visible = teachers.slice(0, 5);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">By teacher</h2>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View all
          </button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3">Teacher</th>
              <th className="px-3 py-3">Verified</th>
              <th className="px-3 py-3">Earnings</th>
              <th className="px-3 py-3">Pending</th>
              <th className="px-5 py-3 text-right">Pending est.</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-portal-muted">
                  No earnings data for this month.
                </td>
              </tr>
            ) : (
              visible.map((teacher) => (
                <tr key={teacher.teacherId} className="border-b border-portal/80 last:border-b-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={teacher.teacherName} size="sm" />
                      <span className="font-semibold text-portal-heading">
                        {teacher.teacherName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 tabular-nums text-portal-heading">
                    {teacher.verifiedSessions}
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-emerald-700">
                    {formatEarningsAmount(teacher.totalBdt)}
                  </td>
                  <td className="px-3 py-3.5 tabular-nums font-medium text-amber-700">
                    {teacher.pendingSessions}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gold">
                    {formatEarningsAmount(teacher.pendingBdt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {teachers.length > 5 && onViewAll ? (
        <div className="border-t border-portal px-5 py-3">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View all teachers
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
    </Card>
  );
}
