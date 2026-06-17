import type { ReactNode } from "react";
import { ChevronRight, Users, GraduationCap, Video } from "lucide-react";
import { ClassScheduleChip } from "@/components/classes/ClassScheduleChip";
import type { ScheduleLike } from "@/lib/utils/class";

interface ClassCardProps {
  title: string;
  subtitle?: string;
  schedule?: ScheduleLike;
  studentCount?: number;
  teacherName?: string;
  meetingLink?: string;
  inactive?: boolean;
  onClick: () => void;
  actions?: ReactNode;
  footer?: ReactNode;
}

export function ClassCard({
  title,
  subtitle,
  schedule,
  studentCount,
  teacherName,
  meetingLink,
  inactive,
  onClick,
  actions,
  footer,
}: ClassCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition hover:border-gold/25 hover:shadow-md">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 flex-col gap-3 p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold leading-snug text-navy">{title}</h3>
              {inactive ? (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Inactive
                </span>
              ) : null}
            </div>
            {subtitle ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
            ) : null}
          </div>
          <ChevronRight className="size-5 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-gold" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {teacherName ? (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
              <GraduationCap className="size-3.5 text-zinc-400" />
              {teacherName}
            </span>
          ) : null}
          {typeof studentCount === "number" ? (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
              <Users className="size-3.5 text-zinc-400" />
              {studentCount} student{studentCount !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        <ClassScheduleChip schedule={schedule} />
      </button>

      {(actions || meetingLink || footer) && (
        <div className="flex flex-col gap-2 border-t border-zinc-50 px-5 py-3">
          {footer}
          <div className="flex flex-wrap gap-2">
            {actions}
            {meetingLink ? (
              <a
                href={meetingLink}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2b7fff] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1a6fe8]"
              >
                <Video className="size-3.5" />
                Join class
              </a>
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
