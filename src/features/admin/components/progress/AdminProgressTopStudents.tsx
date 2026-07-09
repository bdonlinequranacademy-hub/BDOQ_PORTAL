import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { IProgressTopStudent } from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressTopStudentsProps {
  students: IProgressTopStudent[];
}

export function AdminProgressTopStudents({ students }: IAdminProgressTopStudentsProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Top students</h2>
      <p className="mt-0.5 text-xs text-portal-muted">Highest overall progress</p>
      <div className="mt-4 flex flex-1 flex-col gap-3">
        {students.length === 0 ? (
          <p className="py-6 text-center text-sm text-portal-muted">No progress data yet.</p>
        ) : (
          students.map((student) => (
            <div
              key={student.studentId}
              className="flex items-center gap-3 rounded-xl border border-portal/80 bg-portal-muted/15 p-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {student.rank}
              </span>
              <UserInitialAvatar name={student.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-portal-heading">{student.name}</p>
                <p className="truncate text-xs text-portal-muted">{student.program}</p>
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums text-primary">
                {student.overall}%
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
