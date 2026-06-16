import { Clock, FileDown } from "lucide-react";
import type { ClassLogView } from "@/types/models";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ClassLogStatusBadge } from "@/components/schedule/ClassLogStatusBadge";
import { printClassLogReport } from "@/lib/utils/classLog";

interface ClassLogCardProps {
  log: ClassLogView;
  showTeacher?: boolean;
  onApprove?: (log: ClassLogView) => void;
  onReject?: (log: ClassLogView) => void;
  actionPending?: boolean;
  approveLabel?: string;
}

export function ClassLogCard({
  log,
  showTeacher = false,
  onApprove,
  onReject,
  actionPending,
  approveLabel = "Approve",
}: ClassLogCardProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ClassLogStatusBadge status={log.status} />
            <span className="text-xs text-zinc-400">{log.sessionDate}</span>
          </div>
          <p className="mt-1 font-bold text-[#03214F]">
            {showTeacher ? log.teacher.name : log.student.name}
          </p>
          <p className="text-xs text-zinc-500">
            {showTeacher ? "Teacher" : log.student.studentId ? `${log.student.studentId} · ` : ""}
            {showTeacher ? (
              log.classTitle
            ) : (
              <CountryLabel country={log.student.country} showFallback />
            )}
          </p>
          {log.curriculumLabels?.program ? (
            <p className="mt-1 text-xs font-medium text-[#C4922B]">
              {formatCurriculumPath(log.curriculumLabels)}
            </p>
          ) : (
            <div className="mt-1">
              <MissingCurriculumBadge />
            </div>
          )}
        </div>
        <div className="rounded-xl bg-[#2b7fff]/10 px-3 py-2 text-center">
          <p className="text-sm font-bold text-[#2b7fff]">{log.times.academy.time}</p>
          <p className="text-[10px] font-medium uppercase text-zinc-400">BD</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F8FAFF] p-3 text-center">
        <div>
          <p className="text-[10px] font-semibold uppercase text-zinc-400">Stu</p>
          <p className="text-xs font-semibold text-[#03214F]">{log.times.student.time}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-zinc-400">Tea</p>
          <p className="text-xs font-semibold text-[#03214F]">{log.times.teacher.time}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-zinc-400">BD</p>
          <p className="text-xs font-semibold text-[#03214F]">{log.times.academy.time}</p>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-50 p-3">
        <p className="text-xs font-semibold uppercase text-zinc-400">Lesson report</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-[#03214F]">{log.lessonReport}</p>
        {log.topicsCovered.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {log.topicsCovered.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-[#03214F]/8 px-2 py-0.5 text-[10px] font-medium text-[#03214F]"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null}
        {log.status === "approved" && log.earningsBdt != null ? (
          <p className="text-sm font-semibold text-[#C4922B]">
            Earnings: ৳{log.earningsBdt.toLocaleString("en-BD")}
          </p>
        ) : null}
        {log.status === "rejected" && log.adminNote ? (
          <p className="mt-2 text-xs text-red-600">Admin note: {log.adminNote}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => printClassLogReport(log)}
          className="inline-flex items-center gap-2 rounded-xl"
        >
          <FileDown className="size-4" />
          Export Report
        </Button>
        {onApprove ? (
          <Button
            type="button"
            onClick={() => onApprove(log)}
            disabled={actionPending}
            className="flex-1 rounded-xl bg-emerald-600 text-white"
          >
            {approveLabel}
          </Button>
        ) : null}
        {onReject ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onReject(log)}
            disabled={actionPending}
            className="flex-1 rounded-xl border-red-200 text-red-600"
          >
            Reject
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Clock className="size-3.5" />
        <span>
          {log.classTitle} · {log.durationLabel} · {log.courseType}
        </span>
      </div>
    </Card>
  );
}
