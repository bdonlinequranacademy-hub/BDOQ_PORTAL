import { Card } from "@/components/ui/Card";
import { pctOfTotal } from "@/features/admin/components/attendance/adminAttendanceUtils";

interface IAdminAttendanceSummaryCardProps {
  present: number;
  absent: number;
  total: number;
}

export function AdminAttendanceSummaryCard({
  present,
  absent,
  total,
}: IAdminAttendanceSummaryCardProps) {
  const items = [
    { label: "Present", count: present, color: "#32C991" },
    { label: "Absent", count: absent, color: "#EF4444" },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Attendance summary</h2>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 font-medium text-portal-heading">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              <span className="font-semibold tabular-nums">
                {item.count} · {pctOfTotal(item.count, total)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-portal-muted/40">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-portal-muted">
          Based on attendance marks recorded by teachers. Late marks are counted in present rate.
        </p>
      </div>
    </Card>
  );
}
